// src/ui/SearchBar.tsx
import { Search } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    containerClassName?: string;
    inputClassName?: string;
    iconClassName?: string;
}

export default function SearchBar({
    placeholder = "Search...",
    containerClassName = "relative w-full",
    inputClassName = "w-full bg-white border border-[#3d3d3d] focus:border-orange-500 rounded-lg py-2.5 pl-12 pr-4 text-sm text-black outline-none transition-all placeholder:text-gray-500",
    iconClassName = "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 w-5 h-5",
}: SearchBarProps) {
    return (
        <div className={containerClassName}>
            <input
                type="text"
                placeholder={placeholder}
                className={inputClassName}
            />
            <Search className={iconClassName} />
        </div>
    );
}
