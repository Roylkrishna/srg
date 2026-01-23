import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';

const Contact = () => {
    const { info: contact } = useSelector((state) => state.contact);
    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />
            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 md:mb-24 space-y-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900">Get in Touch</h1>
                    <p className="text-royal-red font-bold tracking-widest uppercase text-sm">We'd Love to Hear From You</p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8 text-center md:text-left"
                        >
                            <h2 className="text-3xl font-serif font-bold text-gray-900 leading-tight">Visit Our Store or Reach Out Directly</h2>
                            <p className="text-gray-500 font-light leading-relaxed">
                                Whether you're looking for the perfect gift in person at our Bhongaon store or have a quick query, we're here to help. Our team is dedicated to making every celebration special.
                            </p>

                            <div className="pt-4 hidden md:block">
                                <div className="inline-block p-6 glass-card rounded-[2rem] border border-white/50 shadow-premium">
                                    <p className="text-royal-red font-black uppercase text-[10px] tracking-[0.3em] mb-2">Offline Shop</p>
                                    <p className="text-gray-900 font-bold font-serif text-xl">SR Gifts Bhongaon</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-white/50 space-y-10"
                        >
                            <ContactItem
                                icon={<Phone size={24} />}
                                title="Call Us"
                                info={contact?.phone || "[Phone]"}
                            />
                            <ContactItem
                                icon={<Mail size={24} />}
                                title="Email Us"
                                info={contact?.email || "hello@shreeramagifts.com"}
                            />
                            <ContactItem
                                icon={<MapPin size={24} />}
                                title="Visit Us"
                                info={contact?.address || "SR Gifts, Bhongaon"}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, info }) => (
    <div className="flex gap-6 items-center text-left">
        <div className="h-14 w-14 bg-white rounded-2xl shadow-premium border border-gray-50 flex items-center justify-center text-royal-red flex-shrink-0 transition-transform hover:scale-110">
            {icon}
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
            <p className="text-gray-900 font-bold text-lg md:text-xl break-words">{info}</p>
        </div>
    </div>
);

export default Contact;
