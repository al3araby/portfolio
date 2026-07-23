"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Float, Image as ImagePlane } from "@react-three/drei";
import * as THREE from "three";
import type { Certificate } from "@/lib/data";

/* ─────────────────────────  Trophy  ───────────────────────── */

/** A slowly-spinning gold trophy floating above the ring. */
function Trophy() {
  const ref = useRef<THREE.Group>(null);

  // chalice profile (x = radius, y = height) revolved around Y
  const cupPoints = useMemo(
    () =>
      (
        [
          [0.0, 0.0],
          [0.36, 0.0],
          [0.36, 0.05],
          [0.12, 0.12],
          [0.1, 0.42],
          [0.26, 0.56],
          [0.44, 1.0],
          [0.41, 1.0],
          [0.24, 0.6],
          [0.0, 0.52],
        ] as const
      ).map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f6c945",
        metalness: 1,
        roughness: 0.22,
        emissive: new THREE.Color("#4a3200"),
        emissiveIntensity: 0.3,
      }),
    [],
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });

  return (
    <Float
      speed={2.2}
      rotationIntensity={0.25}
      floatIntensity={0.7}
      position={[0, 2.1, 0]}
    >
      <group ref={ref} scale={0.85}>
        {/* cup */}
        <mesh material={goldMat}>
          <latheGeometry args={[cupPoints, 48]} />
        </mesh>
        {/* handles */}
        <mesh material={goldMat} position={[0.42, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.17, 0.03, 12, 24, Math.PI]} />
        </mesh>
        <mesh material={goldMat} position={[-0.42, 0.8, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.17, 0.03, 12, 24, Math.PI]} />
        </mesh>
        {/* plinth */}
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.42, 0.48, 0.16, 32]} />
          <meshStandardMaterial color="#1a1205" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─────────────────────────  Cards  ───────────────────────── */

const tmpScale = new THREE.Vector3();

function Card({
  cert,
  index,
  count,
  radius,
  groupRef,
  onOpen,
}: {
  cert: Certificate;
  index: number;
  count: number;
  radius: number;
  groupRef: React.RefObject<THREE.Group | null>;
  onOpen: (c: Certificate) => void;
}) {
  const inner = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);

  const angle = (index / count) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  useFrame(() => {
    const gy = groupRef.current?.rotation.y ?? 0;
    const front = Math.cos(angle + gy); // 1 when facing the camera
    const s = 1 + Math.max(0, front) * 0.55 + (hover ? 0.05 : 0);
    if (inner.current) {
      tmpScale.set(s, s, s);
      inner.current.scale.lerp(tmpScale, 0.12);
    }
  });

  const open = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onOpen(cert);
  };
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHover(false);
    document.body.style.cursor = "";
  };

  return (
    <group position={[x, 0, z]} rotation={[0, angle, 0]}>
      <group ref={inner}>
        {/* frame border behind the image */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[1.82, 1.4]} />
          <meshStandardMaterial
            color="#3f2f1e"
            metalness={0.4}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {cert.image ? (
          <ImagePlane
            url={cert.image}
            scale={[1.7, 1.28]}
            radius={0.03}
            transparent
            onClick={open}
            onPointerOver={over}
            onPointerOut={out}
          />
        ) : (
          <mesh onClick={open} onPointerOver={over} onPointerOut={out}>
            <planeGeometry args={[1.7, 1.28]} />
            <meshStandardMaterial color="#0c1322" />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** The rotating ring of certificate cards. */
function Ring({
  certs,
  dragOffset,
  dragging,
  onOpen,
}: {
  certs: Certificate[];
  dragOffset: React.RefObject<number>;
  dragging: React.RefObject<boolean>;
  onOpen: (c: Certificate) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0); // accumulated auto-spin, owned locally
  const count = certs.length;
  const radius = 3.3;

  useFrame((_, dt) => {
    if (!dragging.current) spin.current += dt * 0.12; // gentle auto-spin
    if (group.current) {
      const target = spin.current + dragOffset.current;
      const cur = group.current.rotation.y;
      group.current.rotation.y = cur + (target - cur) * Math.min(1, dt * 4);
    }
  });

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {certs.map((c, i) => (
        <Card
          key={c.id}
          cert={c}
          index={i}
          count={count}
          radius={radius}
          groupRef={group}
          onOpen={onOpen}
        />
      ))}
    </group>
  );
}

/* ─────────────────────────  Canvas  ───────────────────────── */

export default function CertCarousel({
  certificates,
  onOpen,
}: {
  certificates: Certificate[];
  onOpen: (c: Certificate) => void;
}) {
  const dragOffset = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  return (
    <div
      className="h-115 w-full cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-130"
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        dragOffset.current += (e.clientX - lastX.current) * 0.006;
        lastX.current = e.clientX;
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 42, near: 0.1, far: 40, position: [0, 1.4, 7] }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[3, 6, 4]} angle={0.5} penumbra={0.8} intensity={90} color="#e0f2fe" />
        <pointLight position={[-4, 2, 3]} intensity={20} color="#22d3ee" />
        <pointLight position={[3, 3, 3]} intensity={25} color="#fbbf24" />

        <Suspense fallback={null}>
          <Ring
            certs={certificates}
            dragOffset={dragOffset}
            dragging={dragging}
            onOpen={onOpen}
          />
          <Trophy />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
