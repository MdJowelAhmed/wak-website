'use client';

interface Reason {
    id: string;
    title: string;
}

const reasonsData: Reason[] = [
    { id: '1', title: 'Quality Work & On-time Delivery' },
    { id: '2', title: '100% Satisfaction' },
    { id: '3', title: '24/7 Ongoing Support' },
    { id: '4', title: '30 Days of Free Support After Completion' }
];

export default function WhyChooseUs() {
    return (
        <section>
            <h2 className="text-xl font-medium text-white mb-3">Why Choose Us</h2>
            <ul className="space-y-1.5">
                {reasonsData.map((reason) => (
                    <li key={reason.id} className="flex items-start gap-3">
                        <span className="text-primary font-medium text-base leading-none mt-1">•</span>
                        <span className="text-white/80 text-sm">{reason.title}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
