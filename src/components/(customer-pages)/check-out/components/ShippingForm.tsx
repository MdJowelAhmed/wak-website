"use client";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import type {
    Address,
    CheckoutAddressForm,
    Country,
    DeliveryOption,
} from "../types";
import { formatCheckoutMoney } from "../types";

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
    handleAddressSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSaveAddress: () => void;
    isCalculating: boolean;
    shippingFee: number;
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
}: ShippingFormProps) {
    const isPickup = deliveryOption === "pickup";
    const title = isPickup ? "Pickup address" : "Shipping address";
    const saveLabel = isPickup ? "Save address" : "Save address & calculate shipping";

    return (
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-lg sm:p-7">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
                {addresses.length > 0 && (
                    <select
                        value={selectedAddressId || ""}
                        onChange={handleAddressSelect}
                        className="mt-4 h-12 w-full rounded-xl border border-card-border bg-section-bg px-3 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Select a saved address...</option>
                        {addresses.map((addr) => (
                            <option key={addr._id} value={addr._id}>
                                {addr.address}, {addr.city}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
                {isPickup
                    ? "Choose or save the address you will use for pickup."
                    : "Choose or save the address where this order should be delivered."}
            </p>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="checkout-fullName" className="font-semibold text-card-foreground">
                        Full name<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                        id="checkout-fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                        autoComplete="name"
                        className={fieldClass}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-phone" className="font-semibold text-card-foreground">
                            Phone number<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            required
                            autoComplete="tel"
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-email" className="font-semibold text-card-foreground">
                            Email
                        </Label>
                        <Input
                            id="checkout-email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            autoComplete="email"
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-city" className="font-semibold text-card-foreground">
                            City<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Dhaka"
                            required
                            className={fieldClass}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-state" className="font-semibold text-card-foreground">
                            Zone<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="e.g. Dhanmondi"
                            required
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="checkout-country" className="font-semibold text-card-foreground">
                            Country<span className="text-destructive"> *</span>
                        </Label>
                        <select
                            id="checkout-country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="h-12 w-full rounded-xl border border-card-border bg-section-bg px-3 text-sm text-card-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Select country...</option>
                            {countries.map((country) => (
                                <option key={country.countryCode || country.name} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="checkout-postalCode" className="font-semibold text-card-foreground">
                            Postal code<span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="checkout-postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="e.g. 1209"
                            required
                            className={fieldClass}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="checkout-address" className="font-semibold text-card-foreground">
                        Address<span className="text-destructive"> *</span>
                    </Label>
                    <Input
                        id="checkout-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House, road, block"
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
                        Save this address for next time
                    </label>
                    <Button type="button" onClick={handleSaveAddress} disabled={isCalculating}>
                        {isCalculating ? "Saving..." : saveLabel}
                    </Button>
                </div>

                {!isPickup && (
                    <div className="border-t border-card-border pt-5">
                        <p className="text-sm font-semibold text-card-foreground">
                            Shipping charge: {formatCheckoutMoney(shippingFee)}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
