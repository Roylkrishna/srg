import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />
            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900">Get in Touch</h1>
                    <p className="text-royal-red font-bold tracking-widest uppercase text-sm">We'd Love to Hear From You</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif font-bold text-gray-900">Connect With Our Team</h2>
                            <p className="text-gray-500 font-light leading-relaxed max-w-md">
                                Whether you have a question about our collections, customized gifting, or just want to say Namaste, we're here for you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <ContactItem
                                icon={<Phone size={20} />}
                                title="Call Us"
                                info="[Address]"
                            />
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-10 rounded-[2.5rem] shadow-premium border border-white/50"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormInput label="First Name" placeholder="John" />
                                <FormInput label="Last Name" placeholder="Doe" />
                            </div>
                            <FormInput label="Email Address" placeholder="john@example.com" type="email" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                                <textarea
                                    className="w-full bg-white/50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-royal-red/20 min-h-[150px] transition-all"
                                    placeholder="Tell us how we can help..."
                                ></textarea>
                            </div>
                            <button className="w-full bg-royal-red text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-red-200 hover:bg-royal-black transition-all group">
                                Send Message
                                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ContactItem = ({ icon, title, info }) => (
    <div className="flex gap-5 items-start">
        <div className="h-12 w-12 bg-white rounded-2xl shadow-premium border border-gray-50 flex items-center justify-center text-royal-red flex-shrink-0">
            {icon}
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
            <p className="text-gray-900 font-bold">{info}</p>
        </div>
    </div>
);

const FormInput = ({ label, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">{label}</label>
        <input
            type={type}
            className="w-full bg-white/50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-royal-red/20 transition-all font-medium text-gray-900"
            placeholder={placeholder}
        />
    </div>
);

export default Contact;
