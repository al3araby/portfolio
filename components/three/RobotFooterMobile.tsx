"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import Robot from "./Robot";
import { useSiteStore } from "@/store/useSiteStore";

/**
 * The phone-only footer robot. Unlike the desktop companion (a fixed overlay),
 * this one is planted in the normal page flow between the timeline and the
 * footer, so it scrolls WITH the page instead of hovering over the viewport.
 * It fades / scales in once when it enters view, then simply sits there and
 * scrolls away like any other element — it never follows the scroll. Only
 * mounts on phones (the desktop overlay handles wide screens) and respects
 * reduced-motion.
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
  const [show, setShow] = useState(false);

  // phones only, and skip for reduced-motion
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShow(!wide.matches && !calm.matches);
    update();
    wide.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  if (!introDone || !show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative z-10 mx-auto h-64 w-full"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
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
