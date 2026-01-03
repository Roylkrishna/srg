import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center bg-[#FDFBF7] pt-20 overflow-hidden">

            {/* Background Decor Elements - Abstract Shapes */}
            <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-orange-100 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 md:w-72 md:h-72 bg-red-50 rounded-full blur-3xl -z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 bg-red-50 text-red-600 font-semibold text-sm rounded-full tracking-wider uppercase border border-red-100">
                            New Festive Collection 2026
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight">
                            Namaste, <span className="text-red-600 italic">Share</span> the Joy of <br />
                            Traditional Gifting.
                        </h1>

                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                            Discover a curated collection of handcrafted idols, premium dry fruits, and festive delights designed to make every celebration memorable.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-4 bg-red-600 text-white rounded-full font-medium text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center gap-2 group">
                                Shop Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-medium text-lg hover:bg-gray-50 transition-all">
                                View Collections
                            </button>
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-gray-200/60">
                            <div>
                                <p className="text-3xl font-bold font-serif text-gray-900">15k+</p>
                                <p className="text-sm text-gray-500">Happy Customers</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold font-serif text-gray-900">2k+</p>
                                <p className="text-sm text-gray-500">Unique Products</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop"
                                alt="Beautiful Gift Box"
                                className="w-full h-full object-cover"
                            />

                            {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xs border border-white/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gift-gold flex items-center justify-center text-white font-bold text-xl">
                                        50%
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Winter Sale</p>
                                        <p className="text-xs text-access">Limited time offer on all boxes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background for Image */}
                        <div className="absolute -top-4 -right-4 w-full h-full border-2 border-orange-200 rounded-3xl -z-10"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Hero;
