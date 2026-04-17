import { loadAllCourses, loadTracks } from "@/lib/content/loader";
import type { Course, Track } from "@/lib/content/types";
import CourseCard from "@/components/CourseCard";

const DIFFICULTY_ORDER = { beginner: 0, intermediate: 1, advanced: 2 } as const;

export default function CoursesPage() {
  let courses: Course[] = [];
  let tracks: Track[] = [];
  let loadError = false;

  try {
    const allCourses = loadAllCourses();
    tracks = loadTracks();
    courses = allCourses.filter((c) => c.courseSlug !== "test-course");
  } catch (err) {
    console.error("[CoursesPage] Failed to load courses:", err);
    loadError = true;
  }

  // Group courses by track
  const trackMap = new Map<string, Course[]>();
  const orphanCourses: Course[] = [];
  const untracked: Course[] = [];

  const validTrackSlugs = new Set(tracks.map((t) => t.trackSlug));

  for (const course of courses) {
    if (course.track) {
      if (validTrackSlugs.has(course.track)) {
        if (!trackMap.has(course.track)) {
          trackMap.set(course.track, []);
        }
        trackMap.get(course.track)!.push(course);
      } else {
        // course.track is set but not in tracks.yaml — orphan
        orphanCourses.push(course);
      }
    } else {
      untracked.push(course);
    }
  }

  // Sort courses within each track by difficulty
  for (const trackCourses of trackMap.values()) {
    trackCourses.sort(
      (a, b) =>
        (DIFFICULTY_ORDER[a.difficulty] ?? 99) -
        (DIFFICULTY_ORDER[b.difficulty] ?? 99)
    );
  }

  // Build ordered track list: valid tracks with courses, then "Other" for orphans + untracked
  const orderedTracks = tracks.filter((t) => trackMap.has(t.trackSlug));

  const otherCourses = [...orphanCourses, ...untracked];
  if (otherCourses.length > 0) {
    otherCourses.sort(
      (a, b) =>
        (DIFFICULTY_ORDER[a.difficulty] ?? 99) -
        (DIFFICULTY_ORDER[b.difficulty] ?? 99)
    );
    orderedTracks.push({
      trackSlug: "other",
      title: "Other",
      description: "",
      order: 99,
    });
    trackMap.set("other", otherCourses);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1
        className="mb-2 text-3xl font-bold tracking-tight text-stone-50"
        style={{ letterSpacing: "-0.02em" }}
      >
        Course Catalog
      </h1>
      <p className="mb-8 text-stone-400">
        Choose a course to start learning.
      </p>

      {loadError ? (
        <p className="text-center text-stone-500">
          Failed to load courses. Please try again later.
        </p>
      ) : courses.length === 0 ? (
        <p className="text-center text-stone-500">
          No courses available yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-12">
          {orderedTracks.map((track) => {
            const trackCourses = trackMap.get(track.trackSlug) ?? [];
            if (trackCourses.length === 0) return null;
            return (
              <section key={track.trackSlug}>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-stone-100">
                    {track.title}
                  </h2>
                  {track.description && (
                    <p className="mt-1 text-sm text-stone-400">
                      {track.description}
                    </p>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {trackCourses.map((course) => (
                    <CourseCard
                      key={course.courseSlug}
                      course={course}
                      href={`/courses/${course.courseSlug}`}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
