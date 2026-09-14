"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { myFetch } from "../../../../helpers/myFetch";
import { useCurrency } from "@/hooks/use-currency";
import CheckoutChoices from "./CheckoutChoices";
import ShippingForm from "./components/ShippingForm";
import CheckoutSummary from "./components/CheckoutSummary";
import type {
    Address,
    CartItem,
    CheckoutAddressForm,
    Country,
    DeliveryOption,
    PaymentMethod,
    ShippingEstimate,
} from "./types";
import { readEstimate } from "./types";

interface CheckoutProps {
    cartItems: CartItem[];
    addresses: Address[];
    countries: Country[];
    initialForm: CheckoutAddressForm;
    initialAddressId: string | null;
    initialEstimate: ShippingEstimate | null;
}

export default function Checkout({
    cartItems,
    addresses: initialAddresses,
    countries,
    initialForm,
    initialAddressId,
    initialEstimate,
}: CheckoutProps) {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [selectedAddressId, setSelectedAddressId] = useState(initialAddressId);
    const [formData, setFormData] = useState(initialForm);
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("delivery");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
    const [estimate, setEstimate] = useState(initialEstimate);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const { formatPrice } = useCurrency();
    const t = useTranslations("Checkout");

    const fallbackSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const subtotal = estimate?.grandSubTotal ?? fallbackSubtotal;
    const shippingFee = deliveryOption === "pickup" ? 0 : (estimate?.grandShippingTotal ?? 0);
    const grandTotal = deliveryOption === "pickup" ? subtotal : (estimate?.grandTotal ?? fallbackSubtotal);

    const applyAddress = (address: Address) => {
        setFormData((prev) => ({
            ...prev,
            fullName: address.fullName || "",
            phone: address.phone || "",
            city: address.city || "",
            state: address.state || "",
            address: address.address || "",
            country: address.country || "Bangladesh",
            countryCode: address.countryCode || "BD",
            postalCode: address.postalCode || "",
            latitude: address.latitude ?? 23.7465,
            longitude: address.longitude ?? 90.376,
        }));
    };

    const fetchEstimate = async (addressId: string) => {
        const estimateRes = await myFetch(
            `/product-orders/shipping-estimate?shippingAddressId=${addressId}`,
            { cache: "no-store" },
        );
        const nextEstimate = readEstimate(estimateRes?.data);
        if (nextEstimate) setEstimate(nextEstimate);
    };

    const handleDeliveryChange = async (option: DeliveryOption) => {
        setDeliveryOption(option);
        if (option === "pickup") return;
        if (!selectedAddressId) return;
        setIsCalculating(true);
        try {
            await fetchEstimate(selectedAddressId);
        } catch {
            toast.error(t("shippingError"));
        } finally {
            setIsCalculating(false);
        }
    };

    const handleAddressSelect = async (selectedId: string) => {
        setSelectedAddressId(selectedId || null);
        if (!selectedId) {
            setEstimate(null);
            setFormData((prev) => ({
                ...prev,
                fullName: "",
                phone: "",
                city: "",
                state: "",
                address: "",
                country: "",
                countryCode: "",
                postalCode: "",
            }));
            return;
        }

        const selected = addresses.find((address) => address._id === selectedId);
        if (selected) applyAddress(selected);
        if (deliveryOption === "pickup") return;

        setIsCalculating(true);
        try {
            await fetchEstimate(selectedId);
        } catch {
            toast.error(t("shippingError"));
        } finally {
            setIsCalculating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => {
            const next = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            if (name === "country") {
                const selectedCountry = countries.find((country) => country.name === value);
                if (selectedCountry) next.countryCode = selectedCountry.countryCode;
            }

            return next;
        });
    };

    const handleSaveAddress = async () => {
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
            toast.error(t("requiredFields"));
            return;
        }

        setIsCalculating(true);
        try {
            let savedAddressId = selectedAddressId;
            const payload = { ...formData };

            if (savedAddressId) {
                const res = await myFetch(`/shipping-addresses/${savedAddressId}`, {
                    method: "PATCH",
                    body: payload,
                });
                if (res?.success && typeof res.data?._id === "string") {
                    savedAddressId = res.data._id;
                } else if (!res?.success) {
                    toast.error(res?.message || t("updateAddressError"));
                    return;
                }
            } else {
                const res = await myFetch("/shipping-addresses", {
                    method: "POST",
                    body: payload,
                });
                if (typeof res?.data?._id === "string") {
                    savedAddressId = res.data._id;
                    setSelectedAddressId(savedAddressId);
                    setAddresses((prev) => [
                        ...prev,
                        {
                            _id: res.data._id,
                            fullName: formData.fullName,
                            phone: formData.phone,
                            address: formData.address,
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            countryCode: formData.countryCode,
                            postalCode: formData.postalCode,
                            isDefault: false,
                            latitude: formData.latitude,
                            longitude: formData.longitude,
                        },
                    ]);
                } else {
                    toast.error(res?.message || t("saveAddressError"));
                    return;
                }
            }

            if (savedAddressId && deliveryOption === "delivery") {
                await fetchEstimate(savedAddressId);
            }
            toast.success(t("addressSaved"));
        } catch {
            toast.error(t("saveFailed"));
        } finally {
            setIsCalculating(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            toast.error(t("emptyCartToast"));
            return;
        }
        if (deliveryOption === "delivery" && !selectedAddressId) {
            toast.error(t("needAddress"));
            return;
        }

        setIsPlacingOrder(true);
        try {
            const body: {
                deliveryOption: DeliveryOption;
                paymentMethod: PaymentMethod;
                shippingAddressId?: string;
            } = {
                deliveryOption,
                paymentMethod,
            };
            if (deliveryOption === "delivery" && selectedAddressId) {
                body.shippingAddressId = selectedAddressId;
            }

            const res = await myFetch("/product-orders/checkout", {
                method: "POST",
                body,
            });

            const checkoutUrl =
                res?.success && typeof res.data?.checkoutUrl === "string"
                    ? res.data.checkoutUrl
                    : null;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }

            toast.error(res?.message || t("checkoutFailed"));
        } catch {
            toast.error(t("placeOrderError"));
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-foreground">{t("emptyTitle")}</h1>
                <p className="mt-2 text-sm text-white/80">{t("emptyDescription")}</p>
                <Link
                    href="/shop"
                    className="mt-6 inline-flex rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90"
                >
                    {t("browseProducts")}
                </Link>
            </div>
        );
    }

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{t("eyebrow")}</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
                </header>

                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="min-w-0 flex-1 space-y-6">
                        <CheckoutChoices
                            deliveryOption={deliveryOption}
                            paymentMethod={paymentMethod}
                            onDeliveryChange={handleDeliveryChange}
                            onPaymentChange={setPaymentMethod}
                        />
                        {deliveryOption === "delivery" && (
                            <ShippingForm
                                formData={formData}
                                addresses={addresses}
                                countries={countries}
                                selectedAddressId={selectedAddressId}
                                deliveryOption={deliveryOption}
                                handleInputChange={handleInputChange}
                                handleAddressSelect={handleAddressSelect}
                                handleSaveAddress={handleSaveAddress}
                                isCalculating={isCalculating}
                                shippingFee={shippingFee}
                                formatMoney={formatPrice}
                            />
                        )}
                    </div>

                    <CheckoutSummary
                        cartItems={cartItems}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        grandTotal={grandTotal}
                        deliveryOption={deliveryOption}
                        paymentMethod={paymentMethod}
                        formatMoney={formatPrice}
                        onPlaceOrder={handlePlaceOrder}
                        isPlacingOrder={isPlacingOrder}
                    />
                </div>
            </div>
        </div>
    );
}
