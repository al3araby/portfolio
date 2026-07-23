/** Seamless infinite horizontal marquee (pauses on hover). */
export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={`marquee ${className ?? ""}`}>
      {[0, 1].map((k) => (
        <div key={k} className="marquee-track" aria-hidden={k === 1}>
          {items.map((t, i) => (
            <span
              key={`${k}-${i}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 font-mono text-xs whitespace-nowrap text-zinc-300"
            >
              <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
