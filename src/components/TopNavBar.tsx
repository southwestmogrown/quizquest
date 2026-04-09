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
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="100" height="100" rx="15" fill="#0f172a"/>
          <path d="M50 10L85 30V70L50 90L15 70V30L50 10Z" stroke="#6366F1" strokeWidth="6" strokeLinejoin="round"/>
          <path d="M70 70L85 85" stroke="#6366F1" strokeWidth="8" strokeLinecap="round"/>
        </svg>
        <span className="text-xl font-bold">
          <span className="text-slate-100">Quiz</span><span className="text-indigo-400">Quest</span>
        </span>
      </Link>
      <ul className="flex gap-6 items-center">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={
                  isActive
                    ? "font-semibold text-indigo-400 border-b-2 border-indigo-500 pb-1"
                    : "text-slate-400 hover:text-slate-50 transition-colors"
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
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors ml-6"
          >
            {resetting ? "Resetting…" : "Reset Demo"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
