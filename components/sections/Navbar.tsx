"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useSiteStore } from "@/store/useSiteStore";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#certificates", label: "Certificates" },
  { href: "#timeline", label: "Timeline" },
];

export default function Navbar() {
  const introDone = useSiteStore((s) => s.introDone);
  const [active, setActive] = useState("#home");

  // highlight the section in view
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [introDone]);

  return (
    <AnimatePresence>
      {introDone && (
        <motion.header
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-150 flex justify-center px-4 pt-4"
        >
          <nav className="flex w-full max-w-3xl items-center justify-between rounded-2xl border border-white/10 bg-[#0a0f1c]/70 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <a
              href="#home"
              className="flex items-center gap-2 font-mono text-sm font-semibold text-white"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              M<span className="text-cyan-400">.</span>Elaraby
            </a>
            <ul className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`relative rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                      active === l.href
                        ? "text-cyan-300"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {active === l.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-cyan-400/10 ring-1 ring-cyan-400/30"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
              className="rounded-full bg-linear-to-r from-cyan-500 to-teal-400 px-4 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-105"
            >
              Contact
            </a>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
