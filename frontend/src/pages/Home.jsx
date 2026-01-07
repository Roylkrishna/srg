import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Star, ArrowUpRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchBanners } from '../redux/slices/bannerSlice';
import { fetchAllCategories } from '../redux/slices/categorySlice';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);
    const { banners } = useSelector((state) => state.banners);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchProducts({ select: '_id,name,price,description,image,images,rating,reviews,isNew,category' }));
        dispatch(fetchBanners());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />
            <Hero banners={banners} />

            {/* Featured Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20 space-y-6"
                >
                    <div className="flex justify-center items-center gap-3 text-royal-red font-black tracking-[0.3em] text-[10px] uppercase">
                        <span className="h-px w-10 bg-royal-red/30"></span>
                        Handpicked Masterpieces
                        <span className="h-px w-10 bg-royal-red/30"></span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900">Trending Now</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Discover our most celebrated creations that define elegance and tradition.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-red"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id || product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Collections / Categories Section */}
            <section className="bg-white py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <span className="text-royal-gold font-bold tracking-widest text-xs uppercase">Curated Collections</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Shop by Occasion</h2>
                        </div>
                        <button className="text-royal-red font-bold underline decoration-2 underline-offset-8 hover:text-royal-black transition-colors">
                            Explore All Collections
                        </button>
                    </div>

                    {categories && categories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, idx) => (
                                <motion.div
                                    key={cat._id || cat.id}
                                    whileHover={{ y: -10 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`group h-80 bg-orange-50 rounded-[2rem] p-10 flex flex-col justify-end relative overflow-hidden transition-all duration-500 cursor-pointer`}
                                >
                                    <div className="absolute top-10 right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <Sparkles size={100} className="text-gray-900" />
                                    </div>
                                    <div className="relative z-10 space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-royal-red transition-colors">Collection</p>
                                        <h3 className="text-3xl font-serif font-bold text-gray-900">{cat.name}</h3>
                                    </div>
                                    <div className="absolute bottom-10 right-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-royal-red shadow-xl">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                            <p className="text-gray-400 font-serif text-xl italic">No collections available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>


        </div>
    );
};

export default Home;
