"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Award, Calendar, BadgeCheck } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { certificates, type Certificate } from "@/lib/data";

// 3D coverflow is client-only (WebGL) — never SSR it
const CertCarousel = dynamic(() => import("@/components/three/CertCarousel"), {
  ssr: false,
  loading: () => <div className="h-115 w-full md:h-130" />,
});

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

        <CertCarousel certificates={certificates} onOpen={setActive} />
        <p className="mt-2 text-center font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
          Drag to spin · Click any certificate to zoom
        </p>
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
