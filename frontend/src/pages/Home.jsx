import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        // Fetch only fields needed for ProductCard and display
        dispatch(fetchProducts({ select: '_id,name,price,description,image,images,rating,reviews,isNew,category' }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />
            <Hero />

            {/* Featured Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-red-600 font-medium tracking-widest text-sm uppercase">Curated For You</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Trending Now</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Explore our most loved gifts that are bringing smiles to faces across India.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map(product => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Categories Placeholder */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-center mb-12">Shop by Occasion</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Diwali', 'Wedding (Shadi)', 'Rakhi', 'Pooja'].map((cat) => (
                            <div key={cat} className="h-40 bg-gray-50 rounded-xl flex items-center justify-center font-serif text-xl font-bold text-gray-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                    <h2 className="text-3xl font-serif font-bold">Join Our Gift Club</h2>
                    <p className="text-gray-400">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                    <div className="flex max-w-md mx-auto">
                        <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-l-full bg-gray-800 border-none focus:ring-1 focus:ring-red-600" />
                        <button className="bg-red-600 px-8 py-4 rounded-r-full font-bold hover:bg-red-700 transition-colors">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
