// ---------------------------------------------------------------------------
// POST /api/run — execute user code, no grading, no DB writes, no XP.
//
// Accepts:  { language, code }
// Returns:  { stdout, stderr, exitCode }            — HTTP 200
//           { error: string }                        — HTTP 422 (bad request)
//           { error: "Runner unavailable" }          — HTTP 503 (infra failure)
//
// See docs/api/code-runner-contract.md for the full contract.
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import type { CodeRunnerRequest, CodeRunnerResponse } from "@/lib/code-runner/types";

/** Languages supported by the MVP runner (contract §5). */
const SUPPORTED_LANGUAGES = new Set(["go"]);

/** Default timeout forwarded to the runner (contract §6). */
const DEFAULT_TIMEOUT_SECONDS = 10;

/** Base URL of the code-runner service (trailing slashes normalised). */
const _RAW_RUNNER_URL = process.env.CODE_RUNNER_URL;
const CODE_RUNNER_URL = (
  _RAW_RUNNER_URL && _RAW_RUNNER_URL.trim() !== ""
    ? _RAW_RUNNER_URL.trim()
    : "http://localhost:8080"
).replace(/\/+$/, "");

/** Maximum allowed code size in bytes (contract §6). */
const MAX_CODE_BYTES = 64 * 1024; // 64 KB

/** Client-side fetch deadline: runner timeout + 5 s grace period (ms). */
const FETCH_TIMEOUT_MS = (DEFAULT_TIMEOUT_SECONDS + 5) * 1_000;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ----- 1. Parse and validate the request body ---------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 422 }
    );
  }

  const { language, code } = (body ?? {}) as Record<string, unknown>;

  if (typeof language !== "string" || language.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: language" },
      { status: 422 }
    );
  }

  if (!SUPPORTED_LANGUAGES.has(language.trim())) {
    return NextResponse.json(
      { error: `Unsupported language: ${language.trim()}` },
      { status: 422 }
    );
  }

  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.json(
      { error: "Missing or invalid field: code" },
      { status: 422 }
    );
  }

  // Contract §6 — reject requests exceeding the 64 KB code size limit.
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return NextResponse.json(
      { error: "Code exceeds the 64 KB size limit" },
      { status: 413 }
    );
  }

  // ----- 2. Call the code-runner service ----------------------------------
  const runnerRequest: CodeRunnerRequest = {
    language: language.trim(),
    code,
    stdin: "",
    timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
  };

  let runnerResponse: CodeRunnerResponse;
  try {
    const res = await fetch(`${CODE_RUNNER_URL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(runnerRequest),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      // Forward caller-side errors from the runner (contract §7.3).
      if (res.status === 413 || res.status === 422) {
        const errBody = await res.json().catch(() => ({})) as { error?: string };
        return NextResponse.json(
          { error: errBody.error ?? "Invalid request" },
          { status: res.status }
        );
      }
      return NextResponse.json(
        { error: "Runner unavailable" },
        { status: 503 }
      );
    }

    runnerResponse = (await res.json()) as CodeRunnerResponse;
  } catch {
    return NextResponse.json(
      { error: "Runner unavailable" },
      { status: 503 }
    );
  }

  // ----- 3. Surface infrastructure failures from the runner ---------------
  // An `error` field in the runner response means execution could not be
  // attempted — return 503 (contract §7.2).
  if (runnerResponse.error) {
    return NextResponse.json(
      { error: "Runner unavailable" },
      { status: 503 }
    );
  }

  // ----- 4. Return execution result (200 even for non-zero exit codes) ----
  return NextResponse.json({
    stdout: runnerResponse.stdout,
    stderr: runnerResponse.stderr,
    exitCode: runnerResponse.exitCode,
  });
}
