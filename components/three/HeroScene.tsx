"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Grid,
  Sparkles,
  Stars,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";
import Laptop, { type LaptopHandle } from "./Laptop";
import Particles from "./Particles";
import CameraRig from "./CameraRig";
import { useSiteStore } from "@/store/useSiteStore";

/** Reports readiness after the canvas has painted a few real frames. */
function SceneReadyProbe() {
  const frames = useRef(0);
  const setSceneReady = useSiteStore((s) => s.setSceneReady);
  useFrame(() => {
    frames.current++;
    if (frames.current === 8) setSceneReady(true);
  });
  return null;
}

/** Soft ring of drifting glow-dust orbiting the laptop (replaces hard torus rings) */
function ParticleHalo({
  radius = 3,
  count = 260,
  color = "#22d3ee",
  tilt = 0.35,
  speed = 0.06,
  spread = 0.5,
  size = 0.035,
  opacity = 0.7,
}: {
  radius?: number;
  count?: number;
  color?: string;
  tilt?: number;
  speed?: number;
  spread?: number;
  size?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * spread;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.18;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count, radius, spread]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <group position={[0, 0.9, 0]} rotation={[tilt, 0, 0.08]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={size}
          transparent
          opacity={opacity}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Bright orb circling the laptop with a glowing comet trail */
function Comet({
  radius = 3.1,
  speed = 0.45,
  tilt = 0.35,
  color = "#67e8f9",
  phase = 0,
}: {
  radius?: number;
  speed?: number;
  tilt?: number;
  color?: string;
  phase?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    ref.current?.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 2.1) * 0.12,
      Math.sin(t) * radius,
    );
  });
  return (
    <group position={[0, 0.9, 0]} rotation={[tilt, 0, 0.08]}>
      <Trail
        width={1.4}
        length={5}
        color={color}
        attenuation={(w) => w * w}
      >
        <mesh ref={ref}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </Trail>
    </group>
  );
}

export default function HeroScene() {
  const laptopRef = useRef<LaptopHandle | null>(null);
  const [typing, setTyping] = useState(false);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 42, near: 0.1, far: 60, position: [-9, 6.5, 12] }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 12, 32]} />

      <SceneReadyProbe />

      {/* lighting — boosted so laptop is clearly visible */}
      <ambientLight intensity={1.2} />
      <spotLight
        position={[4, 7, 4]}
        angle={0.5}
        penumbra={0.9}
        intensity={120}
        color="#e0f2fe"
        castShadow={false}
      />
      <spotLight
        position={[-4, 5, 5]}
        angle={0.6}
        penumbra={1}
        intensity={80}
        color="#ffffff"
        castShadow={false}
      />
      <pointLight position={[-6, 3, -4]} intensity={30} color="#2dd4bf" />
      <pointLight position={[6, 1.5, -6]} intensity={20} color="#fbbf24" />
      <pointLight position={[0, 4, 6]} intensity={40} color="#e0f2fe" />

      <group position={[0, -0.1, 0]}>
        <Laptop ref={laptopRef} typing={typing} />
        <ContactShadows
          position={[0, -0.09, 0]}
          opacity={0.7}
          scale={14}
          blur={2.2}
          far={4}
          color="#000820"
        />
      </group>

      {/* cinematic floor grid */}
      <Grid
        position={[0, -0.19, 0]}
        args={[30, 30]}
        cellSize={0.6}
        cellThickness={0.4}
        cellColor="#0e2a3a"
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor="#0a3d52"
        fadeDistance={18}
        fadeStrength={2}
        infiniteGrid
      />

      {/* glow-dust halos + comets instead of hard rings */}
      <ParticleHalo radius={2.9} color="#22d3ee" tilt={0.35} speed={0.07} />
      <ParticleHalo
        radius={3.9}
        count={180}
        color="#fbbf24"
        tilt={-0.25}
        speed={-0.04}
        size={0.028}
        opacity={0.45}
      />
      <Comet radius={3.1} speed={0.4} color="#67e8f9" />
      <Comet radius={3.9} speed={-0.28} tilt={-0.25} color="#fbbf24" phase={2} />
      <Particles />

      {/* deep-space backdrop + magic dust around the laptop */}
      <Stars radius={40} depth={20} count={1600} factor={3} saturation={0} fade speed={0.6} />
      <Sparkles
        count={70}
        scale={[7, 4, 7]}
        position={[0, 1.4, 0]}
        size={2.2}
        speed={0.35}
        color="#67e8f9"
        opacity={0.7}
      />
      <Sparkles
        count={30}
        scale={[10, 6, 10]}
        position={[0, 2, -2]}
        size={3.5}
        speed={0.2}
        color="#fbbf24"
        opacity={0.4}
      />

      {/* Environment loads an HDR over the network — must NOT block the scene.
          Suspense here keeps the laptop + lights rendering immediately. */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <CameraRig laptop={laptopRef} onTypingStart={() => setTyping(true)} />
    </Canvas>
  );
}
