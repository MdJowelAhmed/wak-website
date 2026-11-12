"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MediaVideoProps {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  controls?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  ariaLabel?: string;
}

export default function MediaVideo({
  src,
  poster,
  className,
  videoClassName,
  controls = true,
  playsInline = true,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  ariaLabel,
}: MediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trimmedSrc = src.trim();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !trimmedSrc) return;

    if (autoPlay) {
      const startPlayback = async () => {
        try {
          video.muted = true;
          await video.play();
        } catch {
          // Browser blocked autoplay until user gesture
        }
      };
      void startPlayback();
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [autoPlay, trimmedSrc]);

  if (!trimmedSrc) return null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={trimmedSrc}
        poster={poster}
        controls={controls}
        playsInline={playsInline}
        autoPlay={autoPlay}
        muted={muted || autoPlay}
        loop={loop}
        preload={preload}
        aria-label={ariaLabel}
        className={cn("h-full w-full object-cover", videoClassName)}
      />
    </div>
  );
}
