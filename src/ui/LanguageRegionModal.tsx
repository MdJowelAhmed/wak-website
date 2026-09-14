'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/use-currency';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
    countriesList,
    languagesList,
    type CountryOption,
    type LanguageOption,
} from '../../helpers/regions';

export type { CountryOption, LanguageOption };
export { countriesList, languagesList };

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
    currentCountry: _currentCountry,
    onSelectLanguage,
    onSelectCountry,
}: LanguageRegionDropdownProps) {
    const [selectedLang, setSelectedLang] = useState(currentLang);
    const [isChangingCurrency, setIsChangingCurrency] = useState(false);
    const [currencyQuery, setCurrencyQuery] = useState("");
    const [languageQuery, setLanguageQuery] = useState("");
    const popoverRef = useRef<HTMLDivElement>(null);
    const { rateLabel, currency, country, availableCurrencies, setCurrencyCode } = useCurrency();
    const t = useTranslations("LanguageSwitcher");
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setSelectedLang(currentLang);
    }, [currentLang]);

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

    const activeCountryObj = country;

    const handleSelectLang = (code: string) => {
        setSelectedLang(code);
        onSelectLanguage(code);
        if (typeof window !== "undefined") {
            localStorage.setItem("user_language", code);
        }
        router.replace(pathname, { locale: code });
        onClose();
    };

    const handleSelectCurrency = (nextCurrency: string, countryCode: string) => {
        setCurrencyCode(nextCurrency);
        onSelectCountry(countryCode);
        setIsChangingCurrency(false);
        setCurrencyQuery("");
    };

    const filteredLanguages = languagesList.filter((lang) => {
        const query = languageQuery.trim().toLowerCase();
        if (!query) return true;
        return (
            lang.name.toLowerCase().includes(query) ||
            lang.nativeName.toLowerCase().includes(query) ||
            lang.code.toLowerCase().includes(query)
        );
    });

    const filteredCurrencies = availableCurrencies.filter((item) => {
        const query = currencyQuery.trim().toLowerCase();
        if (!query) return true;
        return (
            item.currency.toLowerCase().includes(query) ||
            item.name.toLowerCase().includes(query) ||
            item.symbol.toLowerCase().includes(query)
        );
    });

    return (
        <div
            ref={popoverRef}
            className="absolute end-0 top-full mt-2.5 w-72 sm:w-80 rounded-2xl border border-card-border bg-card p-4 text-card-foreground shadow-2xl sm:p-5 z-[300] animate-in fade-in zoom-in-95 duration-150"
            role="menu"
            aria-label={t("changeLanguage")}
        >
            <div className="absolute -top-1.5 end-6 w-3 h-3 bg-card border-t border-s border-border rotate-45 z-10" />

            <div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("changeLanguage")}
                </span>
                <input
                    type="search"
                    value={languageQuery}
                    onChange={(event) => setLanguageQuery(event.target.value)}
                    placeholder={t("searchLanguage")}
                    className="mb-1.5 w-full rounded-lg border border-border bg-section-bg px-2.5 py-1.5 text-xs text-card-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />

                <div className="max-h-64 space-y-1 overflow-y-auto">
                    {filteredLanguages.length === 0 ? (
                        <p className="px-2 py-2 text-[11px] text-muted-foreground">{t("noLanguage")}</p>
                    ) : null}
                    {filteredLanguages.map((lang) => {
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
                                    {lang.nativeName} — {lang.name}
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
                    {t("changeCurrency")}
                </span>

                <div className="flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-section-bg/60">
                    <span className="text-xs font-semibold text-card-foreground">
                        {activeCountryObj.symbol} - {currency} - {activeCountryObj.name}
                        <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
                            {rateLabel}
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsChangingCurrency(!isChangingCurrency)}
                        className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer ml-2 shrink-0"
                    >
                        {isChangingCurrency ? t("done") : t("change")}
                    </button>
                </div>

                {/* Inline Currency / Country Picker when "Change" is clicked */}
                {isChangingCurrency && (
                    <div className="mt-2 rounded-xl border border-border bg-section-bg p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        <input
                            type="search"
                            value={currencyQuery}
                            onChange={(event) => setCurrencyQuery(event.target.value)}
                            placeholder={t("searchCurrency")}
                            className="mb-1.5 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-card-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                        />
                        <div className="max-h-56 space-y-1 overflow-y-auto">
                            {filteredCurrencies.length === 0 ? (
                                <p className="px-2 py-2 text-[11px] text-muted-foreground">{t("noCurrency")}</p>
                            ) : (
                                filteredCurrencies.map((item) => {
                                    const isSelected = currency === item.currency;
                                    return (
                                        <div
                                            key={item.currency}
                                            onClick={() => handleSelectCurrency(item.currency, item.code)}
                                            className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors ${
                                                isSelected
                                                    ? 'bg-primary/10 font-bold text-primary'
                                                    : 'text-card-foreground hover:bg-card'
                                            }`}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <span>{item.flag}</span>
                                                <span>{item.name}</span>
                                            </span>
                                            <span className="text-[11px] text-body-text">
                                                {item.symbol} ({item.currency})
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
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
                        {t("shoppingOn")}{" "}
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
                        {t("changeCountry")}
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export { LanguageRegionModal as LanguageRegionDropdown };

