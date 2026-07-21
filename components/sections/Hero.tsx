"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { profile } from "@/lib/data";
import { useSiteStore } from "@/store/useSiteStore";

// 3D canvas is client-only — no SSR (WebGL)
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050810]" />,
});

const NAME_FIRST = "Mohamed";
const NAME_LAST = "Elaraby";

/** One letter of the cinematic name reveal */
function Letter({
  ch,
  i,
  show,
  gradient,
}: {
  ch: string;
  i: number;
  show: boolean;
  gradient?: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40, rotateX: 90, filter: "blur(10px)" }}
      animate={
        show
          ? { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }
          : undefined
      }
      transition={{
        delay: 0.35 + i * 0.045,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`inline-block ${gradient ? "text-gradient" : ""}`}
    >
      {ch}
    </motion.span>
  );
}

/** Movie-style credit lines shown while the camera flies in */
function IntroCredits({ show }: { show: boolean }) {
  const lines = ["A CINEMATIC PORTFOLIO", "AI · FULL-STACK · SECURITY"];
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          {lines.map((l, i) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, letterSpacing: "0.7em", filter: "blur(8px)" }}
              animate={{
                opacity: [0, 1, 1, 0],
                letterSpacing: ["0.7em", "0.4em", "0.4em", "0.3em"],
                filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(10px)"],
              }}
              transition={{
                delay: 0.5 + i * 2.2,
                duration: 2.0,
                times: [0, 0.25, 0.75, 1],
                ease: "easeInOut",
              }}
              className="absolute px-6 text-center font-mono text-xs text-cyan-100/90 uppercase md:text-sm"
            >
              {l}
            </motion.p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const introDone = useSiteStore((s) => s.introDone);
  const loaded = useSiteStore((s) => s.loaded);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Scroll progress over the tall hero section
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  // Laptop scene stays on screen a while — fully gone before content arrives
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 1, 0]);
  // Name blurs + fades as the sections scroll over it
  const nameBlur = useTransform(scrollYProgress, [0, 0.45], [0, 14]);
  const nameFilter = useMotionTemplate`blur(${nameBlur}px)`;
  const uiOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const uiY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const uiScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);

  // Keep page locked while intro plays
  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  const reveal = {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.15 * i,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section ref={wrapRef} id="home" className="relative h-[160vh]">
      {/* fixed cinematic scene */}
      <motion.div
        className="fixed inset-0 h-screen"
        style={{ opacity: sceneOpacity }}
      >
        <HeroScene />
        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,4,10,0.8)_100%)]" />
      </motion.div>

      {/* movie credits during the camera flight */}
      <IntroCredits show={loaded && !introDone} />

      {/* bright flash the moment the intro hands over */}
      {introDone && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-50 bg-cyan-100 mix-blend-screen"
        />
      )}

      {/* cinema letterbox bars — retract when the intro finishes */}
      <motion.div
        initial={{ height: "11vh" }}
        animate={{ height: introDone ? "0vh" : "11vh" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 bg-black"
      />
      <motion.div
        initial={{ height: "11vh" }}
        animate={{ height: introDone ? "0vh" : "11vh" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-black"
      />

      {/* hero copy */}
      <motion.div
        className="pointer-events-none fixed inset-0 flex h-screen flex-col items-center justify-end pb-[12vh] text-center"
        style={{ opacity: uiOpacity, y: uiY, scale: uiScale }}
      >
        <motion.p
          custom={0}
          variants={reveal}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="mb-3 font-mono text-xs tracking-[0.5em] text-cyan-300/90 uppercase"
        >
          {profile.role}
        </motion.p>

        {/* name — letter-by-letter cinematic reveal, blurs on scroll */}
        <motion.h1
          style={{ filter: nameFilter, perspective: 600 }}
          className="relative text-5xl font-bold tracking-tight text-white md:text-7xl"
        >
          {NAME_FIRST.split("").map((ch, i) => (
            <Letter key={`f-${i}`} ch={ch} i={i} show={introDone} />
          ))}
          <span className="inline-block w-[0.35em]" />
          {NAME_LAST.split("").map((ch, i) => (
            <Letter
              key={`l-${i}`}
              ch={ch}
              i={NAME_FIRST.length + i}
              show={introDone}
              gradient
            />
          ))}
          {/* light sweep across the name once the letters land */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.span
              initial={{ x: "-130%" }}
              animate={introDone ? { x: "230%" } : undefined}
              transition={{ delay: 1.9, duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent"
            />
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={reveal}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="mt-4 max-w-xl px-6 text-sm text-zinc-400 md:text-base"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          custom={3}
          variants={reveal}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="mt-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase">
              scroll
            </span>
            <ChevronDown className="h-5 w-5 text-cyan-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
