import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2 border border-primary rounded-md shrink-0 cursor-pointer"
        >
            <span className="text-white font-bold tracking-widest text-sm uppercase">LOGO</span>
        </Link>
    );
}
