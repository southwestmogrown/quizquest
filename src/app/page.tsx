export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        QuizQuest
      </h1>
      <p className="max-w-md text-center text-lg text-foreground/70">
        A gamified Learning Management System that turns markdown into
        interactive web lessons.
      </p>
      <span className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background">
        Coming soon
      </span>
    </main>
  );
}
