"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import type { LaptopHandle } from "./Laptop";
import { useSiteStore } from "@/store/useSiteStore";

type Props = {
  laptop: React.RefObject<LaptopHandle | null>;
  onTypingStart: () => void;
};

/**
 * Cinematic camera: waits for the preloader, sweeps in on a long arc,
 * opens the laptop lid (screen flickers on like a CRT), then hands over
 * to mouse-parallax + scroll dolly with a gentle idle float.
 */
export default function CameraRig({ laptop, onTypingStart }: Props) {
  const { camera } = useThree();
  const loaded = useSiteStore((s) => s.loaded);
  const setIntroDone = useSiteStore((s) => s.setIntroDone);
  const [free, setFree] = useState(false);

  const target = useRef(new THREE.Vector3(0, 0.8, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const basePos = useRef(new THREE.Vector3(0, 1.6, 4.6));

  // Track mouse + scroll (normalized)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Cinematic intro timeline — starts when preloader is done
  useEffect(() => {
    if (!loaded) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Poll until refs are ready (Canvas may still be mounting)
    let attempts = 0;
    const tryStart = () => {
      const lid = laptop.current?.lid;
      const glow = laptop.current?.screenGlow;

      if (!lid && attempts < 30) {
        attempts++;
        setTimeout(tryStart, 100);
        return;
      }

      const persp = camera as THREE.PerspectiveCamera;

      if (prefersReduced) {
        camera.position.set(0, 1.6, 4.6);
        persp.fov = 42;
        persp.updateProjectionMatrix();
        if (lid) lid.rotation.x = -0.32;
        if (glow) glow.intensity = 2.2;
        onTypingStart();
        setIntroDone(true);
        setFree(true);
        return;
      }

      camera.position.set(-11, 7.5, 14);
      persp.fov = 58; // wide on approach → tightens for a dolly-zoom feel
      persp.updateProjectionMatrix();
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          setIntroDone(true);
          setFree(true);
        },
      });

      // long arcing sweep: high crane → side glide → settle in front
      tl.to(camera.position, { x: 4.2, y: 3.6, z: 8.6, duration: 2.4 });
      tl.to(camera.position, { x: -1.8, y: 2.2, z: 6.2, duration: 1.7 }, ">-0.55");
      tl.to(camera.position, { x: 0, y: 1.6, z: 4.6, duration: 1.5 }, ">-0.45");
      // dolly-zoom: fov tightens across the whole flight
      tl.to(
        persp,
        {
          fov: 42,
          duration: 3.6,
          ease: "power2.inOut",
          onUpdate: () => persp.updateProjectionMatrix(),
        },
        0.6,
      );

      // lid opens during the final approach
      if (lid) {
        tl.to(
          lid.rotation,
          { x: -0.32, duration: 1.6, ease: "power2.inOut" },
          ">-0.9",
        );
      }
      // screen flickers on like a CRT booting, then holds steady
      if (glow) {
        tl.to(
          glow,
          {
            keyframes: [
              { intensity: 0.9, duration: 0.12 },
              { intensity: 0.15, duration: 0.1 },
              { intensity: 1.6, duration: 0.14 },
              { intensity: 0.6, duration: 0.1 },
              { intensity: 2.2, duration: 0.45, ease: "power1.out" },
            ],
          },
          "<+0.5",
        );
      }
      tl.call(onTypingStart, undefined, "<+0.25");
    };

    tryStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // After the intro: mouse parallax + scroll dolly-out + idle float
  useFrame((state, delta) => {
    if (!free) {
      camera.lookAt(target.current);
      return;
    }
    const t = state.clock.elapsedTime;
    const s = scroll.current;
    const floatY = Math.sin(t * 0.55) * 0.07;
    const floatX = Math.cos(t * 0.4) * 0.05;
    const px = basePos.current.x + floatX + mouse.current.x * 0.55 - s * 2.2;
    const py = basePos.current.y + floatY - mouse.current.y * 0.35 + s * 2.4;
    const pz = basePos.current.z + s * 4.5;

    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp
    camera.position.x += (px - camera.position.x) * k;
    camera.position.y += (py - camera.position.y) * k;
    camera.position.z += (pz - camera.position.z) * k;
    camera.lookAt(target.current);
  });

  return null;
}
