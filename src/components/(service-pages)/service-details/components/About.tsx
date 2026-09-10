export default function About({ description }: { description: string }) {
    if (!description) return null;

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-white">About this service</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/80">{description}</p>
        </section>
    );
}
