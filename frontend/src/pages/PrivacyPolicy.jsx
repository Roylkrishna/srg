import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Mail, MapPin, Activity } from 'lucide-react';

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
                    <p className="text-gray-500 mt-2">Effective Date: January 25, 2026</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-premium border border-white/50 space-y-10 text-gray-700 leading-relaxed font-light"
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
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Information We Collect</h2>
                        <div className="space-y-4">
                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Activity size={16} className="text-blue-500" /> Usage Data & Analytics
                                </h3>
                                <p className="text-sm">
                                    To improve our website's performance and understand user preferences, we collect non-personal information such as your <strong>IP address</strong>, browser type, and interaction history (e.g., products viewed, search terms used). This helps us curate better collections in our store.
                                </p>
                            </div>

                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-green-500" /> Geolocation (Optional)
                                </h3>
                                <p className="text-sm">
                                    We may request access to your device's <strong>geolocation</strong> to understand our audience's regional distribution. This is strictly optional and requires your explicit permission via your browser settings. We do not track your location in the background.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">How We Use Your Data</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                            <li>To analyze website traffic and popularity of specific gift categories.</li>
                            <li>To enhance your browsing experience by remembering your preferences.</li>
                            <li>To ensure the security and integrity of our platform.</li>
                        </ul>
                        <p className="border-l-4 border-royal-red pl-4 italic text-sm mt-4 text-gray-500">
                            We value your trust. We do not sell, trade, or transfer your personally identifiable information to outside parties.
                        </p>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Mail size={20} className="text-royal-red" />
                            <h2 className="text-xl font-bold font-serif">Contact Us</h2>
                        </div>
                        <p>If you have any questions regarding your data or our store, please reach out at:</p>
                        <p className="font-bold text-gray-900">hello@shreeramagifts.com</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
