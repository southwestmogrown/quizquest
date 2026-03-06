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

/** Base URL of the code-runner service. */
const CODE_RUNNER_URL =
  process.env.CODE_RUNNER_URL ?? "http://localhost:8080";

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
    });

    if (!res.ok) {
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
