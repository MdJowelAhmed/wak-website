import { Phone, Mail } from "lucide-react";
import ContactUsForm from "@/shared/ContactUsForm";

const contactInfo = [
    {
        id: "call",
        icon: Phone,
        title: "Call To Us",
        description: "We are available 24/7, 7 days a week.",
        details: "Phone: +8801611112222",
    },
    {
        id: "write",
        icon: Mail,
        title: "Write To Us",
        description: "Fill out our form and we will contact you within 24 hours.",
        details: "Emails: support@gmail.com",
    }
];

export default function ContactUsPage() {
    return (
        <div className="container mx-auto py-12 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Side: Contact Info */}
                <div className="lg:col-span-4 bg-white p-8 rounded-xl shadow-xl flex flex-col gap-10">
                    {contactInfo.map((item, index) => (
                        <div key={item.id} className="w-full">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#FF6700] rounded-full flex items-center justify-center">
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-zinc-900 font-bold text-lg">{item.title}</h3>
                                </div>
                                <div className="space-y-2 text-zinc-600 text-sm leading-relaxed">
                                    <p>{item.description}</p>
                                    <p className="font-semibold text-zinc-800">{item.details}</p>
                                </div>
                            </div>
                            
                            {/* Divider - only between items */}
                            {index < contactInfo.length - 1 && (
                                <div className="border-t border-zinc-200 w-full mt-10"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side: Contact Form */}
                <div className="lg:col-span-8 h-full">
                    <ContactUsForm />
                </div>
            </div>
        </div>
    );
}
