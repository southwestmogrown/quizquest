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

	// Verify execution environment on startup — fail fast if the runner
	// cannot create temp dirs or invoke the Go toolchain.
	verifyEnvironment()

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

	log.Printf("POST /run received")

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

	if resp.Error != "" {
		log.Printf("POST /run infra error: %s", resp.Error)
	} else {
		log.Printf("POST /run completed: exitCode=%d timedOut=%v stdout=%d stderr=%d",
			resp.ExitCode, resp.TimedOut, len(resp.Stdout), len(resp.Stderr))
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

// executeGo writes code to a temp dir, runs "go run main.go", and returns the result.
func executeGo(code, stdin string, timeoutSeconds int) runResponse {
	// Use RUNNER_TMPDIR if set (dedicated writable dir), else fall back to os.TempDir().
	tmpBase := os.Getenv("RUNNER_TMPDIR")
	if tmpBase == "" {
		tmpBase = os.TempDir()
	}

	// Create isolated temp directory for this request.
	dir, err := os.MkdirTemp(tmpBase, "quizquest-runner-*")
	if err != nil {
		log.Printf("executeGo: MkdirTemp(%q) failed: %v", tmpBase, err)
		return infraError(fmt.Sprintf("failed to create temp dir: %v", err))
	}
	defer os.RemoveAll(dir)

	// Write go.mod so the code runs in module-aware mode without a module cache lookup.
	goMod := "module usercode\n\ngo 1.22\n"
	if err := os.WriteFile(filepath.Join(dir, "go.mod"), []byte(goMod), 0600); err != nil {
		log.Printf("executeGo: write go.mod failed: %v", err)
		return infraError(fmt.Sprintf("failed to write go.mod: %v", err))
	}

	// Write source file.
	srcPath := filepath.Join(dir, "main.go")
	if err := os.WriteFile(srcPath, []byte(code), 0600); err != nil {
		log.Printf("executeGo: write source file failed: %v", err)
		return infraError(fmt.Sprintf("failed to write source file: %v", err))
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
			// Command couldn't start (e.g. binary not found, permission denied).
			log.Printf("executeGo: cmd.Run non-exit error: %v", runErr)
			exitCode = -1
			// Include the error in stderr so the caller can diagnose.
			if stderrBuf.String() == "" {
				stderrBuf.Write([]byte(runErr.Error()))
			}
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

	// Use the pre-warmed build cache if it exists (avoids recompiling std
	// on every request). Falls back to per-request cache dir otherwise.
	gocache := filepath.Join(dir, "gocache")
	if warmCache := os.Getenv("RUNNER_TMPDIR"); warmCache != "" {
		candidate := filepath.Join(warmCache, "gocache")
		if info, err := os.Stat(candidate); err == nil && info.IsDir() {
			gocache = candidate
		}
	}

	return []string{
		"HOME=" + dir,
		"GOROOT=" + goroot,
		"GOPATH=" + filepath.Join(dir, "gopath"),
		"GOCACHE=" + gocache,
		"GONOSUMDB=*",
		"GOFLAGS=",
		"PATH=" + path,
	}
}

// verifyEnvironment runs a quick self-check on startup to confirm the runner
// can create temp dirs and invoke the Go toolchain. Fails fast with logs if
// something is wrong.
func verifyEnvironment() {
	tmpBase := os.Getenv("RUNNER_TMPDIR")
	if tmpBase == "" {
		tmpBase = os.TempDir()
	}
	log.Printf("verify: RUNNER_TMPDIR=%q (resolved tmpBase=%q)", os.Getenv("RUNNER_TMPDIR"), tmpBase)

	dir, err := os.MkdirTemp(tmpBase, "verify-*")
	if err != nil {
		log.Fatalf("STARTUP CHECK FAILED: cannot create temp dir in %q: %v", tmpBase, err)
	}
	defer os.RemoveAll(dir)

	srcPath := filepath.Join(dir, "main.go")
	if err := os.WriteFile(srcPath, []byte("package main\nimport \"fmt\"\nfunc main(){fmt.Print(\"ok\")}\n"), 0600); err != nil {
		log.Fatalf("STARTUP CHECK FAILED: cannot write source file: %v", err)
	}
	goModPath := filepath.Join(dir, "go.mod")
	if err := os.WriteFile(goModPath, []byte("module verify\n\ngo 1.22\n"), 0600); err != nil {
		log.Fatalf("STARTUP CHECK FAILED: cannot write go.mod: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, "go", "run", srcPath)
	cmd.Env = goEnv(dir)
	cmd.Dir = dir
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("STARTUP CHECK FAILED: 'go run' returned error: %v\noutput: %s", err, string(out))
	}
	if string(out) != "ok" {
		log.Fatalf("STARTUP CHECK FAILED: expected 'ok', got %q", string(out))
	}

	log.Printf("verify: startup self-test passed (go run works, temp dirs writable)")
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
