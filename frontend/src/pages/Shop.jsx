import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Sparkles, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchAllCategories } from '../redux/slices/categorySlice';
import { fetchStats } from '../redux/slices/statsSlice';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const { stats } = useSelector((state) => state.stats);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchAllCategories());
        dispatch(fetchStats());
    }, [dispatch]);

    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const filteredProducts = selectedCategories.length > 0
        ? products.filter(product => {
            const productCatId = product.category?._id || product.category;
            return selectedCategories.includes(productCatId);
        })
        : products;

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row pb-12 border-b border-gray-200/50 items-baseline justify-between mb-12 gap-6"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-royal-gold font-black tracking-widest text-[10px] uppercase">
                            <Sparkles size={12} />
                            Our Royal Catalog
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900">The Collection</h1>
                    </div>

                    <div className="flex items-center justify-between w-full md:w-auto gap-6">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-3 glass-card px-6 py-3 rounded-2xl text-gray-900 font-bold text-sm hover:bg-white transition-all shadow-premium"
                        >
                            <Filter size={18} className="text-royal-red" />
                            {showFilters ? 'Hide Filters' : 'Filters'}
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-2 text-gray-400 hover:text-royal-black font-bold text-xs uppercase tracking-widest transition-colors">
                                Sort by: <span className="text-gray-900">Popular</span> <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, width: 0, x: -20 }}
                                animate={{ opacity: 1, width: 'auto', x: 0 }}
                                exit={{ opacity: 0, width: 0, x: -20 }}
                                className="lg:col-span-3 overflow-hidden"
                            >
                                <div className="space-y-10 glass-card p-8 rounded-[2.5rem] sticky top-32 border border-white/40 shadow-premium">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-royal-red"></span>
                                            Categories
                                        </h3>
                                        <div className="space-y-4">
                                            {categories.length === 0 ? (
                                                <p className="text-xs text-gray-400 italic">No categories found.</p>
                                            ) : (
                                                categories.map(cat => {
                                                    const catId = cat._id || cat.id;
                                                    const count = stats?.categoryStats?.find(s => s._id?.toString() === catId?.toString())?.count || 0;
                                                    return (
                                                        <label key={catId} className="flex items-center group cursor-pointer justify-between">
                                                            <div className="flex items-center">
                                                                <div className="relative flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedCategories.includes(catId)}
                                                                        onChange={() => handleCategoryChange(catId)}
                                                                        className="peer appearance-none h-5 w-5 border-2 border-gray-200 rounded-lg checked:bg-royal-red checked:border-royal-red transition-all cursor-pointer"
                                                                    />
                                                                    <div className="absolute opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none">
                                                                        <Star size={10} fill="currentColor" />
                                                                    </div>
                                                                </div>
                                                                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-royal-red transition-colors capitalize">
                                                                    {cat.name}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 group-hover:text-royal-red transition-colors">({count})</span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100/50"></div>

                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-royal-gold"></span>
                                            Price Range
                                        </h3>
                                        <div className="space-y-6">
                                            <input
                                                type="range"
                                                className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-royal-red"
                                            />
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <span>₹0</span>
                                                <span>₹10,000+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className={showFilters ? "lg:col-span-9" : "lg:col-span-12"}>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-red"></div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Curating Products...</p>
                            </div>
                        ) : error ? (
                            <div className="glass-card p-12 rounded-[2.5rem] text-center border-red-100">
                                <p className="text-royal-red font-bold">Divine Connection Interrupted</p>
                                <p className="text-sm text-gray-500 mt-2">{error}</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 text-center space-y-4"
                            >
                                <div className="inline-flex p-6 rounded-full bg-gray-50 text-gray-300">
                                    <Filter size={40} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900">No Treasures Found</h3>
                                <p className="text-gray-400 max-w-xs mx-auto text-sm">Try adjusting your filters to find the perfect gift.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
                            >
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id || product.id} product={product} />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
