"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK_SRC = "/user.svg";

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function isRenderableSrc(src: string): boolean {
  if (src.startsWith("/") || src.startsWith("blob:") || src.startsWith("data:")) {
    return true;
  }
  try {
    const url = new URL(src);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function shouldUnoptimize(src: string): boolean {
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.startsWith("http://")
  );
}

export default function ProfileAvatar({
  src,
  alt,
  className,
  sizes = "80px",
  priority = false,
}: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false);
  const trimmedSrc = src?.trim() ?? "";
  const canRender = Boolean(trimmedSrc) && isRenderableSrc(trimmedSrc);

  useEffect(() => {
    setFailed(false);
  }, [trimmedSrc]);

  const useFallback = !canRender || failed;

  return (
    <div className={cn("relative overflow-hidden bg-section-bg", className)}>
      <Image
        key={useFallback ? "fallback" : trimmedSrc}
        src={useFallback ? FALLBACK_SRC : trimmedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={useFallback || shouldUnoptimize(trimmedSrc)}
        className={cn("object-cover", useFallback && "object-contain p-3")}
        onError={() => {
          if (!useFallback) {
            setFailed(true);
          }
        }}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (!useFallback && naturalWidth === 0 && naturalHeight === 0) {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
