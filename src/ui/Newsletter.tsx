"use client"
import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            toast.success("Thank you for subscribing!");
            setEmail("");
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-sm">
            <h3 className="text-white font-semibold text-xl tracking-tight">
                Subscribe to our newsletter
            </h3>

            <form
                className="relative flex items-center group"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full bg-transparent border-b border-white focus:border-white py-3 pr-10 text-base outline-none transition-all placeholder:text-white/50 text-white"
                    required
                />
                <button
                    type="submit"
                    className="absolute right-0 p-2 text-white hover:text-white transition-colors cursor-pointer"
                    aria-label="Subscribe"
                >
                    <SendHorizontal className="w-6 h-6 rotate-[-15deg]" />
                </button>
            </form>
        </div >
    )
}

export default Newsletter