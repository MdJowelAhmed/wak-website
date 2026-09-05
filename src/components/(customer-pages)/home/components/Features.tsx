import Link from "next/link";
import { ShieldCheck, RotateCcw, Headset, Truck, BadgeCheck } from "lucide-react";

const features = [
    {
        id: "secure-payments",
        icon: ShieldCheck,
        title: "Secure Payments",
        description: "100% safe & secure.",
        href: "/privacy-policy",
    },
    {
        id: "easy-returns",
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Hassle-free returns.",
        href: "/terms-of-services",
    },
    {
        id: "support",
        icon: Headset,
        title: "24/7 Support",
        description: "We're here to help.",
        href: "/contact-us",
    },
    {
        id: "fast-delivery",
        icon: Truck,
        title: "Fast Delivery",
        description: "On-time, every time.",
        href: "/about-us",
    },
    {
        id: "verified-merchants",
        icon: BadgeCheck,
        title: "Verified Merchants",
        description: "Trusted & reliable.",
        href: "/vendor/register",
    },
];

const Features = () => {
    return (
        <section className="py-10 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                        Why Choose Us
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
                        Why Shop & Book With <span className="text-primary">Us</span>
                    </h2>
                    <p className="text-sm text-body-text font-medium leading-relaxed">
                        We prioritize your safety, convenience, and complete satisfaction with every product purchase and service booking.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link
                                key={feature.id}
                                href={feature.href}
                                className="bg-card border border-border hover:border-primary/60 p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none"
                            >
                                {/* Circular Icon Container */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 group-hover:bg-primary transition-all duration-300">
                                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors" strokeWidth={1.8} />
                                </div>

                                {/* Text Content */}
                                <h3 className="text-foreground font-bold text-xs sm:text-sm md:text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-body-text text-[11px] sm:text-xs font-medium leading-snug">
                                    {feature.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
