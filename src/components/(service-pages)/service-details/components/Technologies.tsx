'use client';

export default function Technologies({ technologies }: { technologies: string[] }) {
    if (!technologies || technologies.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-medium text-white mb-3">Technologies We Specialize In</h2>
            <div className="space-y-1.5 flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-white/80 font-normal text-sm border border-white/5">
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    );
}
