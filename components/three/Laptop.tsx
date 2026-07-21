"use client";

import { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import CodeScreen from "./CodeScreen";

export type LaptopHandle = {
  /** Lid pivot group — rotate .rotation.x from Math.PI/2 (closed) to ~-0.35 (open) */
  lid: THREE.Group | null;
  screenGlow: THREE.PointLight | null;
};

/**
 * Procedural 3D laptop. No external models — RoundedBoxes + a live
 * CanvasTexture screen. Lid starts closed; the camera rig opens it.
 */
const Laptop = forwardRef<LaptopHandle, { typing: boolean }>(
  function Laptop({ typing }, ref) {
    const lidRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.PointLight>(null);

    useImperativeHandle(ref, () => ({
      get lid() {
        return lidRef.current;
      },
      get screenGlow() {
        return glowRef.current;
      },
    }));

    // Keyboard key positions (grid)
    const keys = useMemo(() => {
      const out: [number, number][] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 14; col++) {
          out.push([-1.43 + col * 0.22, -0.52 + row * 0.22]);
        }
      }
      return out;
    }, []);

    return (
      <group>
        {/* ── Base ── */}
        <RoundedBox args={[3.6, 0.16, 2.4]} radius={0.05} smoothness={6}>
          <meshStandardMaterial color="#1a2030" metalness={0.85} roughness={0.35} />
        </RoundedBox>

        {/* keyboard deck */}
        <mesh position={[0, 0.081, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.4, 2.2]} />
          <meshStandardMaterial color="#141927" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* keys */}
        <group position={[0, 0.09, -0.35]}>
          {keys.map(([x, z], i) => (
            <mesh key={i} position={[x, 0, z]}>
              <boxGeometry args={[0.18, 0.02, 0.18]} />
              <meshStandardMaterial
                color="#232b3f"
                metalness={0.4}
                roughness={0.6}
                emissive="#22d3ee"
                emissiveIntensity={0.06}
              />
            </mesh>
          ))}
          {/* spacebar */}
          <mesh position={[0, 0, 0.68]}>
            <boxGeometry args={[1.3, 0.02, 0.18]} />
            <meshStandardMaterial
              color="#232b3f"
              metalness={0.4}
              roughness={0.6}
              emissive="#22d3ee"
              emissiveIntensity={0.06}
            />
          </mesh>
        </group>

        {/* trackpad */}
        <mesh position={[0, 0.085, 0.85]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.1, 0.6]} />
          <meshStandardMaterial color="#1d2436" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* ── Lid (pivot at back edge) — starts slightly open so it's visible ── */}
        <group ref={lidRef} position={[0, 0.08, -1.18]} rotation={[Math.PI / 2 - 0.55, 0, 0]}>
          <group position={[0, 1.05, 0]}>
            {/* lid shell */}
            <RoundedBox args={[3.6, 2.24, 0.1]} radius={0.05} smoothness={6}>
              <meshStandardMaterial color="#1a2030" metalness={0.85} roughness={0.35} />
            </RoundedBox>
            {/* screen bezel */}
            <mesh position={[0, 0, 0.055]}>
              <planeGeometry args={[3.36, 2.06]} />
              <meshStandardMaterial color="#05070d" roughness={0.9} />
            </mesh>
            {/* live code screen */}
            <CodeScreen started={typing} position={[0, 0, 0.06]} />
            {/* glow that lights the desk when open */}
            <pointLight
              ref={glowRef}
              position={[0, 0, 0.6]}
              color="#22d3ee"
              intensity={0}
              distance={6}
              decay={2}
            />
            {/* logo removed */}
          </group>
        </group>
      </group>
    );
  },
);

export default Laptop;
