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
                    <p className="text-royal-red font-bold tracking-widest uppercase text-sm">SR Gifts - Your Premier Gifting Destination</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-serif font-bold text-gray-900">A Trusted Offline Store Since 2021</h2>
                        <p className="text-gray-600 leading-relaxed font-light">
                            Welcome to SR Gifts, Bhongaon's favorite destination for exquisite artificial gifts and premium treasures. Our journey began in 2021 with a simple mission: to bring joy and elegance to every celebration through a curated selection of thoughtful gifts.
                        </p>
                        <p className="text-gray-600 leading-relaxed font-light">
                            As a dedicated offline shop, we pride ourselves on providing a personal touch, ensuring that every customer finds the perfect gift for their loved ones. From home decor to festive specials, we help you make every moment memorable.
                        </p>

                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 bg-royal-red/5 rounded-2xl flex items-center justify-center text-royal-red mx-auto">
                                    <Heart size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pure Love</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 bg-royal-gold/5 rounded-2xl flex items-center justify-center text-royal-gold mx-auto">
                                    <Star size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Premium Quality</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 bg-royal-black/5 rounded-2xl flex items-center justify-center text-gray-900 mx-auto">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted Store</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-3xl md:rounded-[3rem] overflow-hidden aspect-square shadow-premium"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=1000&auto=format&fit=crop"
                            alt="Our Workshop"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-black/50 to-transparent flex flex-col justify-end p-12">
                            <p className="text-white font-serif text-2xl font-bold italic">"Gifting is an art, and we are the artists."</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
