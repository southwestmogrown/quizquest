interface ProgressBarProps {
  percent: number;
  /** Accessible label for screen readers — passed as aria-label on the progressbar element. */
  label?: string;
  /** ID of an external element that labels this progress bar — passed as aria-labelledby. */
  labelledBy?: string;
  /** When true, renders the percentage value beside the bar. */
  showPercent?: boolean;
}

function normalizePercent(percent: number): number {
  if (!Number.isFinite(percent)) {
    return percent === Infinity ? 100 : 0;
  }
  return Math.min(100, Math.max(0, percent));
}

export default function ProgressBar({
  percent,
  label,
  labelledBy,
  showPercent,
}: ProgressBarProps) {
  const clamped = normalizePercent(percent);

  const bar = (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(label && { "aria-label": label })}
      {...(labelledBy && { "aria-labelledby": labelledBy })}
      className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden"
    >
      <div
        className="h-full bg-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.4)] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );

  if (!showPercent) return bar;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">{bar}</div>
      <span className="shrink-0 text-xs font-mono text-stone-400 w-9 text-right">
        {clamped}%
      </span>
    </div>
  );
}
