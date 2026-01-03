import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Star, Heart, Truck, ShieldCheck, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { toggleWishlistProduct } from '../redux/slices/userSlice';
import confetti from 'canvas-confetti';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetails: product, loading, error } = useSelector((state) => state.products);
    const [quantity, setQuantity] = useState(1);

    // Auth user check for wishlist
    const { user } = useSelector(state => state.auth);
    const userProfile = useSelector(state => state.user.profile);
    const currentUser = userProfile || user;

    useEffect(() => {
        if (id && id !== 'undefined') {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id]);

    if (!id || id === 'undefined') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-32 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Product not found.</h2>
                    <Link to="/shop" className="text-red-600 mt-4 inline-block">Back to Shop</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-32 text-center text-red-500">
                    <h2 className="text-2xl font-bold">Error loading product.</h2>
                    <p>{error}</p>
                    <Link to="/shop" className="text-gray-600 mt-4 inline-block underline">Back to Shop</Link>
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
                colors: ['#EF4444', '#FCD34D', '#FFFFFF'],
                disableForReducedMotion: true
            });
        }

        dispatch(toggleWishlistProduct(product._id));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft size={16} /> Back to Shop
                </Link>

                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white relative border border-gray-100">
                                <img src={images[0]} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white cursor-pointer border-2 border-transparent hover:border-red-600 transition-all border-gray-100">
                                            <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    {product.isNew && <span className="text-gift-gold font-bold text-sm tracking-widest uppercase">New Arrival</span>}
                                    {product.isNew && <span className="text-gray-300">|</span>}
                                    <div className="flex items-center text-yellow-400 text-sm">
                                        <Star size={16} fill="currentColor" /> <span className="ml-1 text-gray-600 font-medium">{product.rating || 0} ({product.reviews || 0} reviews)</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-2xl text-red-600 font-bold">₹{product.price}</p>
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="border-t border-b border-gray-100 py-6 space-y-4">
                                <div className="flex items-center gap-6">
                                    <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">In Stock: {product.quantityAvailable}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleWishlist}
                                        className={`flex-1 py-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'}`}
                                    >
                                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                        {isLiked ? 'Saved to Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Truck size={18} className="text-red-600" />
                                    <span>Free Delivery across India</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-red-600" />
                                    <span>Authenticity Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
