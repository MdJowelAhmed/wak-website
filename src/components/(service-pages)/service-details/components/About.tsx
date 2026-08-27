'use client';

export default function About({ description }: { description: string }) {
    if (!description) return null;

    return (
        <section>
            <h1 className="text-xl font-medium text-white mb-3">About this service</h1>
            <div className="space-y-1.5">
                <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">
                    {description}
                </p>
            </div>
        </section>
    );
}
