"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const LENS_SIZE = 200;

interface ProductGalleryProps {
    images: string[];
    name: string;
    inStock: boolean;
    discount?: number;
}

type ZoomLevel = 2 | 3;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export default function ProductGallery({ images, name, inStock, discount }: ProductGalleryProps) {
    const t = useTranslations("ShopDetails");
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(2);
    const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const stageRef = useRef<HTMLDivElement>(null);
    const activeImage = images[activeIndex] || images[0];

    const updatePointer = (clientX: number, clientY: number) => {
        const stage = stageRef.current;
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        setStageSize({ width: rect.width, height: rect.height });
        setPointer({
            x: clamp(clientX - rect.left, 0, rect.width),
            y: clamp(clientY - rect.top, 0, rect.height),
        });
    };

    const canShowLens =
        pointer !== null &&
        stageSize.width >= LENS_SIZE &&
        stageSize.height >= LENS_SIZE;

    const lensLeft = canShowLens
        ? clamp(pointer.x - LENS_SIZE / 2, 0, stageSize.width - LENS_SIZE)
        : 0;
    const lensTop = canShowLens
        ? clamp(pointer.y - LENS_SIZE / 2, 0, stageSize.height - LENS_SIZE)
        : 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-secondary p-4 shadow-lg sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="order-2 flex shrink-0 gap-3 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-x-visible md:pb-0">
                    {images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-black/20 transition-all ${
                                activeIndex === index
                                    ? "border-primary shadow-md"
                                    : "border-white/10 hover:border-primary/50"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={t("viewImage", { name, index: index + 1 })}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>

                <div className="order-1 min-w-0 flex-1 md:order-2">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white/70">{t("zoom")}</span>
                            {([2, 3] as const).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setZoomLevel(level)}
                                    className={`h-8 min-w-12 cursor-pointer rounded-full px-3 text-xs font-bold transition-colors ${
                                        zoomLevel === level
                                            ? "bg-primary text-white"
                                            : "bg-white/10 text-white hover:bg-white/15"
                                    }`}
                                >
                                    {level}x
                                </button>
                            ))}
                        </div>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                inStock ? "bg-success/15 text-foreground" : "bg-destructive/15 text-foreground/70"
                            }`}
                        >
                            {inStock ? t("inStock") : t("outOfStock")}
                        </span>
                    </div>

                    <div
                        ref={stageRef}
                        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/20"
                        style={{ cursor: canShowLens ? "none" : "crosshair" }}
                        onPointerEnter={(event) => updatePointer(event.clientX, event.clientY)}
                        onPointerMove={(event) => updatePointer(event.clientX, event.clientY)}
                        onPointerLeave={() => setPointer(null)}
                    >
                        {discount ? (
                            <span className="pointer-events-none absolute top-4 left-4 z-20 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-md">
                                -{discount}%
                            </span>
                        ) : null}

                        <Image
                            src={activeImage}
                            alt={name}
                            fill
                            unoptimized
                            priority
                            draggable={false}
                            className="pointer-events-none object-cover"
                            sizes="(min-width: 1024px) 40vw, 100vw"
                        />

                        {canShowLens && pointer && (
                            <div
                                aria-hidden
                                className="pointer-events-none absolute z-30 overflow-hidden rounded-full border-[3px] border-white shadow-2xl ring-2 ring-primary/50"
                                style={{
                                    left: lensLeft,
                                    top: lensTop,
                                    width: LENS_SIZE,
                                    height: LENS_SIZE,
                                }}
                            >
                                <div
                                    className="absolute"
                                    style={{
                                        width: stageSize.width,
                                        height: stageSize.height,
                                        transform: `translate(${LENS_SIZE / 2 - pointer.x * zoomLevel}px, ${LENS_SIZE / 2 - pointer.y * zoomLevel}px) scale(${zoomLevel})`,
                                        transformOrigin: "0 0",
                                    }}
                                >
                                    <Image
                                        src={activeImage}
                                        alt=""
                                        fill
                                        unoptimized
                                        draggable={false}
                                        className="object-cover"
                                        sizes="(min-width: 1024px) 40vw, 100vw"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
