'use client';

export default function Services({ serviceIncludes }: { serviceIncludes: string[] }) {
    if (!serviceIncludes || serviceIncludes.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-medium text-white mb-3">Services We Offer</h2>
            <ul className="space-y-1.5">
                {serviceIncludes.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/80">
                        <span className="text-white font-bold text-lg leading-none mt-1">•</span>
                        <span className="text-sm">{service}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
