"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    name: string;
    inStock: boolean;
    discount?: number;
}

export default function ProductGallery({ images, name, inStock, discount }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const activeImage = images[activeIndex] || images[0];

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-secondary p-4 shadow-lg sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="order-2 flex shrink-0 gap-3 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-x-visible md:pb-0">
                    {images.map((image, index) => (
                        <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                                activeIndex === index
                                    ? "border-primary shadow-md"
                                    : "border-white/10 hover:border-primary/50"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={`${name} view ${index + 1}`}
                                fill
                                unoptimized
                                className="object-contain p-1.5"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>

                <div className="order-1 min-w-0 flex-1 md:order-2">
                    <div
                        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                    >
                        {discount ? (
                            <span className="absolute top-4 left-4 z-20 rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-md">
                                -{discount}%
                            </span>
                        ) : null}
                        <span
                            className={`absolute top-4 right-14 z-20 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                inStock ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                            }`}
                        >
                            {inStock ? "In stock" : "Out of stock"}
                        </span>
                        <div className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white">
                            <ZoomIn className="h-4 w-4" />
                        </div>
                        <div
                            className="relative h-full w-full transition-transform duration-100 ease-out"
                            style={
                                isZoomed
                                    ? {
                                          transform: "scale(1.5)",
                                          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                                      }
                                    : undefined
                            }
                        >
                            <Image
                                src={activeImage}
                                alt={name}
                                fill
                                unoptimized
                                priority
                                className="object-contain p-8"
                                sizes="(min-width: 1024px) 40vw, 100vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
