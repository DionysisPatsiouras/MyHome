const buildings = [
  { h: 120, w: 46, rows: 4 },
  { h: 170, w: 58, rows: 6 },
  { h: 100, w: 40, rows: 3 },
  { h: 200, w: 64, rows: 7 },
  { h: 140, w: 48, rows: 5 },
  { h: 90, w: 38, rows: 3 },
]

export function SkylineIllustration() {
  return (
    <div className="relative flex h-64 w-full items-end justify-center gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-blue-50 to-cyan-50 px-6 pb-0 dark:border-zinc-800 dark:from-blue-950/40 dark:to-cyan-950/20 sm:h-80">
      <div
        className="pointer-events-none absolute -top-10 right-10 h-28 w-28 rounded-full opacity-40 blur-2xl"
        style={{ background: 'radial-gradient(circle, #4dabf7, transparent 70%)' }}
      />

      {buildings.map((b, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-end gap-[6px] rounded-t-md bg-blue-500/90 p-2 shadow-lg shadow-blue-900/10 dark:bg-blue-500/70"
          style={{ height: b.h, width: b.w }}
        >
          {Array.from({ length: b.rows }).map((_, r) => (
            <div key={r} className="flex gap-[5px]">
              {Array.from({ length: 3 }).map((_, c) => (
                <span
                  key={c}
                  className="h-[6px] w-[6px] rounded-[1px] bg-yellow-200/90"
                  style={{ opacity: (r + c) % 3 === 0 ? 0.35 : 0.9 }}
                />
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="absolute bottom-0 h-3 w-full bg-zinc-900/10 dark:bg-black/30" />
    </div>
  )
}
