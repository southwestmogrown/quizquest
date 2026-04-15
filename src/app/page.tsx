import Link from "next/link";

const features = [
  {
    title: "Interactive Code Challenges",
    description:
      "Write and run real code directly in the browser. Get instant feedback on your solutions without leaving the lesson.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Quiz-Based Learning",
    description:
      "Reinforce concepts with multiple-choice quizzes after every reading. Learning by doing, not just reading.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    title: "XP & Streak System",
    description:
      "Earn experience points for every completed lesson and quiz. Build daily streaks and watch your rank climb.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Track Your Progress",
    description:
      "A personal dashboard shows your XP, current streak, rank, and exactly where you left off in every course.",
    icon: (
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero — split layout on wide screens */}
      <section className="px-6 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Left — headline + CTA */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
              Open-source portfolio project
            </div>

            <h1 className="text-4xl font-black tracking-tight text-stone-50 sm:text-5xl lg:text-6xl" style={{ letterSpacing: "-0.03em" }}>
              Learn by doing,{" "}
              <span className="text-teal-400">
                not just reading
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-stone-300">
              QuizQuest turns Markdown files into interactive web lessons — complete
              with in-browser code challenges, quizzes, XP, and streaks.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-stone-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-400"
              >
                Browse Courses →
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-stone-700 px-6 py-3 text-base font-semibold text-stone-300 transition hover:border-stone-500 hover:text-stone-50"
              >
                View Dashboard →
              </Link>
            </div>
          </div>

          {/* Right — code preview card */}
          <div className="flex-1 mt-12 lg:mt-0" aria-hidden="true">
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-1 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-800">
                <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs font-mono text-stone-500">main.go</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed overflow-hidden">
                <code>
                  <span className="text-teal-400">package</span>{" "}
                  <span className="text-stone-200">main</span>{"\n\n"}
                  <span className="text-teal-400">import</span>{" "}
                  <span className="text-amber-300">&quot;fmt&quot;</span>{"\n\n"}
                  <span className="text-teal-400">func</span>{" "}
                  <span className="text-stone-200">main</span>
                  <span className="text-stone-500">() {"{"}</span>{"\n"}
                  {"  "}<span className="text-stone-200">fmt.Println</span>
                  <span className="text-stone-500">(</span>
                  <span className="text-amber-300">&quot;Hello, QuizQuest!&quot;</span>
                  <span className="text-stone-500">)</span>{"\n"}
                  <span className="text-stone-500">{"}"}</span>
                </code>
              </pre>
              <div className="border-t border-stone-800 px-4 py-2.5 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-emerald-400">All tests passed</span>
                <span className="ml-auto text-xs font-mono text-amber-400">+25 XP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-7xl border-t border-stone-800/60" />

      {/* Features — 4-column on xl */}
      <section className="px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-stone-50" style={{ letterSpacing: "-0.02em" }}>
            Everything you need to level up
          </h2>
          <p className="mb-14 text-center text-base text-stone-400">
            Designed to keep you engaged — every lesson has a clear goal and a
            reward.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 rounded-xl border border-stone-800 bg-stone-900/80 p-6 transition-all duration-200 hover:border-teal-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-950/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-stone-50">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer strip — full-bleed warm gradient */}
      <section className="px-6 pb-14 sm:pb-24">
        <div className="mx-auto max-w-7xl rounded-2xl border border-teal-500/20 bg-gradient-to-br from-stone-900 to-stone-950 px-6 py-10 sm:px-12 sm:py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold text-stone-50" style={{ letterSpacing: "-0.02em" }}>
              Ready to start learning?
            </h2>
            <p className="max-w-md text-base text-stone-400">
              Pick a course, earn your first XP, and build a streak — all in
              under five minutes.
            </p>
            <Link
              href="/courses"
              className="rounded-lg bg-teal-500 px-6 py-3 text-base font-semibold text-stone-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-400"
            >
              Browse Courses →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
