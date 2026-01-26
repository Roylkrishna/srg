import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Star } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />
            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 md:mb-16 space-y-4"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900">About Us</h1>
                    <p className="text-royal-red font-bold tracking-widest uppercase text-sm">SR Gifts - Your Gifting Destination</p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6 text-center"
                    >
                        <h2 className="text-3xl font-serif font-bold text-gray-900">A Trusted Offline Store Since 2021</h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            Welcome to SR Gifts, Bhongaon's favorite destination for exquisite artificial gifts and handpicked treasures. Our journey began in 2021 with a simple mission: to bring joy and elegance to every celebration through a curated selection of thoughtful gifts.
                        </p>
                        <p className="text-gray-600 leading-relaxed font-light">
                            As a dedicated offline shop, we pride ourselves on providing a personal touch, ensuring that every customer finds the perfect gift for their loved ones. From home decor to festive specials, we help you make every moment memorable.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-royal-red mx-auto transform rotate-3">
                                    <Heart size={28} />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-900 pt-2">Pure Love</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-royal-gold mx-auto -rotate-3">
                                    <Star size={28} />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-900 pt-2">Exquisite Quality</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-gray-900 mx-auto transform rotate-3">
                                    <ShieldCheck size={28} />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-900 pt-2">Trusted Store</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
