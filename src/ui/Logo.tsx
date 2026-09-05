import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="inline-flex flex-col items-start shrink-0 cursor-pointer group"
        >
            <div className="flex items-center gap-1.5">
                <span className="bg-primary text-white font-extrabold px-2.5 py-0.5 rounded-lg text-base sm:text-lg tracking-wider shadow-xs group-hover:bg-primary-hover transition-colors">
                    WAK
                </span>
                <span className="text-foreground font-extrabold text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">
                    WorthWorld
                </span>
            </div>
            <span className="hidden sm:block text-[9px] font-semibold text-body-text tracking-widest uppercase mt-0.5">
                Shop. Book. Deliver. Worldwide.
            </span>
        </Link>
    );
}
