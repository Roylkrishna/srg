import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, updateProduct } from '../redux/slices/productSlice';
import { fetchAllCategories } from '../redux/slices/categorySlice';
import { Gift, ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        quantityAvailable: '',
        existingImages: [], // URLs from backend
        newImages: [] // File objects
    });
    useEffect(() => {
        if (!user || (user.role !== 'owner' && user.role !== 'manager' && user.role !== 'admin' && user.role !== 'editor')) {
            navigate('/login');
            return;
        }

        const product = items.find(p => p._id === id);
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category?._id || product.category, // Handle populated category
                description: product.description,
                quantityAvailable: product.quantityAvailable,
                existingImages: product.images || [],
                newImages: []
            });
        } else {
            dispatch(fetchProductDetails(id)).unwrap().then((data) => {
                setFormData({
                    name: data.name,
                    price: data.price,
                    category: data.category?._id || data.category,
                    description: data.description,
                    quantityAvailable: data.quantityAvailable,
                    existingImages: data.images || [],
                    newImages: []
                });
            }).catch(() => {
                navigate('/admin');
            });
        }

        dispatch(fetchAllCategories());
    }, [dispatch, id, items, navigate, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('quantityAvailable', formData.quantityAvailable);

        // Append existing images as text fields (backend will parse them)
        formData.existingImages.forEach(img => {
            data.append('existingImages', img);
        });

        // Append new files
        formData.newImages.forEach(file => {
            data.append('images', file);
        });

        // Backend expects 'images' field for FILES in multer array('images')
        // And we handle 'existingImages' or 'images' (text) in controller manually.
        // My updated controller checks `req.body.images` for text. 
        // Let's send existing ones as `images` text fields too?
        // No, controller logic I wrote:
        // `let existingImages = req.body.entryImages || [];` -> wait I wrote `entryImages` in comment but code used `req.body.images`.
        // Let's double check controller logic. 
        // "let currentImages = []; if (req.body.images) { ... }"
        // So if I append 'images' with string, it goes to body.images.
        // If I append 'images' with blob, it goes to req.files.
        // This collision is handled by multer (files go to req.files, rest to body).
        // So I can just use 'images' for EVERYTHING.

        // Wait, safest is to match what I wrote or expected.
        // In controller: "let currentImages = []; if (req.body.images) ..."
        // So yes, I should send existing URLs as 'images'.

        formData.existingImages.forEach(img => {
            data.append('images', img);
        });

        try {
            await dispatch(updateProduct({ id, data })).unwrap();
            alert("Product updated successfully!");
            navigate('/admin');
        } catch (err) {
            alert("Failed to update product: " + err);
        }
    };

    if (loading && !formData.name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/admin" className="flex items-center gap-2 group">
                                <div className="bg-red-600 p-2 rounded-full text-white">
                                    <Gift size={20} />
                                </div>
                                <span className="font-serif text-xl font-bold text-gray-800">
                                    Shree Rama Admin<span className="text-red-600">.</span>
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                                Go to Shop
                            </Link>
                            <div className="h-8 w-px bg-gray-200 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <img
                                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full border border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-12">
                <div className="mb-6 md:mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-white rounded-full transition-colors text-gray-600 hover:text-red-600">
                            <ArrowLeft size={20} className="md:w-6 md:h-6" />
                        </button>
                        <h1 className="text-xl md:text-3xl font-serif font-bold text-gray-900">Edit Product</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-center gap-3">
                        <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="e.g. Handmade Diya Set"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-white font-medium"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Price (₹)</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none font-bold text-lg"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Stock Quantity</label>
                                <input
                                    name="quantityAvailable"
                                    type="number"
                                    value={formData.quantityAvailable}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-none"
                                placeholder="Tell users about this beautiful gift..."
                            />
                        </div>

                        <div className="space-y-4">
                            <ImageUploader
                                existingImages={formData.existingImages}
                                newImages={formData.newImages}
                                onImagesChange={(updatedNewFiles) => setFormData({ ...formData, newImages: updatedNewFiles })}
                                onRemoveExisting={(index) => {
                                    const updated = [...formData.existingImages];
                                    updated.splice(index, 1);
                                    setFormData({ ...formData, existingImages: updated });
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white transition-colors font-medium"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-red-600 text-white px-8 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm font-bold disabled:opacity-50"
                    >
                        Save and Update
                    </button>
                </div>
            </div>
        </div>
    );
};

const Plus = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default ProductEdit;
