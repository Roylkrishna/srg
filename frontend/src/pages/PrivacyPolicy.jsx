import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Mail, MapPin, Activity, User, Lock, Database } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContact } from '../redux/slices/contactSlice';

const PrivacyPolicy = () => {
    const dispatch = useDispatch();
    const { info: contactInfo } = useSelector((state) => state.contact);

    useEffect(() => {
        if (!contactInfo) {
            dispatch(fetchContact());
        }
    }, [dispatch, contactInfo]);

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
                    <p className="text-gray-500 mt-2">Effective Date: January 28, 2026</p>
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
                            Shree Rama Gift Center (SRG) is primarily an informational showcase of our artificial gift collections available at our offline store in Bhongaon. While we offer user accounts for personalized experiences, this website does not currently process online financial transactions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Information We Collect</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <User size={16} className="text-purple-500" /> Account Information
                                </h3>
                                <p className="text-sm">
                                    When you register an account, we collect your <strong>Name, Email Address, Username, and Mobile Number</strong>. If you provide it, we also store your <strong>Billing/Shipping Address</strong> and <strong>Profile Picture</strong> to personalize your experience and facilitate offline orders.
                                </p>
                            </div>

                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Activity size={16} className="text-blue-500" /> Usage Data & Analytics
                                </h3>
                                <p className="text-sm">
                                    To improve our website's performance and understand user preferences, we collect non-personal information such as your <strong>IP address</strong>, browser type, and interaction history (e.g., products viewed, search terms used).
                                </p>
                            </div>

                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Database size={16} className="text-orange-500" /> Cookies & Local Storage
                                </h3>
                                <p className="text-sm">
                                    We use <strong>Local Storage</strong> and <strong>Cookies</strong> to keep you logged into your account and remember your preferences (like your wishlist). These are strictly necessary for the core functionality of the website.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Data Security</h2>
                        <div className="flex items-start gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-100/50">
                            <Lock size={20} className="text-royal-red mt-1" />
                            <p className="text-sm">
                                Your password is <strong>encrypted (hashed)</strong> before being stored in our database. We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">How We Use Your Data</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>To manage your account and provide personalized features like your wishlist.</li>
                            <li>To analyze website traffic and popularity of specific gift categories.</li>
                            <li>To facilitate communication regarding products you are interested in.</li>
                            <li>To ensure the security and integrity of our platform.</li>
                        </ul>
                        <p className="border-l-4 border-royal-red pl-4 italic text-sm mt-4 text-gray-500">
                            We value your trust. We do not sell, trade, or transfer your personally identifiable information to outside parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Your Rights (DPDP Act, 2023)</h2>
                        <p className="text-sm">Under the <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong>, you have specific rights regarding your personal data:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>Right to Access:</strong> You can see the information we have about you in your Dashboard.</li>
                            <li><strong>Right to Correction:</strong> You can update your profile information at any time.</li>
                            <li><strong>Right to Erasure:</strong> You can request the deletion of your account and associated personal data.</li>
                            <li><strong>Right to Withdraw Consent:</strong> You may stop using our services and withdraw your consent at any time.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Data Retention</h2>
                        <p className="text-sm">
                            We retain your personal information only as long as your account is active or as needed to provide you with services. If you choose to delete your account, we will purge your data from our active databases within a reasonable timeframe, unless required for legal audit purposes.
                        </p>
                    </section>

                    <section className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Mail size={20} className="text-royal-red" />
                            <h2 className="text-xl font-bold font-serif">Grievance Redressal</h2>
                        </div>
                        <p className="text-sm">
                            In accordance with Indian Information Technology and DPDP rules, if you have any complaints or concerns regarding your privacy or data usage, please contact our <strong>Grievance Officer</strong>:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2">
                            <p className="font-bold text-gray-900">Grievance Officer: Store Manager</p>
                            <p className="text-sm text-gray-600">Email: {contactInfo?.email || 'hello@shreeramagifts.com'}</p>
                            <p className="text-sm text-gray-600">Address: Shree Rama Gift Center, {contactInfo?.address || 'Main Market, Bhongaon, Mainpuri, UP'}</p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
