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
        <div className="relative bg-white pt-20 md:pt-28 overflow-hidden">
            {/* Full Width Banner Slider */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.5/1] lg:h-[75vh] h-auto overflow-hidden">
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
                        <button onClick={prevBanner} className="p-3 md:p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-royal-red hover:text-white transition-all pointer-events-auto border border-white/20 active:scale-90">
                            <ChevronLeft size={24} className="md:w-6 md:h-6" />
                        </button>
                        <button onClick={nextBanner} className="p-3 md:p-3 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-royal-red hover:text-white transition-all pointer-events-auto border border-white/20 active:scale-90">
                            <ChevronRight size={24} className="md:w-6 md:h-6" />
                        </button>
                    </div>
                )}

                {/* Pagination Dots */}
                {banners.length > 1 && (
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 md:h-2 transition-all rounded-full ${currentIndex === idx ? 'w-8 md:w-10 bg-royal-red shadow-lg shadow-red-500/50' : 'w-1.5 md:w-2 bg-white/50 backdrop-blur-sm'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Hero;
