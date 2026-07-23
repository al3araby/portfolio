"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { projects, certificates, skillGroups, timeline } from "@/lib/data";

const techCount = skillGroups.reduce((n, g) => n + g.skills.length, 0);

const stats = [
  { label: "Projects", value: projects.length, suffix: "+" },
  { label: "Certificates", value: certificates.length, suffix: "" },
  { label: "Technologies", value: techCount, suffix: "+" },
  { label: "Milestones", value: timeline.length, suffix: "" },
];

export default function Stats() {
  return (
    <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          className="glow-card rounded-2xl px-4 py-6 text-center"
        >
          <div className="text-4xl font-bold text-gradient md:text-5xl">
            <CountUp to={s.value} suffix={s.suffix} />
          </div>
          <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
