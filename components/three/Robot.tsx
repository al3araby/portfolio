"use client";

import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Optimised model — built from the raw OBJ by scripts/build-robot.mjs. */
const MODEL_URL = "/models/robot.glb";
/** Largest dimension the model is scaled to fit, in local units. */
const TARGET_SIZE = 1.9;

/**
 * The companion model, normalised and dressed. The decimated GLB ships no
 * normals (obj2gltf drops them) so we recompute smooth ones once, then give
 * it a vivid oil-slick iridescent chrome skin. Idle life is a gentle bob +
 * micro-sway only — it never spins around, so it always reads as "standing"
 * facing the viewer. Facing/placement is driven by the parent rig; these
 * transforms live on an inner group so they compose cleanly.
 */
export default function Robot() {
  const idle = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: "#aeb9d6", // light cool base so the iridescence reads vivid
      metalness: 1.0,
      roughness: 0.15, // shinier, cleaner reflections
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      // wide oil-slick rainbow sheen — cyan → violet → gold
      iridescence: 1.0,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [140, 780],
      emissive: new THREE.Color("#123a5e"),
      emissiveIntensity: 0.3,
      envMapIntensity: 1.8,
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

  useFrame((state) => {
    if (!idle.current) return;
    const t = state.clock.elapsedTime;
    const g = idle.current;
    // gentle "alive" idle — bob + tiny sway/nod, NO full rotation
    g.position.y = Math.sin(t * 1.1) * 0.05;
    g.rotation.y = Math.sin(t * 0.5) * 0.06; // tiny look side-to-side
    g.rotation.x = Math.sin(t * 0.8 + 1.0) * 0.03; // subtle nod
    g.rotation.z = Math.sin(t * 0.6) * 0.035; // subtle sway
  });

  return (
    <group ref={idle}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
