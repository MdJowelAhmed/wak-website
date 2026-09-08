"use client";

interface PriceFilterProps {
    priceMin: number;
    priceMax: number;
    setPriceMin: (val: number) => void;
    setPriceMax: (val: number) => void;
}

const thumbClass =
    "absolute top-0 left-0 z-20 h-full w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-primary";

export default function PriceFilter({ priceMin, priceMax, setPriceMin, setPriceMax }: PriceFilterProps) {
    return (
        <div>
            <h3 className="mb-4 text-sm font-bold text-card-foreground">Price Range</h3>
            <div className="space-y-5">
                <div className="relative flex h-1.5 w-full items-center rounded-full bg-border">
                    <div
                        className="absolute z-10 h-full rounded-full bg-primary"
                        style={{
                            left: `${(priceMin / 1000) * 100}%`,
                            right: `${100 - (priceMax / 1000) * 100}%`,
                        }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceMin}
                        aria-label="Minimum price"
                        onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                        className={`${thumbClass} z-20`}
                    />
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceMax}
                        aria-label="Maximum price"
                        onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                        className={`${thumbClass} z-30`}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex-1">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Min
                        </span>
                        <div className="flex items-center rounded-xl bg-secondary px-3 py-2.5">
                            <span className="mr-1 text-xs font-medium text-white/70">$</span>
                            <input
                                type="number"
                                value={priceMin}
                                onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                                className="w-full bg-transparent text-center text-xs font-semibold text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                min={0}
                                max={priceMax}
                            />
                        </div>
                    </label>
                    <span className="mt-5 text-muted-foreground" aria-hidden>
                        —
                    </span>
                    <label className="flex-1">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Max
                        </span>
                        <div className="flex items-center rounded-xl bg-secondary px-3 py-2.5">
                            <span className="mr-1 text-xs font-medium text-white/70">$</span>
                            <input
                                type="number"
                                value={priceMax}
                                onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                                className="w-full bg-transparent text-center text-xs font-semibold text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                min={priceMin}
                                max={1000}
                            />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
