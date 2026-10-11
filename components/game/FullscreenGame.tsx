"use client";

import { useEffect, useState, type RefObject } from "react";

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    function onChange() {
      const on = document.fullscreenElement === ref.current;
      setActive(on);
      if (on) setFallback(false);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [ref]);

  async function toggle() {
    const node = ref.current;
    if (!node) return;
    if (document.fullscreenElement || fallback) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setFallback(false);
      setActive(false);
      return;
    }
    if (node.requestFullscreen) {
      try {
        await node.requestFullscreen();
        return;
      } catch {
        setFallback(true);
        setActive(true);
      }
    } else {
      setFallback(true);
      setActive(true);
    }
  }

  return { active, fallback, toggle };
}
