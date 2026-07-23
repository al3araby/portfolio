"use client";

import { motion } from "framer-motion";
import { Bot, Code2, ShieldCheck, Database } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import Stats from "@/components/sections/Stats";
import Aurora from "@/components/ui/Aurora";
import Marquee from "@/components/ui/Marquee";
import { expertise, skillGroups, profile } from "@/lib/data";

const ICONS = { Bot, Code2, ShieldCheck, Database } as const;

// flat, de-duplicated list of every skill for the marquee strip
const allSkills = Array.from(new Set(skillGroups.flatMap((g) => g.skills)));

export default function About() {
  return (
    <section id="about" className="relative isolate mx-auto max-w-6xl px-6 py-28">
      <Aurora />
      <SectionTitle
        kicker="who am i"
        title="About & Expertise"
        sub={profile.about}
      />

      <Stats />

      {/* expertise cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {expertise.map((e, i) => {
          const Icon = ICONS[e.icon as keyof typeof ICONS];
          return (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glow-card rounded-2xl p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{e.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{e.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* skill groups — cards so they stay readable over the 3D scene */}
      <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, gi) => (
          <motion.div
            key={g.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (gi % 3) * 0.08 }}
            className="glow-card rounded-2xl p-5"
          >
            <h4 className="mb-3 font-mono text-xs tracking-[0.3em] text-teal-300/80 uppercase">
              {g.label}
            </h4>
            <div className="flex flex-wrap gap-2">
              {g.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* infinite marquee of the full tech stack */}
      <div className="mt-16">
        <Marquee items={allSkills} />
      </div>
    </section>
  );
}
