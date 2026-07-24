"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Robot from "./Robot";
import { useSiteStore } from "@/store/useSiteStore";

/**
 * Persistent 3D companion that overlays the whole page. It watches which
 * section is on screen and glides the robot to that section's anchor, and
 * turns to *look at* the pointer. On desktop it parks in the empty side
 * margins beside the copy. On phones there are no margins, so it lives in the
 * centre and only appears on the two sections that have room for it — the
 * hero (with the laptop) and the footer — retreating out of sight everywhere
 * else so it never sits over the body copy. Pointer-transparent; skipped for
 * reduced-motion. Mounts only once the cinematic intro has handed over.
 */

// anchor = fraction of the viewport (width, height); scale in local units;
// yaw = resting rotation (rad) so it turns to *look at* the content beside it.
// |ax| ~0.37 parks the robot in the margin beside the max-w-6xl content.
type Station = { ax: number; ay: number; scale: number; yaw: number };
const STATIONS: Record<string, Station> = {
  home: { ax: 0.31, ay: 0.03, scale: 0.78, yaw: 0 },
  // pushed to the extreme edge; right margin → turn left toward the copy,
  // left margin → turn right
  about: { ax: 0.45, ay: -0.02, scale: 0.42, yaw: -0.4 },
  projects: { ax: -0.45, ay: -0.02, scale: 0.42, yaw: 0.4 },
  certificates: { ax: 0.45, ay: -0.02, scale: 0.42, yaw: -0.4 },
  timeline: { ax: -0.45, ay: -0.02, scale: 0.42, yaw: 0.4 },
  // footer: off to the far right, looking back at the copy
  contact: { ax: 0.41, ay: 0.05, scale: 0.44, yaw: -0.4 },
};

// Phone layout: centred, and ONLY on the hero + footer. Any other section is
// absent from this table, so the rig reads that as "retreat / hide".
const MOBILE_STATIONS: Record<string, Station> = {
  home: { ax: 0, ay: 0.16, scale: 0.5, yaw: 0 },
  contact: { ax: 0, ay: 0.02, scale: 0.5, yaw: 0 },
};

function CompanionRig({
  stationRef,
  mobileRef,
  pointerRef,
}: {
  stationRef: React.RefObject<string>;
  mobileRef: React.RefObject<boolean>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const cur = useRef({ x: 0, y: 0, s: 0.01, yaw: 0, pitch: 0 }); // start tiny → eases in

  useFrame((_, delta) => {
    if (!group.current) return;
    const mobile = mobileRef.current;
    const table = mobile ? MOBILE_STATIONS : STATIONS;
    const st = table[stationRef.current];
    // on phones the robot only lives on home + footer; anywhere it has no
    // station it shrinks away to nothing rather than crowding the copy
    const hidden = mobile && !st;
    const target = st ?? (mobile ? MOBILE_STATIONS.home : STATIONS.home);

    const tx = target.ax * viewport.width;
    const ty = target.ay * viewport.height;
    const ts = hidden ? 0.0001 : target.scale;

    // gentle, frame-rate-independent glide (higher base = softer easing)
    const k = 1 - Math.pow(0.02, delta);
    cur.current.x += (tx - cur.current.x) * k;
    cur.current.y += (ty - cur.current.y) * k;
    cur.current.s += (ts - cur.current.s) * k;

    // look toward the pointer — a little head-turn (yaw) + nod (pitch) layered
    // on top of the station's resting angle. Small so it stays subtle.
    const p = pointerRef.current;
    const desiredYaw = target.yaw + p.x * 0.5;
    const desiredPitch = p.y * 0.3;
    cur.current.yaw += (desiredYaw - cur.current.yaw) * k;
    cur.current.pitch += (desiredPitch - cur.current.pitch) * k;

    // recede in depth while travelling far, so it floats "back" across the
    // page instead of ploughing straight through the middle of the copy
    const dist = Math.abs(tx - cur.current.x);
    const z = -Math.min(dist * 0.9, 3);

    group.current.position.set(cur.current.x, cur.current.y, z);
    group.current.scale.setScalar(cur.current.s);
    group.current.rotation.y = cur.current.yaw;
    group.current.rotation.x = cur.current.pitch;
    // skip drawing entirely once it has shrunk away on mobile
    group.current.visible = cur.current.s > 0.02;
  });

  return (
    <group ref={group}>
      <Robot />
    </group>
  );
}

export default function RobotCompanion() {
  const introDone = useSiteStore((s) => s.introDone);
  const stationRef = useRef<string>("home");
  const mobileRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  // honour reduced-motion (skip entirely); otherwise run on phones too, but
  // track which layout table the rig should use
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      mobileRef.current = !wide.matches;
      setEnabled(!calm.matches);
    };
    update();
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  // follow the cursor / touch as a normalised (-1..1) point
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  // track the most-visible section and map it to a station key
  useEffect(() => {
    if (!introDone || !enabled) return;
    const map: [string, Element | null][] = [
      ["home", document.getElementById("home")],
      ["about", document.getElementById("about")],
      ["projects", document.getElementById("projects")],
      ["certificates", document.getElementById("certificates")],
      ["timeline", document.getElementById("timeline")],
      ["contact", document.querySelector("footer")],
    ];
    const keyOf = new Map<Element, string>();
    for (const [key, el] of map) if (el) keyOf.set(el, key);

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const key = keyOf.get(e.target);
          if (key) ratios.set(key, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let best = "home";
        let top = -1;
        for (const [key, r] of ratios) {
          if (r > top) {
            top = r;
            best = key;
          }
        }
        stationRef.current = best;
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85] },
    );
    keyOf.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, [introDone, enabled]);

  if (!introDone || !enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={38} color="#67e8f9" />
        <pointLight position={[-3, -1, 3]} intensity={24} color="#fbbf24" />
        <Suspense fallback={null}>
          <CompanionRig
            stationRef={stationRef}
            mobileRef={mobileRef}
            pointerRef={pointerRef}
          />
          {/* procedural studio env — cheap reflections, no HDR download.
              cyan + gold + violet give the chrome its oil-slick colour range */}
          <Environment resolution={64} frames={1}>
            <Lightformer
              intensity={2.2}
              position={[0, 3, 4]}
              scale={[8, 8, 1]}
              color="#cfe8ff"
            />
            <Lightformer
              intensity={1.5}
              position={[-4, -1, 3]}
              scale={[5, 5, 1]}
              color="#ffcf8a"
            />
            <Lightformer
              intensity={1.7}
              position={[4, 1, 2]}
              scale={[5, 5, 1]}
              color="#67e8f9"
            />
            <Lightformer
              intensity={1.2}
              position={[0, -3, 3]}
              scale={[6, 4, 1]}
              color="#a78bfa"
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
