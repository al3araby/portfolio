"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import Robot from "./Robot";
import { useSiteStore } from "@/store/useSiteStore";

/**
 * The phone-only footer robot. It is PINNED to a fixed spot on the screen and
 * never moves with the scroll — it simply fades / scales in (a transition)
 * once the footer comes into view and fades back out when it leaves. There is
 * no position easing, so it stays rock-steady in place. Only mounts on phones
 * (the desktop overlay handles wide screens) and respects reduced-motion.
 */

function Rig() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // subtle look-toward-the-touch/pointer, layered on the model's idle sway
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const k = 1 - Math.pow(0.02, delta);
    const p = pointer.current;
    group.current.rotation.y += (p.x * 0.5 - group.current.rotation.y) * k;
    group.current.rotation.x += (p.y * 0.3 - group.current.rotation.x) * k;
  });

  return (
    <group ref={group} scale={1.15}>
      <Robot />
    </group>
  );
}

export default function RobotFooterMobile() {
  const introDone = useSiteStore((s) => s.introDone);
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  // phones only, and skip for reduced-motion
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!wide.matches && !calm.matches);
    update();
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  // show only while the footer is on screen — fade in/out, no movement
  useEffect(() => {
    if (!enabled || !introDone) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && e.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [enabled, introDone]);

  if (!introDone || !enabled) return null;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      // pinned to a fixed screen spot in the footer zone; never scrolls
      className="pointer-events-none fixed inset-x-0 bottom-[28%] z-30 mx-auto h-60"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={38} color="#67e8f9" />
        <pointLight position={[-3, -1, 3]} intensity={24} color="#fbbf24" />
        <Suspense fallback={null}>
          <Rig />
          {/* procedural studio env — cheap reflections, no HDR download */}
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
    </motion.div>
  );
}
