import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';

const ProductSection = ({ title, products }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 md:mb-12 border-l-4 border-red-600 pl-4"
            >
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 capitalize">
                    {title}
                </h2>
                <div className="h-1 w-20 bg-red-600/20 mt-2 rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 lg:gap-12">
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
        </section>
    );
};

export default ProductSection;
