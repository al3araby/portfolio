"use client";

import { motion } from "framer-motion";

export default function SectionTitle({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-14 text-center">
      <motion.p
        initial={{ opacity: 0, y: 14, letterSpacing: "0.9em" }}
        whileInView={{ opacity: 1, y: 0, letterSpacing: "0.45em" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-3 font-mono text-xs text-cyan-300/80 uppercase"
      >
        {kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-bold tracking-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>
      {/* glowing divider draws itself in */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-5 h-px w-24 origin-center bg-linear-to-r from-transparent via-cyan-400/80 to-transparent"
      />
      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
