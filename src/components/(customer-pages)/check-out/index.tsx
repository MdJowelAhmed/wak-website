"use client";

import { useEffect, useState } from "react";
import { myFetch } from "../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";
import ShippingForm, { Address } from "./components/ShippingForm";
import CheckoutSummary from "./components/CheckoutSummary";

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export default function Checkout() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    
    // API Totals
    const [apiSubTotal, setApiSubTotal] = useState<number | null>(null);
    const [apiShippingFee, setApiShippingFee] = useState<number | null>(null);
    const [apiGrandTotal, setApiGrandTotal] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        address: '',
        country: 'Bangladesh',
        countryCode: 'BD',
        postalCode: '',
        latitude: 23.7465,
        longitude: 90.3760,
        saveAddress: false,
        notes: ''
    });

    const [loading, setLoading] = useState(true);
    
    // Constants from design (Fallback)
    const fallbackShippingFee = 0;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile for Email
                const profileRes = await myFetch('/users/profile', { cache: 'no-store' });
                const profileEmail = profileRes?.data?.email || '';

                // Fetch Countries
                const countriesRes = await myFetch('/meta/countries', { cache: 'no-store' });
                if (countriesRes?.data && Array.isArray(countriesRes.data)) {
                    setCountries(countriesRes.data);
                }

                // Fetch Cart
                const cartRes = await myFetch('/carts/', { cache: 'no-store' });
                if (cartRes?.data?.items) {
                    const mappedItems = cartRes.data.items.map((item: any) => ({
                        id: item._id,
                        productId: item.product?._id,
                        name: item.product?.name || "Unknown Product",
                        price: item.product?.discountPrice || item.product?.price || 0,
                        image: resolveImageUrl(item.product?.images?.[0]) || "/placeholder.jpg",
                        quantity: item.quantity || 1
                    }));
                    setCartItems(mappedItems);
                }
                
                // Fetch Addresses
                const addressRes = await myFetch('/shipping-addresses', { cache: 'no-store' });
                if (addressRes?.data && Array.isArray(addressRes.data)) {
                    setAddresses(addressRes.data);
                    // Find default address
                    const defaultAddr = addressRes.data.find((a: Address) => a.isDefault) || addressRes.data[0];
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr._id);
                        setFormData(prev => ({
                            ...prev,
                            email: profileEmail,
                            fullName: defaultAddr.fullName || '',
                            phone: defaultAddr.phone || '',
                            city: defaultAddr.city || '',
                            state: defaultAddr.state || '',
                            address: defaultAddr.address || '',
                            country: defaultAddr.country || 'Bangladesh',
                            countryCode: defaultAddr.countryCode || 'BD',
                            postalCode: defaultAddr.postalCode || '',
                            latitude: defaultAddr.latitude || 23.7465,
                            longitude: defaultAddr.longitude || 90.3760,
                        }));

                        // Fetch initial shipping estimate
                        try {
                            const estimateRes = await myFetch(`/product-orders/shipping-estimate?shippingAddressId=${defaultAddr._id}`, { cache: 'no-store' });
                            if (estimateRes?.data) {
                                setApiSubTotal(estimateRes.data.grandSubTotal);
                                setApiShippingFee(estimateRes.data.grandShippingTotal);
                                setApiGrandTotal(estimateRes.data.grandTotal);
                            }
                        } catch (err) {
                            console.error("Failed to fetch initial estimate", err);
                        }
                    } else {
                        setFormData(prev => ({ ...prev, email: profileEmail }));
                    }
                } else {
                    setFormData(prev => ({ ...prev, email: profileEmail }));
                }
            } catch (error) {
                console.error("Failed to fetch checkout data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddressSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setSelectedAddressId(selectedId || null);
        if (!selectedId) {
            setApiSubTotal(null);
            setApiShippingFee(0);
            setApiGrandTotal(null);
            return;
        }
        const selected = addresses.find(a => a._id === selectedId);
        if (selected) {
            setFormData(prev => ({
                ...prev,
                fullName: selected.fullName || '',
                phone: selected.phone || '',
                city: selected.city || '',
                state: selected.state || '',
                address: selected.address || '',
                country: selected.country || 'Bangladesh',
                countryCode: selected.countryCode || 'BD',
                postalCode: selected.postalCode || '',
                latitude: selected.latitude || 23.7465,
                longitude: selected.longitude || 90.3760,
            }));

            // Fetch estimate for newly selected address
            setIsCalculating(true);
            try {
                const estimateRes = await myFetch(`/product-orders/shipping-estimate?shippingAddressId=${selectedId}`, { cache: 'no-store' });
                if (estimateRes?.data) {
                    setApiSubTotal(estimateRes.data.grandSubTotal);
                    setApiShippingFee(estimateRes.data.grandShippingTotal);
                    setApiGrandTotal(estimateRes.data.grandTotal);
                }
            } catch (err) {
                console.error("Failed to fetch estimate for selected address", err);
            } finally {
                setIsCalculating(false);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        let updatedData: any = {
            [name]: type === 'checkbox' ? checked : value
        };

        // If country changes, update countryCode automatically
        if (name === 'country') {
            const selectedCountryObj = countries.find(c => c.name === value);
            if (selectedCountryObj) {
                updatedData.countryCode = selectedCountryObj.countryCode;
            }
        }

        setFormData(prev => ({
            ...prev,
            ...updatedData
        }));
    };

    const handleCalculateShipping = async () => {
        setIsCalculating(true);
        try {
            let savedAddressId = selectedAddressId;

            // Prepare payload
            const payload = { ...formData };
            // Remove non-address fields if needed, but usually APIs ignore extra fields like 'notes', 'saveAddress', 'email'

            if (savedAddressId) {
                // PATCH existing
                const res = await myFetch(`/shipping-addresses/${savedAddressId}`, {
                    method: 'PATCH',
                    body: payload
                });
                if (res?.success && res.data?._id) savedAddressId = res.data._id; 

                console.log("Updated Address Id",res);
            } else {
                // POST new
                const res = await myFetch(`/shipping-addresses`, {
                    method: 'POST',
                    body: payload
                });
                if (res?.data?._id) {
                    savedAddressId = res.data._id;
                    setSelectedAddressId(savedAddressId);
                }
            }

            if (savedAddressId) {
                // Fetch Estimate
                const estimateRes = await myFetch(`/product-orders/shipping-estimate?shippingAddressId=${savedAddressId}`, { cache: 'no-store' });
                if (estimateRes?.data) {
                    setApiSubTotal(estimateRes.data.grandSubTotal);
                    setApiShippingFee(estimateRes.data.grandShippingTotal);
                    setApiGrandTotal(estimateRes.data.grandTotal);
                }
            }
        } catch (error) {
            console.error("Failed to calculate shipping", error);
        } finally {
            setIsCalculating(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select or calculate shipping for an address first.");
            return;
        }

        setIsPlacingOrder(true);
        try {
            const res = await myFetch('/product-orders/checkout', {
                method: 'POST',
                body: { shippingAddressId: selectedAddressId }
            });

            if (res?.success && res?.data?.checkoutUrl) {
                window.open(res.data.checkoutUrl, '_blank');
            } else {
                alert(res?.message || "Failed to initiate checkout. Please try again.");
            }
        } catch (error) {
            console.error("Failed to place order", error);
            alert("Something went wrong while placing your order.");
        } finally {
            setIsPlacingOrder(false);
        }
    };
    
    // Derived state (used before API calculation is done)
    const fallbackSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const fallbackGrandTotal = fallbackSubtotal > 0 ? fallbackSubtotal + fallbackShippingFee : 0;

    const subtotal = apiSubTotal !== null ? apiSubTotal : fallbackSubtotal;
    const shippingFee = apiShippingFee !== null ? apiShippingFee : fallbackShippingFee;
    const grandTotal = apiGrandTotal !== null ? apiGrandTotal : fallbackGrandTotal;

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-180px)] bg-zinc-50 flex items-center justify-center">
                <p className="text-zinc-500 font-medium text-lg">Loading Checkout...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-180px)] bg-zinc-50 py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    <ShippingForm 
                        formData={formData}
                        addresses={addresses}
                        countries={countries}
                        handleInputChange={handleInputChange}
                        handleAddressSelect={handleAddressSelect}
                        handleCalculateShipping={handleCalculateShipping}
                        isCalculating={isCalculating}
                        shippingFee={shippingFee}
                    />

                    <CheckoutSummary 
                        cartItems={cartItems}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        grandTotal={grandTotal}
                        handlePlaceOrder={handlePlaceOrder}
                        isPlacingOrder={isPlacingOrder}
                    />

                </div>
            </div>
        </div>
    );
}
