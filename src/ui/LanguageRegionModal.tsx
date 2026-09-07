'use client';

import { useState, useEffect } from 'react';
import { Globe, Check, ChevronRight, Flag } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/ui/dialog';

export interface LanguageOption {
    code: string;
    name: string;
    nativeName: string;
}

export interface CountryOption {
    code: string;
    name: string;
    flag: string;
    currency: string;
    symbol: string;
}

export const languagesList: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ny', name: 'Chichewa', nativeName: 'Chinyanja' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

export const countriesList: CountryOption[] = [
    { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: 'MWK', symbol: 'MK' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', symbol: 'TSh' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', symbol: 'R' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
];

interface LanguageRegionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLang: string;
    currentCountry: string;
    onSelectLanguage: (langCode: string) => void;
    onSelectCountry: (countryCode: string) => void;
}

export default function LanguageRegionModal({
    isOpen,
    onClose,
    currentLang,
    currentCountry,
    onSelectLanguage,
    onSelectCountry,
}: LanguageRegionModalProps) {
    const [selectedLang, setSelectedLang] = useState(currentLang);
    const [selectedCountry, setSelectedCountry] = useState(currentCountry);
    const [showAllLangs, setShowAllLangs] = useState(false);
    const [showAllCountries, setShowAllCountries] = useState(false);

    useEffect(() => {
        setSelectedLang(currentLang);
        setSelectedCountry(currentCountry);
    }, [currentLang, currentCountry]);

    const activeCountryObj = countriesList.find((c) => c.code === selectedCountry) || countriesList[0];

    const handleSave = () => {
        onSelectLanguage(selectedLang);
        onSelectCountry(selectedCountry);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_language', selectedLang);
            localStorage.setItem('user_country', selectedCountry);
            document.cookie = `user_language=${selectedLang}; path=/; max-age=31536000`;
            document.cookie = `user_country=${selectedCountry}; path=/; max-age=31536000`;
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-card text-foreground border border-border rounded-2xl shadow-xl p-6">
                <DialogHeader className="border-b border-border pb-3 mb-4">
                    <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Language & Marketplace Region
                    </DialogTitle>
                    <DialogDescription className="text-xs text-body-text mt-0.5">
                        Select your preferred display language and regional marketplace.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                    {/* Country / Region Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-body-text uppercase tracking-wider">
                                You are shopping in:
                            </span>
                            <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                {activeCountryObj.flag} {activeCountryObj.name} ({activeCountryObj.currency})
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {countriesList.map((country) => {
                                const isSelected = selectedCountry === country.code;
                                return (
                                    <div
                                        key={country.code}
                                        onClick={() => setSelectedCountry(country.code)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-primary/5 border-primary shadow-2xs'
                                                : 'bg-section-bg border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{country.flag}</span>
                                            <div>
                                                <span className="text-xs font-bold text-foreground block leading-none">
                                                    {country.name}
                                                </span>
                                                <span className="text-[10px] text-body-text mt-0.5 block">
                                                    {country.currency} ({country.symbol})
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setShowAllCountries(!showAllCountries)}
                            className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                            See all countries/regions
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="pt-4 border-t border-border">
                        <span className="text-xs font-bold text-body-text uppercase tracking-wider block mb-2">
                            Change Language
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                            {languagesList.map((lang) => {
                                const isSelected = selectedLang === lang.code;
                                return (
                                    <div
                                        key={lang.code}
                                        onClick={() => setSelectedLang(lang.code)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                            isSelected
                                                ? 'bg-primary/5 border-primary shadow-2xs'
                                                : 'bg-section-bg border-border hover:border-primary/50'
                                        }`}
                                    >
                                        <div>
                                            <span className="text-xs font-bold text-foreground block leading-none">
                                                {lang.name}
                                            </span>
                                            <span className="text-[10px] text-body-text mt-0.5 block">
                                                {lang.nativeName}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setShowAllLangs(!showAllLangs)}
                            className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                            See all languages
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-section-bg text-xs font-semibold transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                        Save Preferences
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
