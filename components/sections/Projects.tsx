"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Aurora from "@/components/ui/Aurora";
import {
  Waves,
  BrainCircuit,
  Route,
  Cpu,
  Network,
  Sparkles,
  Bus,
  Radar,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { projects, type Project } from "@/lib/data";

const ICONS = {
  Waves,
  BrainCircuit,
  Route,
  Cpu,
  Network,
  Bus,
  Radar,
} as const;

function TiltCard({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 180,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), {
    stiffness: 180,
    damping: 20,
  });

  // cursor-following spotlight
  const mxPct = useTransform(mx, [0, 1], ["0%", "100%"]);
  const myPct = useTransform(my, [0, 1], ["0%", "100%"]);
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mxPct} ${myPct}, rgba(34,211,238,0.14), transparent 60%)`;

  const Icon = ICONS[p.icon as keyof typeof ICONS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.12 }}
      className={p.featured ? "md:col-span-2" : ""}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className={`glow-card group relative h-full overflow-hidden rounded-3xl p-7 md:p-9 ${
          p.featured
            ? "bg-linear-to-br from-cyan-950/40 via-transparent to-amber-950/20"
            : ""
        }`}
      >
        {/* floating icon */}
        <div
          style={{ transform: "translateZ(40px)" }}
          className="mb-5 flex items-center gap-3"
        >
          <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 transition-colors group-hover:bg-cyan-400/20">
            <Icon className="h-7 w-7" />
          </div>
          {p.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-mono text-[10px] tracking-widest text-amber-300 uppercase">
              <Sparkles className="h-3 w-3" /> flagship
            </span>
          )}
        </div>

        <div style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            {p.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-teal-300/90">
            {p.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {p.desc}
          </p>
        </div>

        {p.highlights && (
          <div
            style={{ transform: "translateZ(25px)" }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {p.highlights.map((h) => (
              <span
                key={h}
                className="rounded-lg border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5 font-mono text-[11px] text-cyan-200"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        <div
          style={{ transform: "translateZ(20px)" }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>

        {/* cursor spotlight */}
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* sheen */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-x-20 -top-40 h-56 rotate-12 bg-linear-to-b from-white/10 to-transparent blur-2xl" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative isolate mx-auto max-w-6xl px-6 py-28">
      <Aurora />
      <SectionTitle
        kicker="what i built"
        title="Featured Projects"
        sub="From fully-local multi-agent AI platforms to CPUs built gate by gate."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <TiltCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
