import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Hero = ({ banners = [] }) => {
    const { stats } = useSelector((state) => state.stats);
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

    const currentBanner = banners[currentIndex];

    if (!currentBanner) return null;
    return (
        <div className="relative bg-white pt-28 overflow-hidden">
            {/* Full Width Banner Slider */}
            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] lg:h-[75vh] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`banner-${currentIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title || "Banner"}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 z-20 pointer-events-none">
                        <button onClick={prevBanner} className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-royal-red hover:text-white transition-all pointer-events-auto border border-white/20">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextBanner} className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-royal-red hover:text-white transition-all pointer-events-auto border border-white/20">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}

                {/* Pagination Dots */}
                {banners.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 transition-all rounded-full ${currentIndex === idx ? 'w-10 bg-royal-red shadow-lg shadow-red-500/50' : 'w-2 bg-white/50 backdrop-blur-sm'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Below Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                {/* Background Decor */}
                <div className="absolute top-10 right-0 w-64 h-64 bg-royal-gold/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-10 left-0 w-48 h-48 bg-royal-red/5 rounded-full blur-3xl -z-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-red/5 text-royal-red font-bold text-xs rounded-full tracking-widest uppercase border border-royal-red/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-red opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-royal-red"></span>
                                </span>
                                Handcrafted Treasures
                            </div>

                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.1]">
                                {currentBanner.title || "Elevate Your Gifting"}
                            </h1>

                            <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-light">
                                {currentBanner.description || "Discover the art of premium gifting."}
                            </p>
                        </motion.div>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <button className="px-10 py-5 bg-royal-red text-white rounded-full font-bold text-lg hover:bg-royal-black transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3 group">
                                Shop Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <button className="px-10 py-5 glass-card text-gray-900 border border-gray-200/50 rounded-full font-bold text-lg hover:bg-white transition-all">
                                Our Story
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:gap-12">
                        <div className="p-8 bg-gift-cream rounded-3xl border border-royal-gold/10 space-y-2 group hover:bg-white hover:shadow-xl transition-all duration-500">
                            <p className="text-5xl font-serif font-black text-gray-900 group-hover:text-royal-red transition-colors">{stats.patrons || 0}+</p>
                            <p className="text-sm uppercase tracking-widest font-bold text-gray-400">Happy Patrons</p>
                            <p className="text-xs text-gray-500 leading-relaxed pt-2">Spreading joy across the country through our exclusive collections.</p>
                        </div>
                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2 group hover:shadow-xl transition-all duration-500">
                            <p className="text-5xl font-serif font-black text-royal-red">{stats.curations || 0}+</p>
                            <p className="text-sm uppercase tracking-widest font-bold text-gray-400">Unique Curations</p>
                            <p className="text-xs text-gray-500 leading-relaxed pt-2">Every piece is hand-selected and verified for royal quality.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
