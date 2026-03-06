import Link from "next/link";

interface TopNavBarProps {
  xp?: number;
  streak?: number;
}

export function TopNavBar({ xp = 0, streak = 0 }: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">QuizQuest</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/courses"
            className="transition-colors hover:text-indigo-600"
          >
            Courses
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-indigo-600"
          >
            Dashboard
          </Link>
        </nav>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-1 text-amber-500">
            <span aria-label="XP" title="Experience Points">⚡</span>
            <span>{xp} XP</span>
          </span>
          <span className="flex items-center gap-1 text-orange-500">
            <span aria-label="Streak" title="Day streak">🔥</span>
            <span>Streak: {streak}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
