package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os/exec"
	"testing"
)

// goAvailable returns true when the go binary is reachable.
func goAvailable() bool {
	_, err := exec.LookPath("go")
	return err == nil
}

func post(t *testing.T, body any) *httptest.ResponseRecorder {
	t.Helper()
	b, err := json.Marshal(body)
	if err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodPost, "/run", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handleRun(rr, req)
	return rr
}

func decode(t *testing.T, rr *httptest.ResponseRecorder) runResponse {
	t.Helper()
	var resp runResponse
	if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
		t.Fatalf("decode: %v", err)
	}
	return resp
}

// --- validation tests (no Go toolchain needed) --------------------------------

func TestMissingLanguage(t *testing.T) {
	rr := post(t, map[string]any{"code": "package main\nfunc main(){}"})
	if rr.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d", rr.Code)
	}
}

func TestUnsupportedLanguage(t *testing.T) {
	rr := post(t, map[string]any{"language": "python", "code": "print('hi')"})
	if rr.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d", rr.Code)
	}
}

func TestMissingCode(t *testing.T) {
	rr := post(t, map[string]any{"language": "go"})
	if rr.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d", rr.Code)
	}
}

func TestTimeoutTooLarge(t *testing.T) {
	rr := post(t, map[string]any{
		"language":       "go",
		"code":           "package main\nfunc main(){}",
		"timeoutSeconds": 999,
	})
	if rr.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d", rr.Code)
	}
}

func TestInvalidJSON(t *testing.T) {
	req := httptest.NewRequest(http.MethodPost, "/run", bytes.NewBufferString("not json"))
	rr := httptest.NewRecorder()
	handleRun(rr, req)
	if rr.Code != http.StatusUnprocessableEntity {
		t.Fatalf("want 422, got %d", rr.Code)
	}
}

// --- execution tests (require Go toolchain in PATH) ---------------------------

func TestHelloWorld(t *testing.T) {
	if !goAvailable() {
		t.Skip("go toolchain not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "go",
		"code":           "package main\nimport \"fmt\"\nfunc main(){fmt.Println(\"Hello, World!\")}",
		"timeoutSeconds": 15,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d: %s", rr.Code, rr.Body.String())
	}
	resp := decode(t, rr)
	if resp.ExitCode != 0 {
		t.Fatalf("want exit 0, got %d; stderr: %s", resp.ExitCode, resp.Stderr)
	}
	if resp.Stdout != "Hello, World!\n" {
		t.Fatalf("unexpected stdout: %q", resp.Stdout)
	}
}

func TestCompileError(t *testing.T) {
	if !goAvailable() {
		t.Skip("go toolchain not in PATH")
	}
	// fmt is used but not imported — compile error.
	rr := post(t, map[string]any{
		"language":       "go",
		"code":           "package main\nfunc main(){fmt.Println(\"oops\")}",
		"timeoutSeconds": 15,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.ExitCode == 0 {
		t.Fatal("want non-zero exit for compile error")
	}
	if resp.Stderr == "" {
		t.Fatal("want stderr output for compile error")
	}
}

func TestStdin(t *testing.T) {
	if !goAvailable() {
		t.Skip("go toolchain not in PATH")
	}
	code := `package main
import (
	"bufio"
	"fmt"
	"os"
)
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	scanner.Scan()
	fmt.Println("got: " + scanner.Text())
}`
	rr := post(t, map[string]any{
		"language":       "go",
		"code":           code,
		"stdin":          "hello",
		"timeoutSeconds": 15,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.Stdout != "got: hello\n" {
		t.Fatalf("unexpected stdout: %q", resp.Stdout)
	}
}

func TestTimeout(t *testing.T) {
	if !goAvailable() {
		t.Skip("go toolchain not in PATH")
	}
	code := `package main
func main() {
	for {}
}`
	rr := post(t, map[string]any{
		"language":       "go",
		"code":           code,
		"timeoutSeconds": 2,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if !resp.TimedOut {
		t.Fatal("want timedOut=true")
	}
	if resp.ExitCode != -1 {
		t.Fatalf("want exitCode=-1 for timeout, got %d", resp.ExitCode)
	}
}
