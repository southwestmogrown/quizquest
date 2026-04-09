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
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#0f172a"/>
          <polygon points="16,3 27,9.5 16,16 5,9.5" fill="#1e1b4b"/>
          <polygon points="27,9.5 27,22.5 16,29 16,16" fill="#181640"/>
          <polygon points="5,9.5 16,16 16,29 5,22.5" fill="#141232"/>
          <line x1="16" y1="3" x2="27" y2="9.5" stroke="#6366f1" strokeWidth="1.2"/>
          <line x1="16" y1="3" x2="5" y2="9.5" stroke="#6366f1" strokeWidth="1.2"/>
          <line x1="27" y1="9.5" x2="27" y2="22.5" stroke="#4f46e5" strokeWidth="1"/>
          <line x1="5" y1="9.5" x2="5" y2="22.5" stroke="#4f46e5" strokeWidth="1"/>
          <line x1="27" y1="22.5" x2="16" y2="29" stroke="#4f46e5" strokeWidth="1"/>
          <line x1="5" y1="22.5" x2="16" y2="29" stroke="#4f46e5" strokeWidth="1"/>
          <path d="M 22 17 A 8 8 0 1 0 18.4 20.2" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <line x1="17" y1="15.5" x2="24" y2="22.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
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
