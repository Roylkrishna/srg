import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Hero = ({ banners = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextBanner = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

    const currentBanner = banners[currentIndex] || {
        imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop",
        title: "Namaste, Elevate Your Gifting.",
        description: "Curated handcrafted treasures, divine idols, and premium delicacies designed to make every celebration truly royal.",
        badge: "Festive Collection 2026",
        offer: "50%",
        offerTitle: "Royal Winter Sale"
    };
    return (
        <div className="relative min-h-[90vh] md:min-h-screen flex items-center bg-gift-cream pt-20 overflow-hidden">

            {/* Background Decor Elements - Refined */}
            <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-royal-gold/10 rounded-full blur-[120px] -z-0"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-royal-red/5 rounded-full blur-[100px] -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12 md:py-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content Column */}
                    <div className="space-y-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`text-${currentIndex}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6 md:space-y-10"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-red/5 text-royal-red font-bold text-xs rounded-full tracking-widest uppercase border border-royal-red/10">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-red opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-royal-red"></span>
                                    </span>
                                    {currentBanner.badge || "Premium Collection"}
                                </div>

                                <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-gray-900 leading-[1.1]">
                                    {currentBanner.title?.split(',')[0]}
                                    {currentBanner.title?.includes(',') && <>, <br />
                                        <span className="text-royal-red italic font-medium">
                                            {currentBanner.title.split(',')[1].trim().split(' ')[0]}
                                        </span> {currentBanner.title.split(',')[1].trim().split(' ').slice(1).join(' ')}
                                    </>}
                                    {!currentBanner.title?.includes(',') && <br />}
                                    <span className="relative inline-block mt-2">
                                        {currentBanner.subtitle || ""}
                                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-royal-gold/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                                        </svg>
                                    </span>
                                </h1>

                                <p className="text-base md:text-xl text-gray-600 max-w-lg leading-relaxed font-light">
                                    {currentBanner.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-5"
                        >
                            <button className="px-10 py-5 bg-royal-red text-white rounded-full font-bold text-lg hover:bg-royal-black transition-all shadow-2xl shadow-red-200 flex items-center justify-center gap-3 group">
                                Shop Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="px-10 py-5 glass-card text-gray-900 border border-gray-200/50 rounded-full font-bold text-lg hover:bg-white transition-all">
                                Our Story
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex items-center gap-10 pt-10 border-t border-gray-200/50"
                        >
                            <div className="space-y-1">
                                <p className="text-3xl font-serif font-black text-gray-900">15K+</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Patrons</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-serif font-black text-gray-900">2K+</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Curations</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image Column */}
                    <motion.div
                        className="relative"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`image-${currentIndex}`}
                                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                                transition={{ duration: 0.8 }}
                                className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-premium aspect-[4/5] md:aspect-square lg:aspect-[4/5] group"
                            >
                                <img
                                    src={currentBanner.imageUrl}
                                    alt={currentBanner.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-royal-black/60 via-transparent to-transparent"></div>

                                {/* Floating Premium Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 glass-card p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-white/40"
                                >
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl gold-gradient flex items-center justify-center text-white font-black text-sm md:text-xl shadow-lg">
                                            {currentBanner.offer || "New"}
                                        </div>
                                        <div>
                                            <p className="font-serif font-bold text-base md:text-xl text-gray-900">{currentBanner.offerTitle || currentBanner.title}</p>
                                            <p className="text-[10px] md:text-xs font-bold text-royal-red uppercase tracking-widest">{currentBanner.badge || "Limited Edition"}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {banners.length > 1 && (
                            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-8 -right-4 md:-right-8 flex justify-between z-20 pointer-events-none">
                                <button onClick={prevBanner} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-900 hover:bg-royal-red hover:text-white transition-all pointer-events-auto">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextBanner} className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-900 hover:bg-royal-red hover:text-white transition-all pointer-events-auto">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        )}

                        {/* Pagination Dots */}
                        {banners.length > 1 && (
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {banners.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-1.5 transition-all rounded-full ${currentIndex === idx ? 'w-8 bg-royal-red' : 'w-2 bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Decorative Background for Image */}
                        <div className="absolute -top-6 -right-6 w-full h-full border border-royal-gold/20 rounded-[2.5rem] -z-10 animate-float"></div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-royal-gold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
