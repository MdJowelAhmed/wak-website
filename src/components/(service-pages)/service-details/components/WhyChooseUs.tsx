const reasons = [
    "Quality work and on-time delivery",
    "100% satisfaction focus",
    "Ongoing support during the project",
    "30 days of free support after completion",
];

export default function WhyChooseUs() {
    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Why choose this gig</h2>
            <ul className="space-y-2.5">
                {reasons.map((reason) => (
                    <li key={reason} className="flex items-start gap-3 text-sm text-white/85">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{reason}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
