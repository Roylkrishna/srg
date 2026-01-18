import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { toggleWishlistProduct } from '../redux/slices/userSlice';
import Navbar from '../components/Navbar';
import confetti from 'canvas-confetti';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetails: product, loading, error } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { user } = useSelector(state => state.auth);
    const userProfile = useSelector(state => state.user.profile);
    const currentUser = userProfile || user;

    useEffect(() => {
        if (id && id !== 'undefined') {
            dispatch(fetchProductDetails(id));
        }
        window.scrollTo(0, 0);
    }, [dispatch, id]);

    if (!id || id === 'undefined') {
        return (
            <div className="min-h-screen bg-gift-cream">
                <Navbar />
                <div className="pt-32 text-center space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Treasure Not Found</h2>
                    <Link to="/" className="text-royal-red font-bold underline decoration-2 underline-offset-8">Return to Collection</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gift-cream flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-red"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Unveiling Masterpiece...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gift-cream">
                <Navbar />
                <div className="pt-32 text-center text-royal-red p-8">
                    <h2 className="text-2xl font-serif font-bold">Divine Connection Interrupted</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                    <Link to="/" className="text-gray-900 mt-6 inline-block font-bold underline">Back to Collection</Link>
                </div>
            </div>
        );
    }

    const isLiked = currentUser?.likedProducts?.includes(product._id);
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    const handleWishlist = () => {
        if (!currentUser) return alert("Please login first");

        if (!isLiked) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#991B1B', '#D97706', '#FFFFFF'],
                disableForReducedMotion: true
            });
        }

        dispatch(toggleWishlistProduct(product._id));
    };

    return (
        <div className="min-h-screen bg-gift-cream selection:bg-royal-red/30">
            <Navbar />

            <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link to="/" className="group inline-flex items-center gap-3 text-gray-400 hover:text-royal-black mb-12 transition-colors font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Collection
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Image Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            layoutId={`product-image-${product._id}`}
                            className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white relative border border-gray-100/50 shadow-premium"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-contain p-12"
                                />
                            </AnimatePresence>

                            {/* Floating Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                {product.isNew && (
                                    <span className="px-5 py-2 bg-royal-red text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">
                                        Rare Piece
                                    </span>
                                )}
                                <span className="px-5 py-2 glass-card text-royal-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                                    Handcrafted
                                </span>
                            </div>
                        </motion.div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-2xl overflow-hidden bg-white cursor-pointer border-2 transition-all p-2 ${idx === selectedImage ? 'border-royal-red shadow-lg' : 'border-gray-100 hover:border-royal-gold'}`}
                                    >
                                        <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-royal-gold font-black tracking-widest text-[10px] uppercase">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < (product.rating || 0) ? "fill-royal-gold" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    <span>{product.reviews || 0} Royal Reviews</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-royal-red">₹{product.price}</span>
                                    <span className="text-sm font-bold text-gray-400 line-through">₹{Math.floor(product.price * 1.2)}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-lg font-light leading-relaxed border-l-2 border-royal-gold/20 pl-6 py-2">
                                {product.description}
                            </p>

                            <div className="flex flex-col gap-6 pt-10 border-t border-gray-100/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Stock Availability</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-4 py-1 rounded-full uppercase tracking-tighter">
                                        {product.countInStock > 0 ? `${product.countInStock} Pieces Available` : 'Limited Reservation Only'}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleWishlist}
                                        className={`flex-1 py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-premium flex items-center justify-center gap-3 ${isLiked ? 'bg-royal-black text-white' : 'red-gradient text-white hover:scale-[1.02] active:scale-95'}`}
                                    >
                                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                        {isLiked ? 'In Your Curations' : 'Add to Collection'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="glass-card p-6 rounded-3xl space-y-2 border border-white/40">
                                        <ShieldCheck size={24} className="text-royal-gold" />
                                        <h4 className="font-bold text-sm text-gray-900">Certified Quality</h4>
                                        <p className="text-[10px] text-gray-500 font-medium">Handpicked & authenticated</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
