interface ProgressBarProps {
  percent: number;
  /** Accessible label for screen readers — passed as aria-label on the progressbar element. */
  label?: string;
  /** ID of an external element that labels this progress bar — passed as aria-labelledby. */
  labelledBy?: string;
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
}: ProgressBarProps) {
  const clamped = normalizePercent(percent);

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(label && { "aria-label": label })}
      {...(labelledBy && { "aria-labelledby": labelledBy })}
      className="w-full h-1 bg-slate-800 rounded-full overflow-hidden"
    >
      <div
        className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
