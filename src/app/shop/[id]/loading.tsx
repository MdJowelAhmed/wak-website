export default function ShopDetailsLoading() {
    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 space-y-3">
                    <div className="h-3 w-40 animate-pulse rounded bg-white/20" />
                    <div className="h-9 w-2/3 max-w-xl animate-pulse rounded-lg bg-white/20" />
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="aspect-square animate-pulse rounded-2xl bg-secondary/80" />
                    <div className="h-80 animate-pulse rounded-2xl bg-secondary/80" />
                </div>
            </div>
        </div>
    );
}
