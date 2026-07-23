"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import Robot from "./Robot";
import { useSiteStore } from "@/store/useSiteStore";

/**
 * Persistent 3D companion that overlays the whole page. It watches which
 * section is on screen and glides the robot to that section's anchor —
 * large beside the laptop on the hero, then small in alternating corners
 * as you travel down. Pointer-transparent; sits above content, below the
 * navbar. Only mounts once the cinematic intro has handed over.
 */

// anchor = fraction of the viewport (width, height); scale in local units
type Station = { ax: number; ay: number; scale: number };
const STATIONS: Record<string, Station> = {
  home: { ax: 0.31, ay: 0.03, scale: 1.15 },
  about: { ax: 0.33, ay: -0.3, scale: 0.6 },
  projects: { ax: -0.33, ay: -0.3, scale: 0.6 },
  certificates: { ax: 0.33, ay: -0.3, scale: 0.6 },
  timeline: { ax: -0.33, ay: -0.3, scale: 0.6 },
  contact: { ax: 0.0, ay: -0.28, scale: 0.72 },
};

function CompanionRig({ stationRef }: { stationRef: React.RefObject<string> }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const cur = useRef({ x: 0, y: 0, s: 0.01 }); // start tiny → eases in

  useFrame((_, delta) => {
    if (!group.current) return;
    const st = STATIONS[stationRef.current] ?? STATIONS.home;
    const tx = st.ax * viewport.width;
    const ty = st.ay * viewport.height;
    const k = 1 - Math.pow(0.0016, delta); // frame-rate independent glide
    cur.current.x += (tx - cur.current.x) * k;
    cur.current.y += (ty - cur.current.y) * k;
    cur.current.s += (st.scale - cur.current.s) * k;
    group.current.position.set(cur.current.x, cur.current.y, 0);
    group.current.scale.setScalar(cur.current.s);
  });

  return (
    <group ref={group}>
      <Robot spin={0.3} />
    </group>
  );
}

export default function RobotCompanion() {
  const introDone = useSiteStore((s) => s.introDone);
  const stationRef = useRef<string>("home");

  // track the most-visible section and map it to a station key
  useEffect(() => {
    if (!introDone) return;
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
  }, [introDone]);

  if (!introDone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[3, 3, 4]} intensity={40} color="#67e8f9" />
        <pointLight position={[-3, -1, 3]} intensity={26} color="#fbbf24" />
        <pointLight position={[0, 2, 5]} intensity={30} color="#e0f2fe" />
        <Suspense fallback={null}>
          <CompanionRig stationRef={stationRef} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
