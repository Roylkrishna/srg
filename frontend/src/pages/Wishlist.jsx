import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../redux/slices/userSlice';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { wishlist, loading, error } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="pt-32 flex flex-col items-center justify-center text-center px-4">
                    <Heart size={64} className="text-gray-200 mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-500 mb-6">You need to be logged in to view your wishlist.</p>
                    <Link to="/login" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />

            <div className="pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-4 flex items-center justify-center gap-3">
                        <Heart className="text-red-600 fill-red-600" /> My Wishlist
                    </h1>
                    <p className="text-sm md:text-base text-gray-500">Your curated collection of favorites.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        <p>Error loading wishlist: {error}</p>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Start exploring our collection and save your favorites here!</p>
                        <Link to="/" className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {wishlist.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
