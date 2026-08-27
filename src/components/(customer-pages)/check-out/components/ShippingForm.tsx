"use client";

import React from 'react';

export interface Address {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    countryCode?: string;
    postalCode?: string;
    isDefault: boolean;
    latitude?: number;
    longitude?: number;
}

interface ShippingFormProps {
    formData: any;
    addresses: Address[];
    countries: any[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddressSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleCalculateShipping: () => void;
    isCalculating: boolean;
    shippingFee: number;
}

export default function ShippingForm({ formData, addresses, countries, handleInputChange, handleAddressSelect, handleCalculateShipping, isCalculating, shippingFee }: ShippingFormProps) {
    return (
        <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-xl font-bold text-zinc-900">Shipping Information</h1>
                    {addresses.length > 0 && (
                        <div className="w-full md:w-64">
                            <select 
                                onChange={handleAddressSelect}
                                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Select previous address...</option>
                                {addresses.map(addr => (
                                    <option key={addr._id} value={addr._id}>
                                        {addr.address}, {addr.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <form className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Email (Optional)
                            </label>
                            <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="Enter email address"
                            />
                        </div>
                    </div>

                    {/* City & Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Dhaka"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Zone <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. Mohakhali"
                            />
                        </div>
                    </div>

                    {/* Country & Postal Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                            >
                                <option value="">Select country...</option>
                                {countries.map((c, i) => (
                                    <option key={i} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                placeholder="e.g. 1209"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder="House, Road, Block, etc."
                        />
                    </div>

                    {/* Save Information & Calculate Shipping */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox"
                                id="saveAddress"
                                name="saveAddress"
                                checked={formData.saveAddress}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="saveAddress" className="text-sm text-zinc-600 cursor-pointer">
                                Save this information for next time
                            </label>
                        </div>
                        
                        {/* Calculate Shipping Button */}
                        <button 
                            type="button"
                            onClick={handleCalculateShipping}
                            disabled={isCalculating}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-sm transition-all ${isCalculating ? 'bg-zinc-400 cursor-not-allowed' : 'bg-primary hover:bg-orange-500 active:scale-95'}`}
                        >
                            {isCalculating ? 'Calculating...' : 'Save Address & Calculate Shipping'}
                        </button>
                    </div>

                    {/* Shipping Fee Section */}
                    <div className="pt-6 border-t border-zinc-100">
                        <h3 className="text-base font-bold text-zinc-900 mb-4">Shipping Fee</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-[5px] border-primary bg-white"></div>
                            <span className="text-sm font-medium text-zinc-700">Shipping charge: ${shippingFee}</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
