"use client";

interface PriceFilterProps {
    priceMin: number;
    priceMax: number;
    setPriceMin: (val: number) => void;
    setPriceMax: (val: number) => void;
}

export default function PriceFilter({ priceMin, priceMax, setPriceMin, setPriceMax }: PriceFilterProps) {
    return (
        <div>
            <h3 className="text-gray-900 font-medium text-sm mb-4">Price Range</h3>
            <div className="space-y-6">
                {/* Dual Thumb Range Slider */}
                <div className="relative w-full h-1.5 bg-zinc-200 rounded-full flex items-center">
                    {/* Track filled area */}
                    <div 
                        className="absolute h-full bg-[#FF6700] rounded-full z-10" 
                        style={{ 
                            left: `${(priceMin / 1000) * 100}%`, 
                            right: `${100 - (priceMax / 1000) * 100}%` 
                        }} 
                    />
                    {/* Min Thumb */}
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceMin}
                        onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF6700] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#FF6700] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full z-20 left-0 top-0"
                    />
                    {/* Max Thumb */}
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        value={priceMax}
                        onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#FF6700] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#FF6700] [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full z-30 left-0 top-0"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#4f2c1d] border border-white/10 rounded-lg px-3 py-2 flex items-center">
                        <span className="text-white text-xs font-medium mr-1">$</span>
                        <input
                            type="number"
                            value={priceMin}
                            onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax - 1))}
                            className="w-full bg-transparent outline-none text-white text-xs font-medium text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            min={0}
                            max={priceMax}
                        />
                    </div>
                    <div className="flex-1 bg-[#4f2c1d] border border-white/10 rounded-lg px-3 py-2 flex items-center">
                        <span className="text-white text-xs font-medium mr-1">$</span>
                        <input
                            type="number"
                            value={priceMax}
                            onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin + 1))}
                            className="w-full bg-transparent outline-none text-white text-xs font-medium text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            min={priceMin}
                            max={1000}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
