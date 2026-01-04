import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchAllCategories } from '../redux/slices/categorySlice';

const Shop = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const [showFilters, setShowFilters] = useState(false);
    // State to track selected categories for filtering (client-side for now as productSlice fetches all)
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    // Filter products based on selected categories
    const filteredProducts = selectedCategories.length > 0
        ? products.filter(product => {
            // Product category might be an object (populated) or string (ID)
            const productCatId = product.category?._id || product.category;
            return selectedCategories.includes(productCatId);
        })
        : products;

    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row pb-8 border-b border-gray-200 items-baseline justify-between mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Shop All Gifts</h1>

                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium"
                        >
                            <Filter size={18} /> Filters
                        </button>

                        <button className="flex items-center gap-2 text-gray-600 hover:text-black font-medium ml-auto md:ml-0">
                            Sort by: Popular <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters - Mobile Collapsible / Desktop Sidebar */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-8 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none mb-6 md:mb-0`}>
                        <div>
                            <div className="flex items-center justify-between md:hidden mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="text-gray-500"><ChevronDown size={20} className="rotate-180" /></button>
                            </div>
                            <h3 className="hidden md:flex text-lg font-bold text-gray-900 mb-4 items-center gap-2">
                                <Filter size={20} /> Filters
                            </h3>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Category</h4>
                                <div className="space-y-2">
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">No categories found.</p>
                                    ) : (
                                        categories.map(cat => (
                                            <label key={cat._id || cat.id} className="flex items-center gap-2 cursor-pointer hover:text-red-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat._id || cat.id)}
                                                    onChange={() => handleCategoryChange(cat._id || cat.id)}
                                                    className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                                                />
                                                <span className="text-gray-600">{cat.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-6"></div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Price Range</h4>
                                <input type="range" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>₹0</span>
                                    <span>₹10,000+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="md:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-12">
                                <p>Error loading products: {error}</p>
                                <p className="text-sm mt-2">Make sure the backend is running!</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">No products found.</div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id || product.id} product={product} /> // Support both _id (mongo) and id (mock)
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
