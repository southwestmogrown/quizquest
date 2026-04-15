"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export default function TopNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await fetch("/api/demo-reset", { method: "POST" });
      router.push("/");
    } finally {
      setResetting(false);
    }
  }

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 sm:px-6 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/60">
      <Link href="/" className="flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="100" height="100" rx="15" fill="#1c1917"/>
          <path d="M50 10L85 30V70L50 90L15 70V30L50 10Z" stroke="#2dd4bf" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M70 70L85 85" stroke="#2dd4bf" strokeWidth="8" strokeLinecap="round"/>
        </svg>
        <span className="text-xl font-bold">
          <span className="text-stone-100">Quiz</span><span className="text-teal-400">Quest</span>
        </span>
      </Link>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 text-stone-400 hover:text-stone-100 transition-colors"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          {menuOpen ? (
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          )}
        </svg>
      </button>

      {/* Desktop nav */}
      <ul className="hidden sm:flex gap-4 items-center sm:gap-6">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={
                  isActive
                    ? "font-semibold text-teal-400 border-b-2 border-teal-400 pb-1 text-sm sm:text-base"
                    : "text-stone-400 hover:text-stone-50 transition-colors text-sm sm:text-base"
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            onClick={handleReset}
            disabled={resetting}
            className="text-xs text-stone-600 hover:text-stone-400 transition-colors ml-2 sm:ml-6"
          >
            {resetting ? "Resetting…" : "Reset Demo"}
          </button>
        </li>
      </ul>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/60 sm:hidden">
          <ul className="flex flex-col px-4 py-3 gap-3">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={
                      isActive
                        ? "block font-semibold text-teal-400 text-base py-1"
                        : "block text-stone-300 hover:text-stone-50 transition-colors text-base py-1"
                    }
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="text-sm text-stone-500 hover:text-stone-300 transition-colors py-1"
              >
                {resetting ? "Resetting…" : "Reset Demo"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
