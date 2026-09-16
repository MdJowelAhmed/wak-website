import { cn } from "@/lib/utils";

function Pulse({ className }: { className: string }) {
    return <div className={cn("animate-pulse rounded bg-white/10", className)} />;
}

export default function ServiceDetailsSkeleton() {
    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-live="polite">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-8 space-y-3">
                    <Pulse className="h-3 w-40" />
                    <Pulse className="h-9 w-2/3 max-w-xl rounded-lg sm:h-10" />
                </header>

                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="min-w-0 flex-1 space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-lg">
                            <Pulse className="h-64 w-full rounded-none sm:h-80 md:h-96" />
                            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div className="flex items-center gap-3">
                                    <Pulse className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Pulse className="h-4 w-32" />
                                        <Pulse className="h-3 w-20" />
                                    </div>
                                </div>
                                <Pulse className="h-4 w-28" />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                            <Pulse className="mb-3 h-5 w-24" />
                            <div className="space-y-2">
                                <Pulse className="h-3 w-full" />
                                <Pulse className="h-3 w-[92%]" />
                                <Pulse className="h-3 w-4/5" />
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                            <Pulse className="mb-4 h-5 w-36" />
                            <ul className="grid gap-2.5 sm:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <li key={i} className="flex items-center gap-2.5">
                                        <Pulse className="h-5 w-5 rounded-full" />
                                        <Pulse className="h-3 w-28" />
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                            <Pulse className="mb-4 h-5 w-32" />
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Pulse key={i} className="h-8 w-20 rounded-full" />
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                            <Pulse className="mb-4 h-5 w-36" />
                            <div className="space-y-2.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Pulse className="h-1.5 w-1.5 rounded-full" />
                                        <Pulse className="h-3 w-3/4 max-w-sm" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="w-full lg:w-[400px] lg:shrink-0">
                        <div className="sticky top-6 rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    <Pulse className="h-3 w-20" />
                                    <Pulse className="h-8 w-28" />
                                </div>
                                <Pulse className="h-8 w-24 rounded-full" />
                            </div>
                            <div className="mb-6 space-y-2 border-t border-white/10 pt-4">
                                <Pulse className="mb-3 h-4 w-32" />
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Pulse key={i} className="h-3 w-full" />
                                ))}
                            </div>
                            <Pulse className="h-11 w-full rounded-xl" />
                            <Pulse className="mt-3 h-11 w-full rounded-xl" />
                            <Pulse className="mx-auto mt-4 h-3 w-32" />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
