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

// pythonAvailable returns true when the python3 binary is reachable.
func pythonAvailable() bool {
	_, err := exec.LookPath("python3")
	return err == nil
}

// nodeAvailable returns true when the node binary is reachable.
func nodeAvailable() bool {
	_, err := exec.LookPath("node")
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
	rr := post(t, map[string]any{"language": "brainfuck", "code": "++++"})
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

// --- Python execution tests (require python3 in PATH) -------------------------

func TestPythonHelloWorld(t *testing.T) {
	if !pythonAvailable() {
		t.Skip("python3 not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "python",
		"code":           "print('Hello, World!')",
		"timeoutSeconds": 10,
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

func TestPythonSyntaxError(t *testing.T) {
	if !pythonAvailable() {
		t.Skip("python3 not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "python",
		"code":           "def foo(\n",
		"timeoutSeconds": 10,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.ExitCode == 0 {
		t.Fatal("want non-zero exit for syntax error")
	}
	if resp.Stderr == "" {
		t.Fatal("want stderr output for syntax error")
	}
}

func TestPythonStdin(t *testing.T) {
	if !pythonAvailable() {
		t.Skip("python3 not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "python",
		"code":           "line = input()\nprint('got: ' + line)",
		"stdin":          "hello",
		"timeoutSeconds": 10,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.Stdout != "got: hello\n" {
		t.Fatalf("unexpected stdout: %q", resp.Stdout)
	}
}

func TestPythonTimeout(t *testing.T) {
	if !pythonAvailable() {
		t.Skip("python3 not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "python",
		"code":           "while True: pass",
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

// --- JavaScript (Node.js) execution tests (require node in PATH) --------------

func TestJavaScriptHelloWorld(t *testing.T) {
	if !nodeAvailable() {
		t.Skip("node not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "javascript",
		"code":           "console.log('Hello, World!')",
		"timeoutSeconds": 10,
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

func TestJavaScriptSyntaxError(t *testing.T) {
	if !nodeAvailable() {
		t.Skip("node not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "javascript",
		"code":           "function foo( {",
		"timeoutSeconds": 10,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.ExitCode == 0 {
		t.Fatal("want non-zero exit for syntax error")
	}
	if resp.Stderr == "" {
		t.Fatal("want stderr output for syntax error")
	}
}

func TestJavaScriptStdin(t *testing.T) {
	if !nodeAvailable() {
		t.Skip("node not in PATH")
	}
	code := `const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const line = Buffer.concat(chunks).toString().trim();
  console.log('got: ' + line);
});`
	rr := post(t, map[string]any{
		"language":       "javascript",
		"code":           code,
		"stdin":          "hello",
		"timeoutSeconds": 10,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("want 200, got %d", rr.Code)
	}
	resp := decode(t, rr)
	if resp.Stdout != "got: hello\n" {
		t.Fatalf("unexpected stdout: %q", resp.Stdout)
	}
}

func TestJavaScriptTimeout(t *testing.T) {
	if !nodeAvailable() {
		t.Skip("node not in PATH")
	}
	rr := post(t, map[string]any{
		"language":       "javascript",
		"code":           "while(true){}",
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
