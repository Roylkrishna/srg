import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />
            <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <ShieldCheck size={48} className="text-royal-red mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-500 mt-2">Effective Date: January 23, 2026</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-white/50 space-y-8 text-gray-700 leading-relaxed font-light"
                >
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Info size={20} className="text-royal-red" />
                            <h2 className="text-xl font-bold font-serif">Informational Nature</h2>
                        </div>
                        <p>
                            SR Gifts is an informational showcase of our artificial gift collections available at our offline store in Bhongaon. This website is <strong>not an e-commerce platform</strong> and does not process any online sales or financial transactions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Information Collection</h2>
                        <p>
                            We collect minimal information required for account features such as the <strong>Wishlist</strong>. This includes your name and email address when you register. We do not sell or share your personal data with third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Store Visit Focus</h2>
                        <p>
                            All product information, including prices and availability, is provided for your reference. For purchases, we invite you to visit our offline shop in Bhongaon or contact us directly.
                        </p>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Mail size={20} className="text-royal-red" />
                            <h2 className="text-xl font-bold font-serif">Contact Us</h2>
                        </div>
                        <p>If you have any questions regarding your data or our store, please reach out at:</p>
                        <p className="font-bold">hello@shreeramagifts.com</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
