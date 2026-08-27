import { Truck, Headset, ShieldCheck } from "lucide-react";

const features = [
    {
        id: 1,
        icon: Truck,
        title: "FREE AND FAST DELIVERY",
        description: "Free delivery for all orders over $140"
    },
    {
        id: 2,
        icon: Headset,
        title: "24/7 CUSTOMER SERVICE",
        description: "Friendly 24/7 customer support"
    },
    {
        id: 3,
        icon: ShieldCheck,
        title: "MONEY BACK GUARANTEE",
        description: "We return money within 30 days"
    }
];

const Features = () => {
    return (
        <section className="pt-[50px]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="bg-white backdrop-blur-lg p-8 py-12 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1.5 transition-all duration-300 shadow-xl shadow-black/10 "
                            >
                                {/* Concentric Circular Golden Icon Container */}
                                <div className="w-20 h-20 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-full bg-primary border border-primary flex items-center justify-center shadow-md">
                                        <Icon className="w-6 h-6 text-[#f3f2f1]" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Text content */}
                                <h3 className="text-zinc-700 font-bold text-base tracking-wider mb-2 uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-500 text-sm font-normal max-w-60">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
