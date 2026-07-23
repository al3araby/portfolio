"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Optimised model — built from the raw OBJ by scripts/build-robot.mjs. */
const MODEL_URL = "/models/robot.glb";
/** Largest dimension the model is scaled to fit, in local units. */
const TARGET_SIZE = 2.3;

/**
 * The companion model, normalised and dressed. The decimated GLB ships no
 * normals (obj2gltf drops them) so we recompute smooth ones once, then give
 * it a colourful iridescent metal skin. Idle life (bob + hover tilt + slow
 * turntable) lives on an inner group so the parent rig can freely place and
 * scale it without fighting these transforms.
 */
export default function Robot({ spin = 0.25 }: { spin?: number }) {
  const idle = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: "#9fb4cf", // cool steel-blue base
      metalness: 1.0,
      roughness: 0.26,
      clearcoat: 0.7,
      clearcoatRoughness: 0.22,
      // rainbow metallic sheen so it reads as coloured, not bare grey
      iridescence: 1.0,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 520],
      emissive: new THREE.Color("#0a2a4a"),
      emissiveIntensity: 0.4,
      envMapIntensity: 1.5,
    });

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry.deleteAttribute("normal");
        mesh.geometry.computeVertexNormals();
        mesh.material = material;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });

    // recentre on the origin and scale so the largest axis == TARGET_SIZE
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = TARGET_SIZE / Math.max(size.x, size.y, size.z);
    scene.scale.setScalar(s);
    scene.position.set(-center.x * s, -center.y * s, -center.z * s);

    return scene;
  }, [scene]);

  useFrame((state, delta) => {
    if (!idle.current) return;
    const t = state.clock.elapsedTime;
    const g = idle.current;
    g.rotation.y += delta * spin;
    g.position.y = Math.sin(t * 1.3) * 0.06;
    g.rotation.x = Math.sin(t * 0.9) * 0.05;
    g.rotation.z = Math.sin(t * 0.7 + 1.2) * 0.04;
  });

  return (
    <group ref={idle}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
