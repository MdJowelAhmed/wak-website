"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Loader2, MessageCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { myFetch } from "../../../../../helpers/myFetch";
import { useCurrency } from "@/hooks/use-currency";
import { type ServiceDetailsData } from "../types";

export default function Pricing({ service }: { service: ServiceDetailsData }) {
    const router = useRouter();
    const { formatPrice } = useCurrency();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    const handleCheckout = async () => {
        if (isCheckingOut) return;
        setIsCheckingOut(true);
        try {
            const res = await myFetch(`/service-orders/services/${service.id}/checkout`, {
                method: "POST",
            });
            const checkoutUrl =
                res?.success && typeof res.data?.checkoutUrl === "string"
                    ? res.data.checkoutUrl
                    : null;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }
            toast.error(res?.message || "Could not start checkout.");
        } catch {
            toast.error("Something went wrong during checkout.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleMessage = async () => {
        if (!service.creator.id) {
            toast.error("Provider information is missing.");
            return;
        }
        if (isCreatingChat) return;
        setIsCreatingChat(true);
        try {
            const res = await myFetch("/chats/", {
                method: "POST",
                body: { otherParticipantId: service.creator.id },
            });
            if (res?.success) {
                const chatId = res.data?._id || res.data?.id;
                router.push(chatId ? `/profile/message/${chatId}` : "/profile/message");
                return;
            }
            toast.error(res?.message || "Could not start a conversation.");
        } catch {
            toast.error("Could not start a conversation.");
        } finally {
            setIsCreatingChat(false);
        }
    };

    return (
        <aside className="w-full lg:w-[400px] lg:shrink-0">
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Starting at</p>
                        <p className="mt-1 text-3xl font-bold text-primary">{formatPrice(service.price)}</p>
                    </div>
                    {service.deliveryTime > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {service.deliveryTime} day{service.deliveryTime === 1 ? "" : "s"}
                        </span>
                    )}
                </div>

                {service.packageDetails.length > 0 && (
                    <div className="mb-6 border-t border-white/10 pt-4">
                        <p className="mb-3 text-sm font-semibold text-white">This package includes</p>
                        <ul className="space-y-2">
                            {service.packageDetails.map((item) => (
                                <li key={item} className="flex gap-2 text-sm text-white/80">
                                    <span className="text-primary">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button
                    type="button"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full rounded-xl shadow-md shadow-primary/20"
                >
                    {isCheckingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Continue ({formatPrice(service.price)})
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleMessage}
                    disabled={isCreatingChat}
                    className="mt-3 w-full rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                    {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                    Message {service.creator.name}
                </Button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/60">
                    <Shield className="h-3.5 w-3.5" />
                    Secure payment protection
                </p>
            </div>
        </aside>
    );
}
