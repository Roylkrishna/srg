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
        dispatch(fetchAllCategories());
        // dispatch(fetchStats()); // Removed as it likely requires auth and isn't used on Home
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />
            <Hero banners={banners} />
            {/* Product Collection Section */}
            <section id="product-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-20"
                >
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900">Our Collection</h2>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonProduct key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
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
