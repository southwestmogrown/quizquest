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
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm font-medium text-foreground/60">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
          Open-source portfolio project
        </div>

        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          Learn by doing,{" "}
          <span className="text-blue-600">not just reading</span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-foreground/65">
          QuizQuest turns Markdown files into interactive web lessons — complete
          with in-browser code challenges, quizzes, XP, and streaks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/courses"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Browse Courses →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-foreground/20 bg-transparent px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            View Dashboard →
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-5xl border-t border-foreground/10" />

      {/* Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-foreground">
            Everything you need to level up
          </h2>
          <p className="mb-14 text-center text-base text-foreground/60">
            Designed to keep you engaged — every lesson has a clear goal and a
            reward.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-6 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.06]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1.5 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer strip */}
      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-2xl bg-blue-600 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to start learning?
          </h2>
          <p className="max-w-md text-base text-blue-100">
            Pick a course, earn your first XP, and build a streak — all in
            under five minutes.
          </p>
          <Link
            href="/courses"
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            Browse Courses →
          </Link>
        </div>
      </section>
    </main>
  );
}
