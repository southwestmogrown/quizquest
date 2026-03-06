interface ProgressBarProps {
  /** Completed lessons */
  completed: number;
  /** Total lessons */
  total: number;
  /** Show the fraction label, e.g. "15/22" */
  showLabel?: boolean;
  /** Additional CSS classes for the outer container */
  className?: string;
}

export function ProgressBar({
  completed,
  total,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% complete`}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-gray-500">
          {completed}/{total} lessons
        </p>
      )}
    </div>
  );
}
