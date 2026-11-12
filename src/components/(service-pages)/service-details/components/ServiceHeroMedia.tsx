"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import MediaVideo from "@/ui/MediaVideo";
import { skipImageOptimization } from "../../../../../helpers/image-optimization";

interface ServiceHeroMediaProps {
  name: string;
  image: string;
  video: string | null;
}

export default function ServiceHeroMedia({
  name,
  image,
  video,
}: ServiceHeroMediaProps) {
  const t = useTranslations("ServiceDetails");
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative h-64 w-full sm:h-80 md:h-96">
      {video && showVideo ? (
        <MediaVideo
          key="service-video"
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          controls
          playsInline
          preload="auto"
          ariaLabel={name}
        />
      ) : (
        <>
          <Image
            src={image}
            alt={name}
            fill
            unoptimized={skipImageOptimization(image)}
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
          {video ? (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-2 bg-black/35 transition-colors hover:bg-black/45"
              aria-label={t("playVideo")}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                <Play className="h-7 w-7 fill-current" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-white">{t("playVideo")}</span>
            </button>
          ) : null}
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary via-black/20 to-transparent" />
    </div>
  );
}
