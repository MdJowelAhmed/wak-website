import ServiceSkeletonGrid from "@/components/(service-pages)/services/components/ServiceSkeleton";

export default function ServicesLoading() {
    return (
        <main className="w-full pb-16 md:py-20 bg-[#4f2c1d]">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-10 bg-white/10 rounded-full animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
                            <div className="h-4 w-64 bg-white/10 rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Category Tabs Skeleton */}
                <div className="flex flex-wrap gap-2.5 mb-12">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-24 h-10 bg-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Services Grid Skeleton */}
                <ServiceSkeletonGrid />
            </div>
        </main>
    );
}
