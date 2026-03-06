import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Build a successful code-runner response with sensible defaults. */
function makeRunnerResponse(overrides: Record<string, unknown> = {}) {
  return {
    stdout: "Hello, World!\n",
    stderr: "",
    exitCode: 0,
    timedOut: false,
    ...overrides,
  };
}

/** Stub global fetch to return the given runner response. */
function mockRunnerOk(runnerPayload: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(runnerPayload),
    })
  );
}

// ---------------------------------------------------------------------------
// Validation — HTTP 422
// ---------------------------------------------------------------------------

describe("POST /api/run — validation (HTTP 422)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 422 when body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("returns 422 when language is missing", async () => {
    const res = await POST(makeRequest({ code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("language");
  });

  it("returns 422 when language is an empty string", async () => {
    const res = await POST(makeRequest({ language: "", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when language is a whitespace-only string", async () => {
    const res = await POST(makeRequest({ language: "   ", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when language is unsupported", async () => {
    const res = await POST(makeRequest({ language: "brainfuck", code: "++++" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("brainfuck");
  });

  it("returns 422 when code is missing", async () => {
    const res = await POST(makeRequest({ language: "go" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("code");
  });

  it("returns 422 when code is an empty string", async () => {
    const res = await POST(makeRequest({ language: "go", code: "" }));
    expect(res.status).toBe(422);
  });

  it("returns 422 when code is a whitespace-only string", async () => {
    const res = await POST(makeRequest({ language: "go", code: "   \n  " }));
    expect(res.status).toBe(422);
  });
});

// ---------------------------------------------------------------------------
// Successful execution — HTTP 200
// ---------------------------------------------------------------------------

describe("POST /api/run — successful execution (HTTP 200)", () => {
  beforeEach(() => {
    mockRunnerOk(makeRunnerResponse());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 200 for a valid go request", async () => {
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(200);
  });

  it("response body contains stdout, stderr, exitCode", async () => {
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    const body = await res.json();
    expect(body).toEqual({ stdout: "Hello, World!\n", stderr: "", exitCode: 0 });
  });

  it("returns 200 even when runner exit code is non-zero", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "", stderr: "compile error\n", exitCode: 1 }));
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.exitCode).toBe(1);
    expect(body.stderr).toBe("compile error\n");
  });

  it("returns 200 for a timed-out execution (exitCode -1, timedOut true)", async () => {
    mockRunnerOk(makeRunnerResponse({ stdout: "", stderr: "", exitCode: -1, timedOut: true }));
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.exitCode).toBe(-1);
  });

  it("does not include timedOut or error in the response body", async () => {
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    const body = await res.json();
    expect(body).not.toHaveProperty("timedOut");
    expect(body).not.toHaveProperty("error");
  });
});

// ---------------------------------------------------------------------------
// Infrastructure failures — HTTP 503
// ---------------------------------------------------------------------------

describe("POST /api/run — infrastructure failures (HTTP 503)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 503 when fetch throws (network error)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });

  it("returns 503 when runner responds with a non-2xx status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503, json: () => Promise.resolve({}) })
    );
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });

  it("returns 503 when runner response contains an error field", async () => {
    mockRunnerOk(makeRunnerResponse({ error: "container spawn failure", exitCode: -1 }));
    const res = await POST(makeRequest({ language: "go", code: "package main\nfunc main(){}" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe("Runner unavailable");
  });
});
