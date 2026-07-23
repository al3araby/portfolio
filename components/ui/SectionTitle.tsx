"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%&$<>/*0123456789";

/** Reveals `text` with a decode/scramble flourish once `active` turns true. */
function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const total = text.length;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 850);
      const revealed = Math.floor(p * total);
      let s = "";
      for (let i = 0; i < total; i++) {
        if (text[i] === " ") {
          s += " ";
        } else if (i < revealed) {
          s += text[i];
        } else {
          s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text]);
  return out;
}

export default function SectionTitle({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const scrambled = useScramble(title, inView);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <motion.div ref={ref} style={{ y }} className="mb-14 text-center">
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
        {scrambled}
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
    </motion.div>
  );
}
