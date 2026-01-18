import React from 'react';
import { ShieldCheck, Truck, Gem, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Gem className="w-8 h-8 text-royal-red" />,
        title: "Premium Quality",
        description: "Handpicked masterpieces crafted with precision."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-royal-red" />,
        title: "Secure Payment",
        description: "100% secure transactions with encrypted protection."
    },
    {
        icon: <Truck className="w-8 h-8 text-royal-red" />,
        title: "Fast Delivery",
        description: "Reliable shipping to your doorstep across India."
    },
    {
        icon: <Clock className="w-8 h-8 text-royal-red" />,
        title: "24/7 Support",
        description: "Dedicated support team to assist you anytime."
    }
];

const TrustSection = () => {
    return (
        <section className="bg-white py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gift-cream/50 transition-colors"
                        >
                            <div className="p-3 bg-red-50 rounded-xl">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-gray-900 mb-1">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
