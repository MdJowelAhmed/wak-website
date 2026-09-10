'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

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

interface LanguageRegionDropdownProps {
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
}: LanguageRegionDropdownProps) {
    const [selectedLang, setSelectedLang] = useState(currentLang);
    const [selectedCountry, setSelectedCountry] = useState(currentCountry);
    const [isChangingCurrency, setIsChangingCurrency] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedLang(currentLang);
        setSelectedCountry(currentCountry);
    }, [currentLang, currentCountry]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const activeCountryObj = countriesList.find((c) => c.code === selectedCountry) || countriesList[0];

    const handleSelectLang = (code: string) => {
        setSelectedLang(code);
        onSelectLanguage(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_language', code);
            document.cookie = `user_language=${code}; path=/; max-age=31536000`;
        }
    };

    const handleSelectCountry = (code: string) => {
        setSelectedCountry(code);
        onSelectCountry(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_country', code);
            document.cookie = `user_country=${code}; path=/; max-age=31536000`;
        }
        setIsChangingCurrency(false);
    };

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 top-full mt-2.5 w-64 sm:w-72 rounded-2xl border border-card-border bg-card p-4 text-card-foreground shadow-2xl sm:p-5 z-[300] animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-label="Language and Currency Settings"
        >
            {/* Caret Pointer pointing up */}
            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-card border-t border-l border-border rotate-45 z-10" />

            {/* 1. Language Section */}
            <div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Change language
                </span>

                <div className="space-y-1">
                    {languagesList.map((lang) => {
                        const isSelected = selectedLang === lang.code;
                        return (
                            <label
                                key={lang.code}
                                onClick={() => handleSelectLang(lang.code)}
                                className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-section-bg cursor-pointer transition-colors group select-none"
                            >
                                {/* Radio Button (Amazon Style) */}
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected
                                            ? 'border-primary'
                                            : 'border-border group-hover:border-primary/60'
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>

                                <span
                                    className={`text-xs ${
                                        isSelected
                                            ? 'font-bold text-card-foreground'
                                            : 'font-medium text-body-text group-hover:text-card-foreground'
                                    }`}
                                >
                                    {lang.name} - {lang.code.toUpperCase()}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* 2. Currency Section */}
            <div>
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Change currency
                </span>

                <div className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-section-bg/60">
                    <span className="text-xs font-semibold text-card-foreground">
                        {activeCountryObj.symbol} - {activeCountryObj.currency} - {activeCountryObj.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsChangingCurrency(!isChangingCurrency)}
                        className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer ml-2 shrink-0"
                    >
                        {isChangingCurrency ? 'Done' : 'Change'}
                    </button>
                </div>

                {/* Inline Currency / Country Picker when "Change" is clicked */}
                {isChangingCurrency && (
                    <div className="mt-2 p-1.5 rounded-xl bg-section-bg border border-border space-y-1 max-h-36 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                        {countriesList.map((c) => {
                            const isSelected = selectedCountry === c.code;
                            return (
                                <div
                                    key={c.code}
                                    onClick={() => handleSelectCountry(c.code)}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                                        isSelected
                                            ? 'bg-primary/10 font-bold text-primary'
                                            : 'text-card-foreground hover:bg-card'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span>{c.flag}</span>
                                        <span>{c.name}</span>
                                    </span>
                                    <span className="text-body-text text-[11px]">
                                        {c.symbol} ({c.currency})
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* 3. Shopping Region & Country Link */}
            <div>
                <div className="flex items-center gap-2 px-2 text-xs text-body-text">
                    <span className="text-base">{activeCountryObj.flag}</span>
                    <span className="leading-snug">
                        You are shopping on{" "}
                        <strong className="font-semibold text-card-foreground">
                            WAK {activeCountryObj.name}
                        </strong>
                    </span>
                </div>

                <div className="mt-2.5 text-center">
                    <button
                        type="button"
                        onClick={() => setIsChangingCurrency(!isChangingCurrency)}
                        className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                        Change country/region.
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export { LanguageRegionModal as LanguageRegionDropdown };

