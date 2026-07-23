"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUp, Terminal } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import { profile } from "@/lib/data";

// lucide-react dropped brand icons — inline SVGs instead
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

const socials = [
  { icon: GithubIcon, href: profile.github, label: "GitHub" },
  { icon: LinkedinIcon, href: profile.linkedin, label: "LinkedIn" },
  { icon: FacebookIcon, href: profile.facebook, label: "Facebook" },
  { icon: WhatsappIcon, href: profile.whatsapp, label: "WhatsApp" },
  { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5">
      {/* glow backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-1/2 h-96 w-208 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-52 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-10">
        {/* big CTA */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-mono text-xs tracking-[0.45em] text-cyan-300/80 uppercase"
          >
            get in touch
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            Let&apos;s build something{" "}
            <span className="text-gradient">intelligent</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <Magnetic key={label} strength={0.5} className="inline-block">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group block rounded-2xl border border-white/10 bg-white/4 p-4 text-zinc-300 backdrop-blur transition-all hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-[0_10px_35px_-10px_rgba(34,211,238,0.5)]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </Magnetic>
            ))}
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-white/5 pt-8 md:flex-row">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Terminal className="h-4 w-4 text-cyan-400/70" />
            <span className="text-zinc-300">{profile.name}</span>
            <span>· AI &amp; Full-Stack Engineer</span>
          </div>

          <p className="font-mono text-[11px] text-zinc-600">
            © {new Date().getFullYear()} · {profile.name}
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 font-mono text-xs text-zinc-400 transition-all hover:border-cyan-400/50 hover:text-cyan-300"
            aria-label="Back to top"
          >
            back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
