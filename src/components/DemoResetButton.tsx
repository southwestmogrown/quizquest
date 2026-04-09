"use client";

import { useState } from "react";

export default function DemoResetButton() {
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      const res = await fetch("/api/demo-reset", { method: "POST" });
      if (!res.ok) throw new Error("Reset failed");
      setDone(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err) {
      console.error("[DemoResetButton] Reset failed:", err);
      setResetting(false);
    }
  }

  return (
    <div className="mt-16 border-t border-white/5 pt-8 text-center">
      <p className="text-xs text-slate-600">
        Demo app — progress is shared.{" "}
        <button
          onClick={handleReset}
          disabled={resetting || done}
          className="text-slate-500 underline underline-offset-2 hover:text-slate-400 transition-colors disabled:cursor-not-allowed"
        >
          {done ? "Done!" : resetting ? "Resetting…" : "Reset progress"}
        </button>
        {" "}to start fresh.
      </p>
    </div>
  );
}
