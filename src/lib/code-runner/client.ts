const DEFAULT_RUNNER_ORIGIN = "http://localhost:8080";

export const DEFAULT_TIMEOUT_SECONDS = 10;
export const FETCH_TIMEOUT_MS = (DEFAULT_TIMEOUT_SECONDS + 5) * 1_000;

export function getCodeRunnerBaseUrl(rawUrl = process.env.CODE_RUNNER_URL): string {
  const trimmedUrl = rawUrl?.trim();

  if (!trimmedUrl) {
    return DEFAULT_RUNNER_ORIGIN;
  }

  const withProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `http://${trimmedUrl}`;

  // Accept either a base URL (recommended) or a URL that mistakenly includes
  // the /run endpoint, and normalize to a base URL.
  return withProtocol.replace(/\/run\/?$/i, "").replace(/\/+$/, "");
}