"use client"

import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { toast } from "sonner";
import { myFetch } from "../../helpers/myFetch";

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "", 
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await myFetch("/contact/", {
                method: "POST",
                body: formData
            });

            if (res.success) {
                toast.success(res.message || "Message sent successfully!");
                // Clear form on success
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            } else {
                toast.error(res.message || res.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Contact API error:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="bg-white p-8 rounded-xl shadow-xl w-full h-full flex flex-col justify-between" onSubmit={handleSubmit}>
            <div className="space-y-8">
                {/* Top Row: Name, Email, Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label className="text-zinc-800 font-medium">
                            Full Name<span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-0 h-12 mt-3"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-zinc-800 font-medium">
                            Email<span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-0 h-12 mt-3"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-zinc-800 font-medium">
                            Contact Number<span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            className="bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:ring-offset-0 h-12 mt-3"
                        />
                    </div>
                </div>

                {/* Bottom Row: Message */}
                <div className="space-y-3">
                    <Label className="text-zinc-800 font-medium">
                        Message<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type here.."
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-lg p-4 min-h-[150px] outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all resize-none mt-3"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
                <Button 
                    type="submit"
                    disabled={loading}
                    className="bg-[#FF6700] hover:bg-orange-500 text-white px-8 py-6 text-md font-medium rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-70"
                >
                    {loading ? "Sending..." : "Send Message"}
                </Button>
            </div>
        </form>
    );
};

export default ContactUsForm;