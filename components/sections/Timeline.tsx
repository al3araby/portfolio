"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Award, Rocket } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { timeline } from "@/lib/data";

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  // Line draws itself as you scroll through the section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
  });

  return (
    <section id="timeline" className="relative mx-auto max-w-5xl px-6 py-28">
      <SectionTitle
        kicker="the journey"
        title="Timeline"
        sub="Certificates and milestones, newest first."
      />

      <div ref={ref} className="relative">
        {/* static faint line + animated glowing line */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-white/10 md:left-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute top-0 bottom-0 left-4 w-px origin-top bg-linear-to-b from-cyan-400 via-teal-300 to-amber-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] md:left-1/2"
        />

        <ul className="space-y-10">
          {timeline.map((e, i) => {
            const left = i % 2 === 0;
            const Icon = e.kind === "project" ? Rocket : Award;
            return (
              <li key={e.id} className="relative md:grid md:grid-cols-2 md:gap-12">
                {/* node */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className={`absolute top-6 left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border md:left-1/2 ${
                    e.kind === "project"
                      ? "border-amber-300/60 bg-[#1a1408] text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
                      : "border-cyan-300/60 bg-[#07131c] text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </motion.span>

                {/* card — alternating sides on md+ */}
                <motion.div
                  initial={{ opacity: 0, x: left ? -48 : 48, y: 16 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`glow-card ml-12 rounded-2xl p-5 md:ml-0 ${
                    left ? "md:col-start-1 md:text-right" : "md:col-start-2"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tracking-widest uppercase ${
                      e.kind === "project" ? "text-amber-300/90" : "text-cyan-300/90"
                    }`}
                  >
                    {e.date} · {e.kind}
                  </span>
                  <h3 className="mt-1 font-semibold text-white">{e.title}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{e.org}</p>
                  {e.desc && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {e.desc}
                    </p>
                  )}
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
