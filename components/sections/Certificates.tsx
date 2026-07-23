"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Award, Calendar, BadgeCheck } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { certificates, type Certificate } from "@/lib/data";

/** A certificate hanging in a lit wooden/metal frame. */
function FramedCert({
  cert,
  index,
  onOpen,
}: {
  cert: Certificate;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 40, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 0.8 : -0.8 }}
      whileHover={{ rotate: 0, scale: 1.03, y: -6 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.09 }}
      className="group relative cursor-pointer text-left focus:outline-none"
    >
      {/* hanging string */}
      <div className="absolute -top-5 left-1/2 h-5 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-zinc-500/60" />

      {/* frame */}
      <motion.div
        layoutId={`cert-${cert.id}`}
        className="relative rounded-md bg-linear-to-br from-[#3f2f1e] via-[#5a4328] to-[#2e2216] p-2.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.85)] ring-1 ring-black/60 transition-shadow group-hover:shadow-[0_24px_55px_-10px_rgba(34,211,238,0.25)]"
      >
        <div className="rounded-sm bg-[#0c0f18] p-1.5 ring-1 ring-black/50">
          {cert.image ? (
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-white">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 320px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-2 rounded-xs bg-linear-to-br from-zinc-900 to-zinc-800 text-zinc-400">
              <Award className="h-10 w-10 text-amber-400/70" />
              <span className="px-4 text-center font-mono text-[10px]">
                {cert.issuer}
              </span>
            </div>
          )}
        </div>
        {/* glass reflection */}
        <div className="pointer-events-none absolute inset-2.5 bg-linear-to-tr from-transparent via-white/6 to-white/12" />
        {/* spotlight from above */}
        <div className="pointer-events-none absolute -top-2 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-cyan-100/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </motion.div>

      {/* label plate */}
      <div className="mx-auto mt-3 w-fit max-w-full rounded border border-white/10 bg-white/4 px-3 py-1.5 text-center backdrop-blur">
        <p className="truncate text-xs font-medium text-zinc-200">
          {cert.title}
        </p>
        <p className="font-mono text-[10px] text-zinc-500">
          {cert.issuer} · {cert.date}
        </p>
      </div>
    </motion.button>
  );
}

export default function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);

  // Esc closes + lock scroll while open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section
      id="certificates"
      className="relative border-y border-white/5 bg-linear-to-b from-transparent via-[#080d1a] to-transparent py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          kicker="the wall"
          title="Certificates"
          sub="Click any frame to take a closer look."
        />

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {certificates.map((c, i) => (
            <FramedCert
              key={c.id}
              cert={c}
              index={i}
              onOpen={() => setActive(c)}
            />
          ))}
        </div>
      </div>

      {/* ── zoom modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            {/* blurred backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              layoutId={`cert-${active.id}`}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl rounded-lg bg-linear-to-br from-[#3f2f1e] via-[#5a4328] to-[#2e2216] p-3 shadow-[0_40px_120px_-20px_rgba(34,211,238,0.3)] ring-1 ring-black/60"
            >
              <div className="rounded-sm bg-[#0c0f18] p-2 ring-1 ring-black/50">
                {active.image ? (
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-white md:aspect-16/10">
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      sizes="(max-width: 1024px) 95vw, 900px"
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-zinc-400">
                    <Award className="h-16 w-16 text-amber-400/70" />
                    <span className="font-mono text-sm">{active.issuer}</span>
                  </div>
                )}
              </div>

              {/* details bar */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 pb-1"
              >
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <BadgeCheck className="h-4 w-4 text-cyan-300" />
                    {active.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-amber-200/80">
                    <Award className="h-3.5 w-3.5" /> {active.issuer}
                    <span className="text-zinc-500">·</span>
                    <Calendar className="h-3.5 w-3.5" /> {active.date}
                  </p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
