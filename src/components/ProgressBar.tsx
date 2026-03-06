interface ProgressBarProps {
  percent: number;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
