"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { heroCode } from "@/lib/data";

const W = 1024;
const H = 640;
const FONT = "22px 'Cascadia Code', 'Consolas', monospace";
const LINE_H = 30;
const PAD = 34;

// Very small python-ish syntax highlighter
const COLORS: [RegExp, string][] = [
  [/^(#.*)$/, "#6b7f95"], // comments
  [
    /\b(from|import|async|def|return|if|class|await|True|False|None|__name__|__main__)\b/,
    "#c792ea",
  ],
  [/\b(FastAPI|Orchestrator|RAGAgent|VisionAgent)\b/, "#82aaff"],
  [/(".*?"|'.*?')/, "#c3e88d"],
  [/(@\w+(\.\w+)*)/, "#ffcb6b"],
];

function drawToken(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
): number {
  // Tokenize crudely: split into words + separators, color each
  const parts = text.split(/(\s+|[()[\]{}:,=.])/g).filter(Boolean);
  let cx = x;
  for (const part of parts) {
    let color = "#e2e8f0";
    for (const [re, c] of COLORS) {
      if (re.test(part)) {
        color = c;
        break;
      }
    }
    // full-line comment overrides everything after '#'
    ctx.fillStyle = color;
    ctx.fillText(part, cx, y);
    cx += ctx.measureText(part).width;
  }
  return cx;
}

/**
 * The laptop's screen: a CanvasTexture where hero code types itself
 * character-by-character with a blinking cursor.
 */
export default function CodeScreen({
  started,
  ...props
}: { started: boolean } & ThreeElements["mesh"]) {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.anisotropy = 4;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [canvas]);

  const state = useRef({ chars: 0, last: 0, cursorT: 0 });

  useFrame((_, delta) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = state.current;
    s.cursorT += delta;
    if (started) {
      s.last += delta;
      // typing speed: ~28 chars/sec with tiny jitter
      const step = 0.035;
      while (s.last > step && s.chars < heroCode.length) {
        s.chars++;
        s.last -= step;
      }
    }

    // background: dark editor with subtle vignette
    ctx.fillStyle = "#0a0f1c";
    ctx.fillRect(0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(34,211,238,0.06)");
    grad.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // window chrome
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, W, 44);
    for (const [i, color] of ["#ef4444", "#f59e0b", "#22c55e"].entries()) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(28 + i * 30, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "16px 'Consolas', monospace";
    ctx.fillText("nilepi/main.py — NilePi", 120, 28);

    // typed code
    ctx.font = FONT;
    const visible = heroCode.slice(0, s.chars);
    const lines = visible.split("\n");
    const maxLines = Math.floor((H - 70 - PAD) / LINE_H);
    const offset = Math.max(0, lines.length - maxLines);
    let y = 70 + LINE_H;
    let lastX = PAD;
    for (let i = offset; i < lines.length; i++) {
      // line numbers
      ctx.fillStyle = "#334155";
      ctx.fillText(String(i + 1).padStart(2, " "), PAD - 4, y);
      lastX = drawToken(ctx, lines[i], PAD + 44, y);
      y += LINE_H;
    }

    // blinking cursor
    if (Math.sin(s.cursorT * 6) > -0.2) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(lastX + 3, y - LINE_H - 17, 11, 24);
    }

    texture.needsUpdate = true;
  });

  return (
    <mesh {...props}>
      <planeGeometry args={[3.1, 1.94]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
