"use client";

import type { IconType } from "react-icons";
import {
    FaApplePay,
    FaCcMastercard,
    FaCcPaypal,
    FaCcVisa,
    FaGooglePay,
    FaMobileAlt,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { TbBuildingBank } from "react-icons/tb";
import { useCurrency } from "@/hooks/use-currency";

type PaymentId =
    | "visa"
    | "mastercard"
    | "paypal"
    | "apple-pay"
    | "google-pay"
    | "paychangu"
    | "mobile-money"
    | "and-more";

const PAYMENT_META: Record<PaymentId, { label: string; icon: IconType }> = {
    visa: { label: "Visa", icon: FaCcVisa },
    mastercard: { label: "Mastercard", icon: FaCcMastercard },
    paypal: { label: "PayPal", icon: FaCcPaypal },
    "apple-pay": { label: "Apple Pay", icon: FaApplePay },
    "google-pay": { label: "Google Pay", icon: FaGooglePay },
    paychangu: { label: "PayChangu", icon: TbBuildingBank },
    "mobile-money": { label: "Mobile Money", icon: FaMobileAlt },
    "and-more": { label: "And more", icon: HiDotsHorizontal },
};

const MOBILE_MONEY_MARKETS = new Set(["MW", "TZ", "KE", "UG", "ZM", "BW", "NG"]);
const PAYCHANGU_MARKETS = new Set(["MW", "TZ", "ZA", "ZM", "BW"]);
const WALLET_MARKETS = new Set(["US", "GB", "EU", "CA", "AE"]);
const PAYPAL_MARKETS = new Set(["US", "GB", "EU", "CA", "ZA", "AE", "IN"]);

function methodsForCountry(countryCode: string): PaymentId[] {
    const methods: PaymentId[] = ["visa", "mastercard"];

    if (PAYPAL_MARKETS.has(countryCode)) methods.push("paypal");
    if (WALLET_MARKETS.has(countryCode)) {
        methods.push("apple-pay", "google-pay");
    } else if (countryCode === "IN") {
        methods.push("google-pay");
    }
    if (PAYCHANGU_MARKETS.has(countryCode)) methods.push("paychangu");
    if (MOBILE_MONEY_MARKETS.has(countryCode)) methods.push("mobile-money");

    methods.push("and-more");
    return methods;
}

export default function FooterPayments() {
    const { country } = useCurrency();
    const methods = methodsForCountry(country.code);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Payments in {country.name}
            </p>
            <ul className="flex flex-wrap items-center gap-2">
                {methods.map((method) => {
                    const { label, icon: Icon } = PAYMENT_META[method];
                    return (
                        <li
                            key={method}
                            title={label}
                            aria-label={label}
                            className="flex h-9 min-w-12 items-center justify-center rounded-md bg-white px-2.5 text-zinc-800"
                        >
                            <Icon className="h-6 w-6" aria-hidden />
                            <span className="sr-only">{label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
