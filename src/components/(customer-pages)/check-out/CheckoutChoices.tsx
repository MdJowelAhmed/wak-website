"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import type { DeliveryOption, PaymentMethod } from "./types";

interface CheckoutChoicesProps {
    deliveryOption: DeliveryOption;
    paymentMethod: PaymentMethod;
    onDeliveryChange: (option: DeliveryOption) => void;
    onPaymentChange: (method: PaymentMethod) => void;
}

const selectTriggerClass =
    "h-12 rounded-xl border-card-border bg-section-bg text-card-foreground focus:ring-1 focus:ring-primary focus:ring-offset-0";

export default function CheckoutChoices({
    deliveryOption,
    paymentMethod,
    onDeliveryChange,
    onPaymentChange,
}: CheckoutChoicesProps) {
    const t = useTranslations("Checkout");

    return (
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-lg sm:p-7">
            <h2 className="mb-5 text-lg font-bold text-card-foreground">{t("orderOptions")}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="font-semibold text-card-foreground">{t("deliveryOption")}</Label>
                    <Select
                        value={deliveryOption}
                        onValueChange={(value) => onDeliveryChange(value as DeliveryOption)}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder={t("selectDelivery")} />
                        </SelectTrigger>
                        <SelectContent className="z-[400] bg-white text-card-foreground">
                            <SelectItem value="delivery">{t("delivery")}</SelectItem>
                            <SelectItem value="pickup">{t("pickup")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-card-foreground">{t("paymentMethod")}</Label>
                    <Select
                        value={paymentMethod}
                        onValueChange={(value) => onPaymentChange(value as PaymentMethod)}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder={t("selectPayment")} />
                        </SelectTrigger>
                        <SelectContent className="z-[400] bg-white text-card-foreground">
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paychangu">PayChangu</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </section>
    );
}
