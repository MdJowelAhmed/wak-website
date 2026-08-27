// src/ui/LanguageSelector.tsx
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Bangladesh",
  "Brazil",
  "UAE",
];

interface LanguageSelectorProps {
    className?: string;
    iconClassName?: string;
}

export default function LanguageSelector({
    className = "flex items-center gap-3 bg-primary px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors border border-primary shrink-0",
    iconClassName,
}: LanguageSelectorProps) {
    return (
        <Select defaultValue="United States">
            <SelectTrigger className={`border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 ${className}`}>
                <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="bg-primary border-white text-white z-100 max-h-60">
                {countries.map((country) => (
                    <SelectItem key={country} value={country} className="focus:bg-white focus:text-black cursor-pointer">
                        {country}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
