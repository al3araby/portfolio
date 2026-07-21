"use client";

import { create } from "zustand";

type SiteState = {
  /** WebGL canvas has actually rendered frames (assets compiled) */
  sceneReady: boolean;
  /** Preloader finished fading out */
  loaded: boolean;
  /** Cinematic camera intro finished (UI can reveal) */
  introDone: boolean;
  setSceneReady: (v: boolean) => void;
  setLoaded: (v: boolean) => void;
  setIntroDone: (v: boolean) => void;
};

export const useSiteStore = create<SiteState>((set) => ({
  sceneReady: false,
  loaded: false,
  introDone: false,
  setSceneReady: (v) => set({ sceneReady: v }),
  setLoaded: (v) => set({ loaded: v }),
  setIntroDone: (v) => set({ introDone: v }),
}));
