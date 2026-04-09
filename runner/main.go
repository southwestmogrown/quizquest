// Code runner service for QuizQuest.
// Implements POST /run per docs/api/code-runner-contract.md.
//
// Execution model (Go):
//   1. Write user code to a temp directory.
//   2. Run "go run main.go" with stdin piped, stdout/stderr captured.
//   3. Kill the process if it exceeds timeoutSeconds.
//   4. Return { stdout, stderr, exitCode, timedOut }.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// Request/response shapes match docs/api/code-runner-contract.md §3–4.

type runRequest struct {
	Language       string `json:"language"`
	Code           string `json:"code"`
	Stdin          string `json:"stdin"`
	TimeoutSeconds int    `json:"timeoutSeconds"`
}

type runResponse struct {
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exitCode"`
	TimedOut bool   `json:"timedOut"`
	Error    string `json:"error,omitempty"`
}

const (
	maxCodeBytes   = 64 * 1024      // 64 KB (contract §6)
	maxOutputBytes = 1 * 1024 * 1024 // 1 MB per stream (contract §6)
	maxTimeout     = 30             // seconds (contract §6)
	defaultTimeout = 10             // seconds (contract §6)
)

var supportedLanguages = map[string]bool{
	"go": true,
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /run", handleRun)
	mux.HandleFunc("GET /healthz", handleHealth)

	addr := ":" + port
	log.Printf("code-runner listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func handleHealth(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func handleRun(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// --- 1. Decode and validate request -----------------------------------

	body, err := io.ReadAll(io.LimitReader(r.Body, maxCodeBytes+4096))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to read request body")
		return
	}

	var req runRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid JSON body")
		return
	}

	req.Language = strings.TrimSpace(req.Language)
	if req.Language == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing or invalid field: language")
		return
	}
	if !supportedLanguages[req.Language] {
		writeError(w, http.StatusUnprocessableEntity, fmt.Sprintf("unsupported language: %s", req.Language))
		return
	}

	if strings.TrimSpace(req.Code) == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing or invalid field: code")
		return
	}
	if len(req.Code) > maxCodeBytes {
		writeError(w, http.StatusRequestEntityTooLarge, "code exceeds the 64 KB size limit")
		return
	}

	timeout := req.TimeoutSeconds
	if timeout <= 0 {
		timeout = defaultTimeout
	}
	if timeout > maxTimeout {
		writeError(w, http.StatusUnprocessableEntity, fmt.Sprintf("timeoutSeconds must be between 1 and %d", maxTimeout))
		return
	}

	// --- 2. Execute -------------------------------------------------------

	var resp runResponse
	switch req.Language {
	case "go":
		resp = executeGo(req.Code, req.Stdin, timeout)
	default:
		// Guarded above — should never reach here.
		writeError(w, http.StatusUnprocessableEntity, "unsupported language")
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

// executeGo writes code to a temp dir, runs "go run main.go", and returns the result.
func executeGo(code, stdin string, timeoutSeconds int) runResponse {
	// Create isolated temp directory for this request.
	dir, err := os.MkdirTemp("", "quizquest-runner-*")
	if err != nil {
		return infraError("failed to create temp dir")
	}
	defer os.RemoveAll(dir)

	// Write go.mod so the code runs in module-aware mode without a module cache lookup.
	goMod := "module usercode\n\ngo 1.22\n"
	if err := os.WriteFile(filepath.Join(dir, "go.mod"), []byte(goMod), 0600); err != nil {
		return infraError("failed to write go.mod")
	}

	// Write source file.
	srcPath := filepath.Join(dir, "main.go")
	if err := os.WriteFile(srcPath, []byte(code), 0600); err != nil {
		return infraError("failed to write source file")
	}

	// Build execution context with timeout.
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutSeconds)*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "go", "run", srcPath)
	cmd.Stdin = strings.NewReader(stdin)

	// Capture stdout and stderr, each capped at 1 MB.
	var stdoutBuf, stderrBuf limitedBuffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf

	// Set a clean, minimal environment — prevents leaking host secrets.
	cmd.Env = goEnv(dir)
	cmd.Dir = dir

	runErr := cmd.Run()

	timedOut := ctx.Err() == context.DeadlineExceeded
	exitCode := 0
	if runErr != nil {
		if exitErr, ok := runErr.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else if timedOut {
			exitCode = -1
		} else {
			exitCode = -1
		}
	}
	if timedOut {
		exitCode = -1
	}

	return runResponse{
		Stdout:   stdoutBuf.String(),
		Stderr:   stderrBuf.String(),
		ExitCode: exitCode,
		TimedOut: timedOut,
	}
}

// goEnv returns a minimal environment for Go execution.
// GOPATH and GOCACHE are pointed at the temp dir so each run is isolated.
func goEnv(dir string) []string {
	goroot := os.Getenv("GOROOT")
	if goroot == "" {
		goroot = "/usr/local/go"
	}
	path := goroot + "/bin:/usr/local/bin:/usr/bin:/bin"
	return []string{
		"HOME=/tmp",
		"GOROOT=" + goroot,
		"GOPATH=" + filepath.Join(dir, "gopath"),
		"GOCACHE=" + filepath.Join(dir, "gocache"),
		"GONOSUMDB=*",
		"GOFLAGS=",
		"PATH=" + path,
	}
}

// infraError returns a runResponse representing an infrastructure-level failure.
func infraError(msg string) runResponse {
	return runResponse{
		Stdout:   "",
		Stderr:   "",
		ExitCode: -1,
		TimedOut: false,
		Error:    msg,
	}
}

// writeError writes a JSON error response and sets the HTTP status.
func writeError(w http.ResponseWriter, status int, msg string) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(runResponse{
		Stdout:   "",
		Stderr:   "",
		ExitCode: -1,
		TimedOut: false,
		Error:    msg,
	})
}

// limitedBuffer is an io.Writer that discards bytes beyond maxOutputBytes.
type limitedBuffer struct {
	buf []byte
}

func (b *limitedBuffer) Write(p []byte) (int, error) {
	remaining := maxOutputBytes - len(b.buf)
	if remaining <= 0 {
		return len(p), nil // discard silently (contract §6)
	}
	if len(p) > remaining {
		p = p[:remaining]
	}
	b.buf = append(b.buf, p...)
	return len(p), nil
}

func (b *limitedBuffer) String() string {
	return string(b.buf)
}
