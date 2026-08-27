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
        <footer className=" text-white/90 mt-20">
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                    {/* Logo & Description */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex items-center justify-center w-32 h-14 border border-white rounded-lg mb-8">
                            <span className="text-white font-semibold tracking-wider text-xl">LOGO</span>
                        </Link>

                        <p className="max-w-xs leading-relaxed  text-sm mb-8">
                            E-commerce is the buying and selling of goods or services using the internet,
                            allowing 24/7 transactions, global reach, and increased efficiency.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary border border-primary text-white transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-semibold mb-8 text-lg">Navigation</h3>
                        <ul className="space-y-4 text-sm ">
                            {navigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-[#FFDDA5] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h3 className="text-white font-semibold mb-8 text-lg">Legal</h3>
                        <ul className="space-y-4 text-sm ">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-[#FFDDA5] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information / Newsletter */}
                    <div className="lg:col-span-4">
                        {/* <Newsletter /> */}
                        <h3 className="text-white font-semibold mb-8 text-lg">Contact Information</h3>
                        <ul className="space-y-4 text-sm text-zinc-300">
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

                {/* Bottom Bar */}
                {/* <div className="mt-10 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
                    © {new Date().getFullYear()} Your E-commerce Store. All rights reserved.
                </div> */}
            </div>
        </footer>
    );
}