import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistProduct } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user, profile } = useSelector((state) => state.auth);

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
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#EF4444', '#FCD34D', '#FFFFFF'], // Red, Gold, White
                disableForReducedMotion: true
            });
        }

        dispatch(toggleWishlistProduct(product._id || product.id));
    };

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

    React.useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
                setIsTransitioning(false);
            }, 300); // Wait for fade out
        }, 3000); // Cycle every 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const currentImage = images[currentImageIndex];

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">

            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5] bg-white">
                <img
                    src={currentImage}
                    alt={product.name}
                    className={`w-full h-full object-contain transform group-hover:scale-110 transition-all duration-300 ${isTransitioning ? 'opacity-80 blur-sm scale-95' : 'opacity-100 scale-100'}`}
                />

                {/* Dots indicator for multiple images */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-red-600' : 'w-1 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <button
                        onClick={handleWishlist}
                        className={`p-3 rounded-full shadow-md transition-colors ${isLiked ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-red-600 hover:text-white'}`}
                    >
                        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                </div>

                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-gift-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-3 md:p-5">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-1">{product.description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    <Link to={`/product/${product._id}`} className="text-sm font-medium text-red-600 hover:underline decoration-2 underline-offset-4">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
