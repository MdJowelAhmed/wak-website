import Image from "next/image";

const ServiceBanner = () => {
    return (
        <section className="relative w-full h-screen max-h-[600px] md:max-h-[400px] overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://i.pinimg.com/736x/42/79/fa/4279fa603e2d62b665b8951fc0e02ec0.jpg"
                alt="Professional team collaborating"
                fill
                className="object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative h-full flex flex-col justify-center container mx-auto px-4 py-16 md:py-24">
                <div className="mb-1 md:mb-1">
                    <p className="text-sm md:text-base font-medium text-gray-300 flex items-center gap-2">
                        <span className="text-white">Home</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-primary">Services</span>
                    </p>
                </div>

                {/* Main Heading */}
                <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-medium leading-tight mb-3">
                        <span className="text-white">Explore Our <br /> </span>
                        <span className="text-primary">Professional</span>

                        <span className="text-white"> Services</span>
                    </h1>

                    {/* Description */}
                    <p className="text-base text-white/90 leading-relaxed">
                        Connect with top-rated freelancers and experts. From development to design, find the perfect talent to bring your vision to life.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ServiceBanner;