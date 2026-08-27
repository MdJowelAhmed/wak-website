'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';


export default function Header({ service }: { service: any }) {
    if (!service) return null;

    const avatarUrl = resolveImageUrl(service.creator?.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.creator?.name || 'User')}&background=random`;
    const heroImageUrl = resolveImageUrl(service.image) || "/placeholder.jpg";

    return (
        <div className="">
            <div className="container mx-auto px-4 ">
                <div className="grid grid-cols-1 gap-8 items-start">
                    {/* Left Content */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                            {service.name}
                        </h1>

                        {/* Professional Info */}
                        <div className="flex items-center gap-4 pb-2">
                            <div className='flex items-center gap-4 border-e-2 border-white/50 pe-6'>
                                <Image
                                    src={avatarUrl}
                                    alt={service.creator?.name || "Professional"}
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover"
                                    unoptimized={true}
                                />
                                <div className="flex-1 space-y-1.5">
                                    <h3 className="text-white font-semibold text-lg">{service.creator?.name}</h3>
                                    <p className="text-xs text-orange-400 font-normal">TOP RATED SELLER</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                    <span className="text-white font-semibold ml-1">{service.averageRating || service.ratingAverage || 0}</span>
                                </div>
                                <span className="text-white/70">({service.ratingCount || 0} REVIEWS)</span>
                            </div>

                        </div>
                    </div>

                    {/* Right Hero Image */}
                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                        <Image
                            src={heroImageUrl}
                            alt={service.name}
                            fill
                            className="object-cover"
                            unoptimized={true}
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
