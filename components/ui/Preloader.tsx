"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteStore } from "@/store/useSiteStore";

type BootLine = { text: string; status?: "ok" | "run" };

const BOOT_LINES: BootLine[] = [
  { text: "ELARABY(R) BIOS v5.0 — cinematic boot" },
  { text: "detecting GPU ............ WebGL2", status: "ok" },
  { text: "compiling shaders ........ 42/42", status: "ok" },
  { text: "loading 3D assets ........ laptop.mesh", status: "ok" },
  { text: "spawning particles ....... 1600 stars", status: "ok" },
  { text: "mounting NilePi agents ... orchestrator", status: "ok" },
  { text: "starting camera rig ...... crane shot", status: "run" },
];

/**
 * Terminal boot preloader: types real boot lines with a caret, then the
 * whole "screen" collapses like an old CRT turning off — and the 3D
 * camera intro takes over. Holds before collapse until sceneReady.
 */
export default function Preloader() {
  const { loaded, setLoaded } = useSiteStore();
  const [lines, setLines] = useState(0); // fully typed lines
  const [chars, setChars] = useState(0); // chars of current line
  const [closing, setClosing] = useState(false);
  const linesRef = useRef(0);
  const charsRef = useRef(0);
  const done = useRef(false);

  // Type lines character by character
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const l = linesRef.current;
      if (l < BOOT_LINES.length) {
        const line = BOOT_LINES[l].text;
        if (charsRef.current < line.length) {
          charsRef.current += 2; // 2 chars/tick — snappy
        } else {
          linesRef.current = l + 1;
          charsRef.current = 0;
        }
        setLines(linesRef.current);
        setChars(charsRef.current);
        return;
      }

      // all lines typed → wait for the scene (12s safety valve) → collapse
      if (
        !done.current &&
        (useSiteStore.getState().sceneReady || Date.now() - start > 12_000)
      ) {
        done.current = true;
        clearInterval(id);
        setTimeout(() => setClosing(true), 400);
        setTimeout(() => setLoaded(true), 1150);
      }
    }, 24);
    return () => clearInterval(id);
  }, [setLoaded]);

  const current =
    lines < BOOT_LINES.length ? BOOT_LINES[lines].text.slice(0, chars) : "";

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          className="fixed inset-0 z-999 flex items-center justify-center bg-[#02040a]"
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 2px, #67e8f9 2px 3px)",
            }}
          />

          {/* CRT collapse: squash to a bright horizontal line, then a dot */}
          <motion.div
            animate={
              closing
                ? { scaleY: 0.004, scaleX: [1, 1, 0.001], opacity: [1, 1, 0] }
                : {}
            }
            transition={{
              scaleY: { duration: 0.28, ease: [0.76, 0, 0.24, 1] },
              scaleX: { duration: 0.65, times: [0, 0.45, 1], ease: "easeIn" },
              opacity: { duration: 0.65, times: [0, 0.8, 1] },
            }}
            className="w-[min(92vw,620px)] origin-center"
          >
            <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-[#040810]/90 shadow-[0_0_80px_-20px_rgba(34,211,238,0.45)]">
              {/* terminal chrome */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/3 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-[11px] text-zinc-500">
                  boot — elaraby.dev
                </span>
              </div>

              <div className="min-h-60 p-5 font-mono text-[12px] leading-6 md:text-[13px]">
                {BOOT_LINES.slice(0, lines).map((l, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-zinc-300">{l.text}</span>
                    {l.status === "ok" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-emerald-400"
                      >
                        [ OK ]
                      </motion.span>
                    )}
                    {l.status === "run" && (
                      <span className="text-cyan-300">[ .. ]</span>
                    )}
                  </div>
                ))}
                {lines < BOOT_LINES.length && (
                  <div className="text-zinc-300">
                    {current}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                      className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-cyan-400"
                    />
                  </div>
                )}
                {lines >= BOOT_LINES.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-cyan-300"
                  >
                    &gt; launching experience
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-cyan-400"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
