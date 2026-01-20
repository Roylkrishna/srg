import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, ShieldCheck, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';

const Footer = () => {
    const { categories } = useSelector((state) => state.categories);
    const { info: contact } = useSelector((state) => state.contact);

    return (
        <footer className="bg-white pt-12 md:pt-24 pb-8 md:pb-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-12 md:mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="SRG" className="h-10 w-auto object-contain" />
                            <span className="font-serif text-2xl font-bold text-gray-900">
                                Shree Rama<span className="text-royal-red">.</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 font-light leading-relaxed">
                            Curating handcrafted treasures and premium gifting experiences inspired by India's rich heritage. Elevate every celebration with royal elegance.
                        </p>
                        <div className="flex gap-4">
                            {contact?.instagram && <SocialIcon href={contact.instagram} icon={<Instagram size={18} />} />}
                            {contact?.facebook && <SocialIcon href={contact.facebook} icon={<Facebook size={18} />} />}
                            {contact?.youtube && <SocialIcon href={contact.youtube} icon={<Twitter size={18} />} />}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-b border-royal-red/10 pb-4 inline-block">Explore</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/" text="Home" />

                            <FooterLink to="/aboutus" text="Our Story" />
                            <FooterLink to="/contact" text="Contact Us" />
                        </ul>
                    </div>



                    {/* Contact Section */}
                    <div className="space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 border-b border-royal-red/10 pb-4 inline-block">Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start group">
                                <div className="p-2.5 bg-royal-red/5 rounded-xl text-royal-red group-hover:bg-royal-red group-hover:text-white transition-all">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm text-gray-600 font-medium">{contact?.phone || '[Phone Number]'}</span>
                            </li>
                            <li className="flex gap-4 items-start group">
                                <div className="p-2.5 bg-royal-red/5 rounded-xl text-royal-red group-hover:bg-royal-red group-hover:text-white transition-all">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{contact?.email || 'hello@shreeramagifts.com'}</span>
                            </li>
                            <li className="flex gap-4 items-start group">
                                <div className="p-2.5 bg-royal-red/5 rounded-xl text-royal-red group-hover:bg-royal-red group-hover:text-white transition-all">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-sm text-gray-600 font-medium">{contact?.address || '[Address]'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 font-medium">
                        © 2026 Shree Rama Gifts Center. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Heart size={14} className="text-royal-red animate-pulse" />
                            Handcrafted with Love
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, text }) => (
    <li>
        <Link to={to} className="text-sm text-gray-500 hover:text-royal-red transition-colors font-medium relative group inline-flex items-center gap-2">
            <span className="h-1 w-1 bg-royal-red rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
            {text}
        </Link>
    </li>
);

const SocialIcon = ({ icon, href }) => (
    <a href={href || "#"} target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-royal-red hover:text-white transition-all shadow-sm">
        {icon}
    </a>
);

export default Footer;
