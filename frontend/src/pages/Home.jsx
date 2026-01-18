import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Star, ArrowUpRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchBanners } from '../redux/slices/bannerSlice';
import { fetchAllCategories } from '../redux/slices/categorySlice';
import { fetchStats } from '../redux/slices/statsSlice';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import TrustSection from '../components/TrustSection';
import Newsletter from '../components/Newsletter';
import SkeletonProduct from '../components/skeletons/SkeletonProduct';

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);
    const { banners } = useSelector((state) => state.banners);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchProducts({ select: '_id,name,price,description,image,images,rating,reviews,isNew,category' }));
        dispatch(fetchBanners());
        dispatch(fetchAllCategories());
        dispatch(fetchStats());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />
            <Hero banners={banners} />
            <TrustSection />

            {/* Featured Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 sm:mb-20 space-y-4 sm:space-y-6"
                >
                    <div className="flex justify-center items-center gap-3 text-royal-red font-black tracking-[0.3em] text-[10px] uppercase">
                        <span className="h-px w-10 bg-royal-red/30"></span>
                        Handpicked Masterpieces
                        <span className="h-px w-10 bg-royal-red/30"></span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900">Trending Now</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base">
                        Discover our most celebrated creations that define elegance and tradition.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonProduct key={i} />
                        ))}
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




        </div>
    );
};

export default Home;
