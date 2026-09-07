'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Check, X, Building } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/ui/dialog';

interface Address {
    id: string;
    label: string;
    city: string;
    postalCode: string;
    addressLine: string;
    isDefault?: boolean;
}

const defaultAddresses: Address[] = [
    {
        id: 'addr-1',
        label: 'Home',
        city: 'Lilongwe',
        postalCode: '20100',
        addressLine: 'Area 10, Plot 42, Lilongwe, Malawi',
        isDefault: true,
    },
    {
        id: 'addr-2',
        label: 'Office',
        city: 'Blantyre',
        postalCode: '31200',
        addressLine: 'Victoria Avenue, Blantyre, Malawi',
    },
    {
        id: 'addr-3',
        label: 'Warehouse',
        city: 'Mzuzu',
        postalCode: '10100',
        addressLine: 'Mzuzu Central, Mzuzu, Malawi',
    },
];

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLocation: string;
    onSelectLocation: (locationStr: string) => void;
}

export default function LocationModal({
    isOpen,
    onClose,
    currentLocation,
    onSelectLocation,
}: LocationModalProps) {
    const [manualZip, setManualZip] = useState('');
    const [manualCity, setManualCity] = useState('');
    const [detecting, setDetecting] = useState(false);
    const [selectedId, setSelectedId] = useState('addr-1');

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            () => {
                const detectedLoc = 'Lilongwe, 20100';
                onSelectLocation(detectedLoc);
                setDetecting(false);
                onClose();
            },
            () => {
                alert('Could not retrieve location. Please enter manually.');
                setDetecting(false);
            }
        );
    };

    const handleApplyManual = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCity.trim() && !manualZip.trim()) return;
        const loc = `${manualCity.trim() || 'Custom'}, ${manualZip.trim() || '00000'}`;
        onSelectLocation(loc);
        onClose();
    };

    const handleSelectAddress = (addr: Address) => {
        setSelectedId(addr.id);
        onSelectLocation(`${addr.city}, ${addr.postalCode}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-card text-foreground border border-border rounded-2xl shadow-xl p-6">
                <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-3 mb-3">
                    <div>
                        <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Choose Delivery Location
                        </DialogTitle>
                        <DialogDescription className="text-xs text-body-text mt-1">
                            Delivery options and item availability depend on your location.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Device Location Auto Detect */}
                    <button
                        onClick={handleDetectLocation}
                        disabled={detecting}
                        className="w-full flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/20 text-primary border border-primary/30 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                        <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
                        {detecting ? 'Detecting location...' : 'Use current location'}
                    </button>

                    {/* Saved Addresses Section */}
                    <div>
                        <span className="text-xs font-bold text-body-text uppercase tracking-wider block mb-2">
                            Saved Addresses
                        </span>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {defaultAddresses.map((addr) => {
                                const isSelected = selectedId === addr.id;
                                return (
                                    <div
                                        key={addr.id}
                                        onClick={() => handleSelectAddress(addr)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                            isSelected
                                                ? 'bg-primary/5 border-primary shadow-2xs'
                                                : 'bg-section-bg border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <Building className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-foreground">
                                                        {addr.label}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <span className="text-[9px] bg-secondary text-white px-1.5 py-0.2 rounded font-semibold">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-body-text mt-0.5 leading-snug">
                                                    {addr.addressLine}
                                                </p>
                                            </div>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Manual Entry */}
                    <div className="pt-3 border-t border-border">
                        <span className="text-xs font-bold text-body-text uppercase tracking-wider block mb-2">
                            Or Enter City / Postal Code
                        </span>
                        <form onSubmit={handleApplyManual} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="City"
                                value={manualCity}
                                onChange={(e) => setManualCity(e.target.value)}
                                className="flex-1 bg-section-bg border border-border text-foreground placeholder:text-muted-text rounded-xl px-3 py-2 text-xs focus:border-primary outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Postal Code"
                                value={manualZip}
                                onChange={(e) => setManualZip(e.target.value)}
                                className="w-28 bg-section-bg border border-border text-foreground placeholder:text-muted-text rounded-xl px-3 py-2 text-xs focus:border-primary outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                                Apply
                            </button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
