"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { toast } from "sonner";
import { myFetch } from "../../helpers/myFetch";

const fieldClass =
    "h-12 rounded-xl border-card-border bg-section-bg text-card-foreground placeholder:text-muted-foreground focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary";

const ContactUsForm = () => {
    const t = useTranslations("Contact");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error(t("requiredFields"));
            return;
        }

        setLoading(true);
        try {
            const res = await myFetch("/contact/", {
                method: "POST",
                body: formData,
            });

            if (res.success) {
                toast.success(res.message || t("sent"));
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(res.message || res.error || t("sendFailed"));
            }
        } catch {
            toast.error(t("unexpected"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="flex h-full flex-col justify-between rounded-2xl border border-card-border bg-card p-6 shadow-lg sm:p-8"
            onSubmit={handleSubmit}
        >
            <div>
                <h2 className="mb-1 text-lg font-bold text-card-foreground">{t("formTitle")}</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    {t("formHint")}
                </p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="contact-name" className="font-semibold text-card-foreground">
                            {t("fullName")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="contact-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t("fullNamePlaceholder")}
                            required
                            autoComplete="name"
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-email" className="font-semibold text-card-foreground">
                            {t("email")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="contact-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("emailPlaceholder")}
                            required
                            autoComplete="email"
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="font-semibold text-card-foreground">
                            {t("contactNumber")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="contact-phone"
                            name="subject"
                            type="tel"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder={t("contactPlaceholder")}
                            required
                            autoComplete="tel"
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <Label htmlFor="contact-message" className="font-semibold text-card-foreground">
                        {t("message")}<span className="text-destructive"> *</span>
                    </Label>
                    <Textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("messagePlaceholder")}
                        required
                        rows={6}
                        className="min-h-[150px] resize-none rounded-xl border-card-border bg-section-bg p-4 text-card-foreground placeholder:text-muted-foreground focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button type="submit" disabled={loading} size="lg" className="px-8">
                    {loading ? t("sending") : t("send")}
                </Button>
            </div>
        </form>
    );
};

export default ContactUsForm;
