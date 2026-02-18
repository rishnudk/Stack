"use client";

import { useCallback, useRef } from "react";

export const useSound = (url: string, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
    }

    audioRef.current.volume = volume;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Ignore errors (e.g., user hasn't interacted with the page yet)
    });
  }, [url, volume]);

  return play;
};
