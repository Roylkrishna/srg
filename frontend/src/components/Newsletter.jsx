import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Newsletter = () => {
    return (
        <section className="py-24 bg-royal-black relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-royal-red/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal-gold/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-royal-gold font-bold tracking-widest text-xs uppercase mb-4 block">Stay Connected</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Join Our Exclusive Club
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg font-light">
                        Subscribe to receive updates on new collections, special offers, and gifting inspiration.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                >
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-royal-red focus:ring-1 focus:ring-royal-red transition-all"
                    />
                    <button className="px-8 py-4 bg-royal-red text-white rounded-full font-bold hover:bg-white hover:text-royal-red transition-all flex items-center justify-center gap-2 group">
                        Subscribe
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.form>

                <p className="text-xs text-gray-500 mt-6">
                    By subscribing, you agree to our Terms & Conditions and Privacy Policy.
                </p>
            </div>
        </section>
    );
};

export default Newsletter;
