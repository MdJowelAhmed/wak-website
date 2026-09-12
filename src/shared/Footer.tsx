import Link from "next/link";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "@/ui/Logo";
import Newsletter from "@/ui/Newsletter";
import FooterPayments from "@/ui/FooterPayments";

const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/worthworld", label: "Facebook" },
    { icon: FaInstagram, href: "https://www.instagram.com/worthworld", label: "Instagram" },
    { icon: FaXTwitter, href: "https://x.com/worthworld", label: "X" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/worth-world", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://www.youtube.com/@worthworld", label: "YouTube" },
];

const companyLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Shop", href: "/shop" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact-us" },
];

const customerServiceLinks = [
    { name: "Help Center", href: "/contact-us" },
    { name: "Track Order", href: "/profile/order-tracking" },
];

const legalLinks = [
    { name: "Terms & Conditions", href: "/terms-of-services" },
    { name: "Privacy Policy", href: "/privacy-policy" },
];

function FooterLinks({
    title,
    links,
}: {
    title: string;
    links: { name: string; href: string }[];
}) {
    return (
        <div>
            <h3 className="mb-5 text-base font-bold text-white">{title}</h3>
            <ul className="space-y-3 text-sm">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className="text-zinc-300 transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="mt-16 bg-secondary text-white">
            <div className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-3">
                        <Logo />
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-300">
                            WorthWorld is a marketplace to shop products, book services, and
                            get delivery worldwide — connecting Africa to the rest of the world.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary bg-primary text-white shadow-sm transition-all hover:scale-105 hover:bg-primary-hover"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <FooterLinks title="Company" links={companyLinks} />
                    </div>
                    <div className="lg:col-span-2">
                        <FooterLinks title="Customer Service" links={customerServiceLinks} />
                    </div>
                    <div className="lg:col-span-2">
                        <FooterLinks title="Legal" links={legalLinks} />
                    </div>
                    <div className="lg:col-span-3">
                        <Newsletter />
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="container mx-auto px-6 py-5">
                    <FooterPayments />
                </div>
            </div>
        </footer>
    );
}
