import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, BarChart3, Plus, Search, Edit, Trash2, Check, X as XIcon, Gift, User as UserIcon, LogOut, ExternalLink, Clock, UserPlus, ShieldAlert, ShieldCheck, UserX, Info, Tags, Trash, Image as ImageIcon, Layout, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct } from '../redux/slices/productSlice';
import { fetchAllUsers, updateUserRole, createUser, deleteUser, toggleUserStatus } from '../redux/slices/userSlice';
import { fetchAllCategories, createCategory as addNewCategory, deleteCategory as removeCategory } from '../redux/slices/categorySlice';
import { fetchBanners, addBanner as addNewBanner, deleteBanner as removeBanner } from '../redux/slices/bannerSlice';
import { logoutUser } from '../redux/slices/authSlice';
import { updateContact, fetchContact } from '../redux/slices/contactSlice';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab') || 'products');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading } = useSelector((state) => state.products);
    const { users, loading: userLoading } = useSelector((state) => state.user);
    const { categories, loading: categoryLoading } = useSelector((state) => state.categories);
    const { banners, loading: bannerLoading } = useSelector((state) => state.banners);
    const { user } = useSelector((state) => state.auth);

    // Form State
    const [isAddMode, setIsAddMode] = useState(false);
    const [isAddUserMode, setIsAddUserMode] = useState(false);
    const [isAddBannerMode, setIsAddBannerMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '', price: '', category: '', description: '', quantityAvailable: 10, images: []
    });
    const [imageFiles, setImageFiles] = useState([]); // Store files for upload

    // Contact Form State
    const { info: contactInfo, updateSuccess } = useSelector((state) => state.contact);
    const [contactForm, setContactForm] = useState({
        phone: '', email: '', address: '', mapUrl: '', instagram: '', facebook: '', youtube: ''
    });

    useEffect(() => {
        if (contactInfo) {
            setContactForm(contactInfo);
        }
    }, [contactInfo]);

    const handleUpdateContact = (e) => {
        e.preventDefault();
        dispatch(updateContact(contactForm));
    };

    const [newCategoryName, setNewCategoryName] = useState('');

    const [newBanner, setNewBanner] = useState({
        title: '', description: '', link: '', order: 0
    });
    const [bannerFile, setBannerFile] = useState(null);

    const [newUserForm, setNewUserForm] = useState({
        firstName: '', lastName: '', username: '', email: '', password: '', role: 'manager'
    });

    useEffect(() => {
        const allowedRoles = ['owner', 'manager', 'admin', 'editor'];
        if (!user || !allowedRoles.includes(user.role)) {
            navigate('/login');
            return;
        }

        // Fetch data based on active tab
        if (activeTab === 'products') {
            dispatch(fetchProducts());
            dispatch(fetchAllCategories());
        } else if (activeTab === 'categories') {
            dispatch(fetchAllCategories());
        } else if (activeTab === 'users' || activeTab === 'managers') {
            dispatch(fetchAllUsers());
        } else if (activeTab === 'banners') {
        } else if (activeTab === 'users' || activeTab === 'managers') {
            dispatch(fetchAllUsers());
        } else if (activeTab === 'banners') {
            dispatch(fetchBanners());
        } else if (activeTab === 'contact') {
            dispatch(fetchContact());
        }

        // Persist tab choice
        localStorage.setItem('adminActiveTab', activeTab);
    }, [dispatch, user, navigate, activeTab]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Max 5 images
        if (imageFiles.length + files.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        // Validate file size (Max 500KB)
        const invalidFiles = files.filter(file => file.size > 500 * 1024);
        if (invalidFiles.length > 0) {
            alert(`One or more images exceed the 500KB limit:\n${invalidFiles.map(f => f.name).join('\n')}`);
            e.target.value = ''; // Reset input
            return;
        }

        setImageFiles([...imageFiles, ...files]);
        e.target.value = '';
    };

    const removeImage = (index) => {
        const updated = [...imageFiles];
        updated.splice(index, 1);
        setImageFiles(updated);
    };

    const handleAddProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('category', newProduct.category);
        formData.append('description', newProduct.description);
        formData.append('quantityAvailable', newProduct.quantityAvailable);

        imageFiles.forEach(file => {
            formData.append('images', file);
        });

        dispatch(createProduct(formData)).then(() => {
            setIsAddMode(false);
            setNewProduct({ name: '', price: '', category: '', description: '', quantityAvailable: 10, images: [] });
            setImageFiles([]);
        }).catch(err => {
            alert("Failed to add product: " + err);
        });
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        dispatch(createUser(newUserForm)).then(() => {
            setIsAddUserMode(false);
            setNewUserForm({ firstName: '', lastName: '', username: '', email: '', password: '', role: 'manager' });
        });
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        dispatch(addNewCategory({ name: newCategoryName.trim() })).then(() => {
            setNewCategoryName('');
        });
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Delete this category? Products using this category will remain, but the category won't show in the dropdown.")) {
            dispatch(removeCategory(id));
        }
    };

    const handleAddBanner = (e) => {
        e.preventDefault();
        if (!bannerFile) return alert("Please select an image");
        if (bannerFile.size > 1024 * 1024) return alert("Banner image size must be less than 1MB");

        const formData = new FormData();
        formData.append('image', bannerFile);
        formData.append('title', newBanner.title);
        formData.append('description', newBanner.description);
        formData.append('link', newBanner.link);
        formData.append('order', newBanner.order);

        dispatch(addNewBanner(formData)).then(() => {
            setIsAddBannerMode(false);
            setNewBanner({ title: '', description: '', link: '', order: 0 });
            setBannerFile(null);
        });
    };

    const handleDeleteBanner = (id) => {
        if (window.confirm("Remove this banner from homepage?")) {
            dispatch(removeBanner(id));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure? This will permanently delete the product.")) {
            dispatch(deleteProduct(id));
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) {
            dispatch(deleteUser(id));
        }
    };

    const handleToggleStatus = (id) => {
        dispatch(toggleUserStatus(id));
    };

    const handleRoleChange = (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            dispatch(updateUserRole({ id: userId, role: newRole }));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredUsers = users.filter(u => {
        const query = searchQuery.toLowerCase();
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        const username = u.username?.toLowerCase() || '';
        const email = u.email?.toLowerCase() || '';

        const matchesSearch =
            fullName.includes(query) ||
            username.includes(query) ||
            email.includes(query);

        if (activeTab === 'managers') return matchesSearch && u.role === 'manager';
        if (activeTab === 'users') return matchesSearch && u.role === 'user';
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="bg-red-600 p-2 rounded-full text-white">
                                    <Gift size={20} />
                                </div>
                                <span className="font-serif text-xl font-bold text-gray-800 hidden sm:inline">
                                    Shree Rama Admin<span className="text-red-600">.</span>
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/shop" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                                <ExternalLink size={16} />
                                View Shop
                            </Link>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <div className="relative group">
                                    <img
                                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full border border-gray-200 cursor-pointer"
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link to="/dashboard?tab=profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                                <UserIcon size={16} /> My Profile
                                            </Link>
                                            <button
                                                onClick={() => dispatch(logoutUser())}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
                    <nav className="mt-8 px-4 space-y-2">
                        <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Package size={20} /> Manage Products
                        </button>
                        <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Tags size={20} /> Product Categories
                        </button>
                        <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'banners' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Layout size={20} /> Homepage Banners
                        </button>
                        {user?.role === 'owner' && (
                            <>
                                <button onClick={() => setActiveTab('managers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'managers' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <ShieldCheck size={20} /> Manage Managers
                                </button>
                                <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    <Users size={20} /> All Users
                                </button>
                                <Users size={20} /> All Users
                            </button>
                        <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'contact' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <MapPin size={20} /> Contact Settings
                        </button>
                    </>
                        )}
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <BarChart3 size={20} /> Analytics
                    </button>

                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-auto">
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                                <p className="text-gray-500 text-sm">Manage your inventory and track edits.</p>
                            </div>
                            <button onClick={() => setIsAddMode(!isAddMode)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                <Plus size={20} /> Add Product
                            </button>
                        </div>

                        {/* Add Product Form (Optional: Could move to a new page too, but keeping inline for now) */}
                        {isAddMode && (
                            <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="border p-2 rounded-lg outline-none focus:ring-1 focus:ring-red-500" required />
                                    <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="border p-2 rounded-lg outline-none focus:ring-1 focus:ring-red-500" required />
                                    <select
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="border p-2 rounded-lg outline-none focus:ring-1 focus:ring-red-500 bg-white"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <input placeholder="Quantity" type="number" value={newProduct.quantityAvailable} onChange={e => setNewProduct({ ...newProduct, quantityAvailable: e.target.value })} className="border p-2 rounded-lg outline-none focus:ring-1 focus:ring-red-500" required />
                                </div>
                                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="border p-2 rounded-lg w-full outline-none focus:ring-1 focus:ring-red-500" required />
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Product Images (Max 5)</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {imageFiles.map((file, i) => (
                                            <div key={i} className="relative w-16 h-16 border rounded overflow-hidden group">
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {imageFiles.length < 5 && (
                                            <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-600 cursor-pointer transition-colors">
                                                <Plus size={20} />
                                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsAddMode(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-sm">Save Product</button>
                                </div>
                            </form>
                        )}

                        {/* Product Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                        {user?.role === 'owner' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Edited By</th>}
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                            <span>Fetching products...</span>
                                        </div>
                                    </td></tr> :
                                        products.map(p => (
                                            <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded bg-gray-100 flex-shrink-0">
                                                            {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover rounded" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900">{p.name}</span>
                                                            <span className="text-xs text-gray-500">{p.category?.name || 'Uncategorized'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium">₹{p.price?.toLocaleString() || '0'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.quantityAvailable > 5 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {p.quantityAvailable} in stock
                                                    </span>
                                                </td>
                                                {user?.role === 'owner' && (
                                                    <td className="px-6 py-4">
                                                        {p.lastEditedBy ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-gray-900">{p.lastEditedBy.firstName} {p.lastEditedBy.lastName}</span>
                                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <Clock size={12} /> {formatDate(p.lastEditedAt)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No edits recorded</span>
                                                        )}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link to={`/admin/edit-product/${p._id}`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
                                <p className="text-gray-500 text-sm">Manage the categories available for your products.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4">
                            <input
                                placeholder="Enter new category name..."
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                className="border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500 flex-grow"
                                required
                            />
                            <button type="submit" disabled={categoryLoading} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-sm flex items-center gap-2">
                                <Plus size={20} /> {categoryLoading ? 'Adding...' : 'Add Category'}
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryLoading ? (
                                <div className="col-span-full py-12 text-center text-gray-500">Loading categories...</div>
                            ) : categories.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-400 italic">No categories created yet.</div>
                            ) : (
                                categories.map(cat => (
                                    <div key={cat._id || cat.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between group hover:border-red-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-red-500 transition-colors">
                                                <Tags size={20} />
                                            </div>
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat._id || cat.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'banners' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Homepage Banners</h2>
                                <p className="text-gray-500 text-sm">Manage the images cycling on your home page hero section.</p>
                            </div>
                            <button onClick={() => setIsAddBannerMode(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                <Plus size={20} /> Add New Banner
                            </button>
                        </div>

                        {isAddBannerMode && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="text-xl font-bold text-gray-900">Upload New Banner</h3>
                                        <button onClick={() => setIsAddBannerMode(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon /></button>
                                    </div>
                                    <form onSubmit={handleAddBanner} className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            {/* Image Upload Area */}
                                            <div className="group relative aspect-[21/9] w-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-red-400 transition-all cursor-pointer">
                                                {bannerFile ? (
                                                    <>
                                                        <img src={URL.createObjectURL(bannerFile)} className="w-full h-full object-cover" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button type="button" onClick={() => setBannerFile(null)} className="p-3 bg-red-600 text-white rounded-full">
                                                                <Trash2 size={24} />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center">
                                                        <div className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:text-red-600 group-hover:bg-red-50 transition-all">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="font-bold text-gray-900">Click to upload banner</p>
                                                            <p className="text-xs text-gray-500 mt-1">Recommended: Wide Banner (e.g. 1920x640px)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => setBannerFile(e.target.files[0])}
                                                            required
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Banner Title</label>
                                                    <input
                                                        placeholder="Ex: Festive Collection"
                                                        value={newBanner.title}
                                                        onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Display Order</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Priority (0-99)"
                                                        value={newBanner.order}
                                                        onChange={e => setNewBanner({ ...newBanner, order: e.target.value })}
                                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                                                <textarea
                                                    placeholder="Short catchy tagline..."
                                                    value={newBanner.description}
                                                    onChange={e => setNewBanner({ ...newBanner, description: e.target.value })}
                                                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500 h-24"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Link (Optional)</label>
                                                <input
                                                    placeholder="Ex: /shop or /category/id"
                                                    value={newBanner.link}
                                                    onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                                                    className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                            <button type="button" onClick={() => setIsAddBannerMode(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                                            <button type="submit" className="bg-red-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95">Upload Banner</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {bannerLoading ? (
                                <div className="col-span-full py-24 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Retrieving banner gallery...</p>
                                </div>
                            ) : banners.length === 0 ? (
                                <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                    <ImageIcon size={64} className="mb-4 opacity-20" />
                                    <p className="font-bold">No active banners found.</p>
                                    <p className="text-sm">Add your first banner to see it on the home page.</p>
                                </div>
                            ) : (
                                banners.map((banner) => (
                                    <div key={banner._id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                                        <div className="aspect-[21/9] w-full relative">
                                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                                {banner.title && <h3 className="text-white text-2xl font-serif font-bold mb-2">{banner.title}</h3>}
                                                {banner.description && <p className="text-white/80 text-sm font-medium line-clamp-1">{banner.description}</p>}
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteBanner(banner._id)}
                                                className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-xl transform translate-y-[-10px] group-hover:translate-y-0"
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 border border-white/50">
                                                    Order: {banner.order}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'managers' && user?.role === 'owner' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Managers</h2>
                                <p className="text-gray-500 text-sm">Create and manage your administrative staff.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search managers..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 w-64"
                                    />
                                </div>
                                <button onClick={() => setIsAddUserMode(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                    <UserPlus size={20} /> Add Manager
                                </button>
                            </div>
                        </div>

                        {/* Add Manager Modal Overlay (Simulated) */}
                        {isAddUserMode && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="text-xl font-bold text-gray-900">Add New Manager</h3>
                                        <button onClick={() => setIsAddUserMode(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon /></button>
                                    </div>
                                    <form onSubmit={handleAddUser} className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-600 uppercase">First Name</label>
                                                <input placeholder="Ex: John" value={newUserForm.firstName} onChange={e => setNewUserForm({ ...newUserForm, firstName: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-600 uppercase">Last Name</label>
                                                <input placeholder="Ex: Doe" value={newUserForm.lastName} onChange={e => setNewUserForm({ ...newUserForm, lastName: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-600 uppercase">Username</label>
                                            <input placeholder="johndoe_manager" value={newUserForm.username} onChange={e => setNewUserForm({ ...newUserForm, username: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-600 uppercase">Email Address</label>
                                            <input placeholder="john@example.com" type="email" value={newUserForm.email} onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all" required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-600 uppercase">Initial Password</label>
                                            <input placeholder="••••••••" type="password" value={newUserForm.password} onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })} className="border border-gray-200 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all" required />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                            <button type="button" onClick={() => setIsAddUserMode(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                            <button type="submit" className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95 transition-all">Create Account</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Manager</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userLoading ? <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-500">Loading...</td></tr> :
                                        filteredUsers.length === 0 ? <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No managers found matching your search.</td></tr> :
                                            filteredUsers.map(u => (
                                                <tr key={u._id} className={`hover:bg-gray-50/50 transition-colors ${!u.isActive ? 'bg-gray-50/80 grayscale-[0.5]' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
                                                                {u.firstName?.[0]}{u.lastName?.[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900">{u.firstName} {u.lastName}</span>
                                                                <span className="text-xs text-gray-500 font-medium">{u.email} • <span className="text-gray-400">@{u.username}</span></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            <div className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                                                            {u.isActive ? 'Active' : 'Disabled'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            <Link
                                                                to={`/admin/user/${u._id}`}
                                                                title="View Details"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            >
                                                                <Info size={20} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleToggleStatus(u._id)}
                                                                title={u.isActive ? "Disable Access" : "Enable Access"}
                                                                className={`p-2 rounded-lg transition-all ${u.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                            >
                                                                {u.isActive ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                title="Delete Permanently"
                                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                            >
                                                                <UserX size={20} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'contact' && user?.role === 'owner' && (
                    <div className="space-y-6 max-w-4xl">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                            <p className="text-gray-500 text-sm">Update your store's contact details, address, and social links.</p>
                        </div>

                        <form onSubmit={handleUpdateContact} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
                            {updateSuccess && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-2">
                                    <Check size={20} /> Information updated successfully!
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <input
                                        value={contactForm.phone}
                                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="+91 ..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <input
                                        value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="contact@..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Store Address</label>
                                    <textarea
                                        value={contactForm.address}
                                        onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none h-24"
                                        placeholder="Full address..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Google Maps Embed URL</label>
                                    <input
                                        value={contactForm.mapUrl}
                                        onChange={e => setContactForm({ ...contactForm, mapUrl: e.target.value })}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                    <p className="text-xs text-gray-500">Paste the "src" link from the Google Maps "Embed a map" option.</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Instagram</label>
                                        <input
                                            value={contactForm.instagram}
                                            onChange={e => setContactForm({ ...contactForm, instagram: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Profile URL"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Facebook</label>
                                        <input
                                            value={contactForm.facebook}
                                            onChange={e => setContactForm({ ...contactForm, facebook: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Page URL"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">YouTube</label>
                                        <input
                                            value={contactForm.youtube}
                                            onChange={e => setContactForm({ ...contactForm, youtube: e.target.value })}
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                                            placeholder="Channel URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-xl shadow-red-100 transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'users' && user?.role === 'owner' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Standard Users</h2>
                                <p className="text-gray-500 text-sm">Overview of all registered customers.</p>
                            </div>
                            <div className="relative search-input-container">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 w-64"
                                />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Profile</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userLoading ? <tr><td colSpan="3" className="px-6 py-12 text-center">Loading users...</td></tr> :
                                        filteredUsers.length === 0 ? <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No users found.</td></tr> :
                                            filteredUsers.map(u => (
                                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900">{u.firstName} {u.lastName}</span>
                                                            <span className="text-xs text-gray-500 font-medium">{u.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black text-gray-600 uppercase tracking-widest">{u.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            to={`/admin/user/${u._id}`}
                                                            className="text-xs font-black text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 transition-all uppercase tracking-tighter inline-flex items-center gap-1.5"
                                                        >
                                                            <Info size={14} /> Information
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </div >
    );
};

export default AdminDashboard;
