import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistProduct } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isHovered, setIsHovered] = React.useState(false);

    const userProfile = useSelector(state => state.user.profile);
    const currentUser = userProfile || user;

    const isLiked = currentUser?.likedProducts?.includes(product._id || product.id);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            alert("Please login to add to wishlist!");
            return;
        }

        if (!isLiked) {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#991B1B', '#D97706', '#FFFFFF'], // Royal Red, Gold, White
                disableForReducedMotion: true
            });
        }

        dispatch(toggleWishlistProduct(product._id || product.id));
    };

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    React.useEffect(() => {
        if (images.length <= 1 || !isHovered) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    const currentImage = images[currentImageIndex];

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 border border-gray-100/50"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5] bg-gift-cream">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={currentImage}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: isHovered ? 1.1 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-contain p-4"
                    />
                </AnimatePresence>

                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="px-3 py-1 bg-royal-red text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            New
                        </span>
                    )}
                    {product.category && (
                        <span className="px-3 py-1 glass-card text-royal-black text-[10px] font-black uppercase tracking-widest rounded-full">
                            {typeof product.category === 'object' ? product.category.name : product.category}
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 right-4 p-3 rounded-full shadow-2xl transition-all duration-300 transform ${isHovered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} ${isLiked ? 'bg-royal-red text-white' : 'glass-card text-gray-900'}`}
                >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>

                {/* Bottom Action Bar */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <Link
                        to={`/product/${product._id}`}
                        className="w-full bg-royal-black text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl hover:bg-royal-red transition-colors"
                    >
                        Explore Now
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={i < product.rating ? "fill-royal-gold text-royal-gold" : "text-gray-200"}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {product.reviews} Reviews
                    </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-royal-red transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 font-light leading-relaxed">
                    {product.description}
                </p>

                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
