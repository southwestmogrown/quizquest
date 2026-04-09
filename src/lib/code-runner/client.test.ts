import { describe, expect, it } from "vitest";
import { getCodeRunnerBaseUrl } from "./client";

describe("getCodeRunnerBaseUrl", () => {
  it("falls back to localhost when the env var is unset", () => {
    expect(getCodeRunnerBaseUrl(undefined)).toBe("http://localhost:8080");
  });

  it("normalizes a full public URL", () => {
    expect(getCodeRunnerBaseUrl("https://runner.example.com/")).toBe(
      "https://runner.example.com"
    );
  });

  it("prefixes Render hostport values with http", () => {
    expect(getCodeRunnerBaseUrl("quizquest-runner:8080")).toBe(
      "http://quizquest-runner:8080"
    );
  });

  it("strips a trailing /run endpoint if present", () => {
    expect(getCodeRunnerBaseUrl("https://runner.example.com/run")).toBe(
      "https://runner.example.com"
    );
  });
});