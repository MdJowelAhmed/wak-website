"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    name: string;
    inStock: boolean;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnail Strip — vertical on desktop, horizontal scroll on mobile */}
            <div className="flex md:flex-col gap-3 shrink-0 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all duration-200 cursor-pointer group bg-white
                            ${activeIndex === idx
                                ? "border-[#FF6700] shadow-lg shadow-orange-950/20 scale-105"
                                : "border-white/8 hover:border-[#FF6700]/50"
                            }`}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-200 ${activeIndex === idx ? "opacity-0" : "opacity-0 group-hover:opacity-100"} bg-[#FF6700]/5`} />
                        <Image
                            src={img}
                            alt={`${name} view ${idx + 1}`}
                            fill
                            className="object-contain p-2"
                            unoptimized={true}
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex flex-col gap-3 order-1 md:order-2">
                <div
                    className="relative w-full aspect-square bg-white rounded-2xl border border-white/8 overflow-hidden cursor-zoom-in"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                >

                    {/* Zoom icon hint */}
                    <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-60">
                        <ZoomIn className="w-4 h-4 text-white" />
                    </div>

                    {/* Subtle radial glow behind product */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,103,0,0.06)_0%,_transparent_70%)] pointer-events-none" />

                    {/* Image */}
                    <div
                        className="relative w-full h-full transition-transform duration-100 ease-out"
                        style={isZoomed ? {
                            transform: "scale(1.5)",
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                        } : {}}
                    >
                        <Image
                            src={images[activeIndex]}
                            alt={name}
                            fill
                            className="object-contain p-8 drop-shadow-2xl"
                            priority
                            unoptimized={true}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}
