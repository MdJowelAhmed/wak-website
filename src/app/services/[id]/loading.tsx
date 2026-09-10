export default function ServiceDetailsLoading() {
    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 space-y-3">
                    <div className="h-3 w-40 animate-pulse rounded bg-white/20" />
                    <div className="h-9 w-2/3 max-w-xl animate-pulse rounded-lg bg-white/20" />
                </div>
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="min-w-0 flex-1 space-y-6">
                        <div className="h-80 animate-pulse rounded-2xl bg-secondary/80" />
                        <div className="h-40 animate-pulse rounded-2xl bg-secondary/80" />
                        <div className="h-32 animate-pulse rounded-2xl bg-secondary/80" />
                    </div>
                    <div className="h-72 w-full animate-pulse rounded-2xl bg-secondary/80 lg:w-[400px]" />
                </div>
            </div>
        </div>
    );
}
