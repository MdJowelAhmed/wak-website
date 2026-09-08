'use client';

export function ServiceSkeletonCard() {
    return (
        <div className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-xl bg-white/10 shrink-0" />

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-2">
                <div>
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 shrink-0" />
                        <div className="w-16 h-4 bg-white/10 rounded" />
                    </div>
                    <div className="w-20 h-4 bg-white/10 rounded shrink-0" />
                </div>
            </div>
        </div>
    );
}

export default function ServiceSkeletonGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <ServiceSkeletonCard key={i} />
            ))}
        </div>
    );
}
