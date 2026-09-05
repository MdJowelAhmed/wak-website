import Newsletter from '@/ui/Newsletter';
import Link from 'next/link';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter
} from 'react-icons/fa';

const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
];

const legalLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Services', href: '/terms-of-services' },
];

const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
    return (
        <footer className="bg-dark-brown text-white mt-16 rounded-t-3xl border-t border-secondary/30 shadow-2xl">
            <div className="container mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
                    {/* Logo & Description */}
                    <div className="lg:col-span-4">
                        <p className="max-w-xs leading-relaxed text-zinc-300 text-sm mb-8">
                            Follow us on social media for exclusive discounts, flash deals, and the latest product drops.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover border border-primary text-white transition-all shadow-sm hover:scale-105"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-bold mb-6 text-lg">Navigation</h3>
                        <ul className="space-y-3.5 text-sm">
                            {navigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-zinc-300 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-bold mb-6 text-lg">Legal</h3>
                        <ul className="space-y-3.5 text-sm">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-zinc-300 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-4">
                        <h3 className="text-white font-bold mb-6 text-lg">Contact Information</h3>
                        <ul className="space-y-3.5 text-sm text-zinc-300">
                            <li className="flex items-start gap-3">
                                <span className="font-semibold text-white">Phone:</span>
                                <span>+8801611112222</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-semibold text-white">Email:</span>
                                <span>support@gmail.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-semibold text-white">Address:</span>
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}