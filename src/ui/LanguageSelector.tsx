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
    className = "flex items-center gap-3 bg-[#4f2c1d] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#4f2c1d]/90 transition-colors border border-white/20 text-white shrink-0",
    iconClassName,
}: LanguageSelectorProps) {
    return (
        <Select defaultValue="United States">
            <SelectTrigger className={`border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 ${className}`}>
                <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="bg-[#4f2c1d] border border-white/20 text-white z-[100] max-h-60 shadow-2xl">
                {countries.map((country) => (
                    <SelectItem 
                        key={country} 
                        value={country} 
                        className="focus:bg-white/20 focus:text-white cursor-pointer py-2 px-3 hover:bg-white/10"
                    >
                        {country}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
