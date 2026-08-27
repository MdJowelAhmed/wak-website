interface Highlight {
    label: string;
    value: string;
}

interface ProductDetailsSectionProps {
    aboutItems: string[];
    highlights: Highlight[];
}

export default function ProductDetailsSection({
    aboutItems,
    highlights,
}: ProductDetailsSectionProps) {
    return (
        <div className="bg-[#2B2B2B] rounded-2xl border border-white/5 p-6 md:p-8 space-y-8">
            {/* Section Title */}
            <h2 className="text-xl font-bold text-white">Product details</h2>

            {/* About this item */}
            <div>
                <h3 className="text-base font-semibold text-white mb-4">About this item</h3>
                <ul className="space-y-3">
                    {aboutItems.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-white/65 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6700] shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Top Highlights */}
            <div>
                <h3 className="text-base font-semibold text-white mb-5">Top highlights</h3>
                <div className="grid grid-cols-1 gap-y-4">
                    {highlights.map(({ label, value }) => (
                        <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-sm">
                            <span className="sm:w-48 text-white/50 shrink-0">{label}</span>
                            <span className="text-white/80 font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
