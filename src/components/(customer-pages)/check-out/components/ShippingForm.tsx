"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import type {
    Address,
    CheckoutAddressForm,
    Country,
    DeliveryOption,
} from "../types";

const fieldClass =
    "h-12 rounded-xl border-card-border bg-section-bg text-card-foreground placeholder:text-muted-foreground focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary";

interface ShippingFormProps {
    formData: CheckoutAddressForm;
    addresses: Address[];
    countries: Country[];
    selectedAddressId: string | null;
    deliveryOption: DeliveryOption;
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    handleAddressSelect: (addressId: string) => void;
    handleSaveAddress: () => void;
    isCalculating: boolean;
    shippingFee: number;
    formatMoney: (amountUsd: number) => string;
}

export default function ShippingForm({
    formData,
    addresses,
    countries,
    selectedAddressId,
    deliveryOption,
    handleInputChange,
    handleAddressSelect,
    handleSaveAddress,
    isCalculating,
    shippingFee,
    formatMoney,
}: ShippingFormProps) {
    const t = useTranslations("Checkout");
    const isPickup = deliveryOption === "pickup";
    const title = isPickup ? t("pickupAddress") : t("shippingAddress");
    const saveLabel = isPickup ? t("saveAddress") : t("saveAddressShipping");

    return (
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-lg sm:p-7">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
                <div className="mt-4 space-y-2">
                    <Label className="font-semibold text-card-foreground">{t("savedAddress")}</Label>
                    <Select
                        value={selectedAddressId || "new"}
                        onValueChange={(value) => handleAddressSelect(value === "new" ? "" : value)}
                    >
                        <SelectTrigger className="h-12 rounded-xl border-card-border bg-section-bg text-card-foreground focus:ring-1 focus:ring-primary focus:ring-offset-0">
                            <SelectValue placeholder={t("selectSavedAddress")} />
                        </SelectTrigger>
                        <SelectContent className="z-[400] bg-white text-card-foreground">
                            <SelectItem value="new">{t("newAddress")}</SelectItem>
                            {addresses.map((addr) => (
                                <SelectItem key={addr._id} value={addr._id}>
                                    {addr.fullName ? `${addr.fullName} — ` : ""}
                                    {addr.address}, {addr.city}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
                {isPickup ? t("pickupHint") : t("deliveryHint")}
            </p>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="checkout-fullName" className="font-semibold text-card-foreground">
                        {t("fullName")}<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                        id="checkout-fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t("fullNamePlaceholder")}
                        required
                        autoComplete="name"
                        className={fieldClass}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-phone" className="font-semibold text-card-foreground">
                            {t("phone")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t("phonePlaceholder")}
                            required
                            autoComplete="tel"
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-email" className="font-semibold text-card-foreground">
                            {t("email")}
                        </Label>
                        <Input
                            id="checkout-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t("emailPlaceholder")}
                            autoComplete="email"
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-city" className="font-semibold text-card-foreground">
                            {t("city")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder={t("cityPlaceholder")}
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-state" className="font-semibold text-card-foreground">
                            {t("zone")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder={t("zonePlaceholder")}
                            required
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-country" className="font-semibold text-card-foreground">
                            {t("country")}<span className="text-destructive"> *</span>
                        </Label>
                        <select
                            id="checkout-country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="h-12 w-full rounded-xl border border-card-border bg-section-bg px-3 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">{t("selectCountry")}</option>
                            {countries.map((country) => (
                                <option key={country.countryCode || country.name} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-postalCode" className="font-semibold text-card-foreground">
                            {t("postalCode")}<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder={t("postalPlaceholder")}
                            required
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="checkout-address" className="font-semibold text-card-foreground">
                        {t("address")}<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                        id="checkout-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t("addressPlaceholder")}
                        required
                        className={fieldClass}
                    />
                </div>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                        <input
                            type="checkbox"
                            name="saveAddress"
                            checked={formData.saveAddress}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-card-border text-primary focus:ring-primary"
                        />
                        {t("saveForNext")}
                    </label>
                    <Button type="button" onClick={handleSaveAddress} disabled={isCalculating}>
                        {isCalculating ? t("saving") : saveLabel}
                    </Button>
                </div>

                {!isPickup && (
                    <div className="border-t border-card-border pt-5">
                        <p className="text-sm font-semibold text-card-foreground">
                            {t("shippingCharge", { price: formatMoney(shippingFee) })}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
