import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchProducts, clearSearchResults } from '../redux/slices/productSlice';
import { logAnalyticsEvent } from '../redux/slices/analyticsSlice';

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

    const dispatch = useDispatch();
    const { searchResults, searchLoading } = useSelector((state) => state.products);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                dispatch(searchProducts(searchQuery));
                dispatch(logAnalyticsEvent({
                    eventType: 'SEARCH',
                    metadata: { query: searchQuery }
                }));
            } else {
                dispatch(clearSearchResults());
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    const nextBanner = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

    const currentBanner = banners[currentIndex];

    if (!currentBanner) return null;
    return (
        <div className="relative bg-white pt-20 md:pt-28">
            {/* Full Width Banner Slider */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.5/1] lg:h-[75vh] h-auto group">
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
                        {/* Dark Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/20" />
                    </motion.div>
                </AnimatePresence>

                {/* Hero Content & Search Overlay */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full max-w-2xl text-center space-y-6 md:space-y-8"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg tracking-tight">
                            {currentBanner.title || "Find Your Perfect Treasure"}
                        </h1>

                        {/* Hero Search Bar */}
                        <div className="relative max-w-lg mx-auto w-full group">
                            <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-2xl transition-all focus-within:ring-4 focus-within:ring-white/30 focus-within:scale-[1.02]">
                                <Search className="absolute left-4 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for gifts, decor, and more..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-4 pl-12 pr-6 rounded-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500 font-medium"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchQuery.length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full mt-4 left-0 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden text-left"
                                    >
                                        <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                                            {searchLoading ? (
                                                <div className="p-8 flex justify-center text-royal-red">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map(p => (
                                                    <Link
                                                        key={p._id}
                                                        to={`/product/${p._id}`}
                                                        className="flex items-center gap-4 p-4 hover:bg-red-50 transition-colors group"
                                                    >
                                                        <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                            <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">{p.name}</h4>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{p.category?.name}</p>
                                                        </div>
                                                        <span className="font-black text-gray-900">₹{p.price}</span>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-gray-500 italic">
                                                    No treasures found matching "{searchQuery}"
                                                </div>
                                            )}
                                        </div>
                                        {searchResults.length > 0 && (
                                            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        document.getElementById('product-collection')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline"
                                                >
                                                    View All Results
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {currentBanner.description && (
                            <p className="text-white/90 text-sm md:text-lg font-medium drop-shadow-md hidden sm:block max-w-xl mx-auto">
                                {currentBanner.description}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 z-20 pointer-events-none">
                        <button onClick={prevBanner} className="p-3 md:p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-white hover:text-red-600 transition-all pointer-events-auto border border-white/20 active:scale-90">
                            <ChevronLeft size={24} className="md:w-6 md:h-6" />
                        </button>
                        <button onClick={nextBanner} className="p-3 md:p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg text-white hover:bg-white hover:text-red-600 transition-all pointer-events-auto border border-white/20 active:scale-90">
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
                                className={`h-1.5 md:h-2 transition-all rounded-full ${currentIndex === idx ? 'w-8 md:w-10 bg-white shadow-lg' : 'w-1.5 md:w-2 bg-white/40 backdrop-blur-sm'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Hero;
