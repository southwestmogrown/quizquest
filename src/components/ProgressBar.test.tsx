import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with 0%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={0} />);
    expect(html).toContain('width:0%');
  });

  it("renders with 100%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={100} />);
    expect(html).toContain('width:100%');
  });

  it("renders with an intermediate percentage", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={42} />);
    expect(html).toContain('width:42%');
  });

  it("clamps values above 100 to 100%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={150} />);
    expect(html).toContain('width:100%');
  });

  it("clamps values below 0 to 0%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={-10} />);
    expect(html).toContain('width:0%');
  });

  it("clamps Infinity to 100%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={Infinity} />);
    expect(html).toContain('width:100%');
    expect(html).toContain('aria-valuenow="100"');
  });

  it("clamps -Infinity to 0%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={-Infinity} />);
    expect(html).toContain('width:0%');
    expect(html).toContain('aria-valuenow="0"');
  });

  it("clamps NaN to 0%", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={NaN} />);
    expect(html).toContain('width:0%');
    expect(html).toContain('aria-valuenow="0"');
  });

  it("includes a progressbar role", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={50} />);
    expect(html).toContain('role="progressbar"');
  });

  it("exposes aria-valuenow", () => {
    const html = renderToStaticMarkup(<ProgressBar percent={75} />);
    expect(html).toContain('aria-valuenow="75"');
  });

  it("applies aria-label when label prop is provided", () => {
    const html = renderToStaticMarkup(
      <ProgressBar percent={50} label="Course completion" />
    );
    expect(html).toContain('aria-label="Course completion"');
  });

  it("applies aria-labelledby when labelledBy prop is provided", () => {
    const html = renderToStaticMarkup(
      <ProgressBar percent={50} labelledBy="progress-heading" />
    );
    expect(html).toContain('aria-labelledby="progress-heading"');
  });
});
