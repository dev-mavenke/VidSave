/** Placeholder that mirrors VideoPreviewCard's shape while metadata loads. */
export default function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Loading video details"
      className="glass mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl"
    >
      <div className="skeleton aspect-video w-full" />

      <div className="space-y-4 p-5">
        <div className="skeleton h-4 w-2/3 rounded-md" />

        <div className="grid gap-2">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-2xl border border-line p-3"
            >
              <div className="skeleton h-10 w-10 shrink-0 rounded-xl" />

              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-2.5 w-28 rounded" />
              </div>

              <div className="skeleton h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
