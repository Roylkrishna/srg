import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { User, Package, Heart, LogOut, Camera, Mail, Phone, MapPin, Calendar, Edit3, Clock, ExternalLink, Search, Key, ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, fetchManagerActivity, changePassword, deleteAccount } from '../redux/slices/userSlice';
import { logoutUser } from '../redux/slices/authSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { success, loading, activities, activityLoading } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        profilePictureFile: null // New state for file
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        password: '',
        loading: false
    });

    const fileInputRef = React.useRef(null);


    const isStaff = user && ['owner', 'manager', 'admin', 'editor'].includes(user.role);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            mobileNumber: user.mobileNumber || '',
            street: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            zip: user.address?.zip || ''
        });

        if (isStaff && activeTab === 'profile') {
            dispatch(fetchManagerActivity({
                id: user._id,
                startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
                endDate: format(new Date(), 'yyyy-MM-dd')
            }));
        }
    }, [user, navigate, isStaff, activeTab, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500 KB Limit
                alert("File size exceeds 500KB limit.");
                return;
            }
            setFormData({ ...formData, profilePictureFile: file });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Use FormData for file upload
        const submissionData = new FormData();
        submissionData.append('firstName', formData.firstName);
        submissionData.append('lastName', formData.lastName);
        submissionData.append('email', formData.email);
        submissionData.append('mobileNumber', formData.mobileNumber);

        // Address needs to be sent individually or as stringify if backend parses it, 
        // but our backend expects nested object. Mongoose/Express might not parse nested keys in FormData automatically without 'dot notation' or middleware.
        // Let's send dot notation for address fields which is standard for simple parsing.

        // Actually, userController expects: 
        // req.body.address (which is an object).
        // Standard FormData with 'address[street]' notation is handled by 'body-parser' extended: true, 
        // but multer processes the body. Multer populates req.body. 
        // Let's try sending as a JSON string and parse it in backend? 
        // OR easier: flat fields. Controller uses req.body.address.
        // Let's send 'address' as object. 
        // If we use standard FormData, we can append 'address[street]'. 
        // However, userController logic is: address: req.body.address
        // If req.body.address is an object, perfect. Multer usually handles dot notation if 'extended' is true in body-parser (default in express).

        submissionData.append('address[street]', formData.street);
        submissionData.append('address[city]', formData.city);
        submissionData.append('address[state]', formData.state);
        submissionData.append('address[zip]', formData.zip);

        if (formData.profilePictureFile) {
            submissionData.append('profilePicture', formData.profilePictureFile);
        }

        dispatch(updateUserProfile({ id: user._id, data: submissionData }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await dispatch(changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })).unwrap();
            alert("Password changed successfully!");
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error);
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!deleteModal.password) return;

        setDeleteModal({ ...deleteModal, loading: true });
        try {
            await dispatch(deleteAccount(deleteModal.password)).unwrap();
            alert("Your account has been deleted. We're sorry to see you go.");
            dispatch(logoutUser());
            navigate('/');
        } catch (error) {
            alert(error);
            setDeleteModal({ ...deleteModal, loading: false, password: '' });
        }
    };

    return (
        <div className="min-h-screen bg-gift-cream">
            <Navbar />

            <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-100">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4 relative group cursor-pointer" onClick={triggerFileInput}>
                                {formData.profilePictureFile ? (
                                    <img src={URL.createObjectURL(formData.profilePictureFile)} alt="Preview" className="w-full h-full rounded-full object-cover" />
                                ) : user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={40} className="text-red-600" />
                                )}
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <h2 className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>

                        <nav className="space-y-2">
                            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>
                                <User size={20} /> My Profile
                            </button>
                            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>
                                <Package size={20} /> My Orders
                            </button>
                            <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'wishlist' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>
                                <Heart size={20} /> Wishlist
                            </button>
                            <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`}>
                                <Key size={20} /> Security
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all mt-8">
                                <LogOut size={20} /> Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 sm:p-8">
                        {activeTab === 'profile' && (
                            <div className="animate-fade-in-up">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                                        {isEditMode ? 'Edit Profile' : 'My Profile'}
                                    </h2>
                                    {!isEditMode && (
                                        <button
                                            onClick={() => navigate('/dashboard?edit=true')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100"
                                        >
                                            <Edit3 size={18} /> Edit Profile
                                        </button>
                                    )}
                                </div>

                                {success && <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-2 font-medium border border-green-100">
                                    <Edit3 className="w-5 h-5" /> Profile updated successfully!
                                </div>}

                                {isEditMode ? (
                                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
                                                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
                                                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                                <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block pb-2 border-b border-gray-50">Delivery Address</label>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500">Street</label>
                                                    <input name="street" value={formData.street} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500">City</label>
                                                        <input name="city" value={formData.city} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500">State</label>
                                                        <input name="state" value={formData.state} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500">ZIP Code</label>
                                                        <input name="zip" value={formData.zip} onChange={handleChange} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <button type="submit" disabled={loading} className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50 min-w-[200px]">
                                                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard')}
                                                className="px-10 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
                                                <div className="flex items-center gap-4 text-gray-600">
                                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                                        <Mail size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                                                        <p className="font-bold text-gray-900">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-600">
                                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                                        <Phone size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                                                        <p className="font-bold text-gray-900">{user.mobileNumber || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-600">
                                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                                        <MapPin size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Address</p>
                                                        <p className="font-bold text-gray-900 leading-relaxed">
                                                            {user.address ? (
                                                                `${user.address.street || ''} ${user.address.city || ''} ${user.address.state || ''} ${user.address.zip || ''}`.trim() || "No address provided"
                                                            ) : "No address provided"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-600">
                                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                                        <Calendar size={22} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Member Since</p>
                                                        <p className="font-bold text-gray-900">{user.createdAt ? format(new Date(user.createdAt), 'dd MMMM yyyy') : 'Unknown'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isStaff && (
                                            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col">
                                                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-serif font-bold text-gray-900">Your Recent Activity</h3>
                                                        <p className="text-xs text-gray-500 font-medium">Tracking your product updates</p>
                                                    </div>
                                                    <div className="h-10 w-10 bg-gift-red/10 text-red-600 rounded-xl flex items-center justify-center">
                                                        <Clock size={20} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-6 overflow-y-auto max-h-[400px]">
                                                    {activityLoading ? (
                                                        <div className="flex justify-center py-12">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                                        </div>
                                                    ) : activities && activities.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {activities.slice(0, 10).map((activity) => (
                                                                <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100 group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={cn(
                                                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                                                            activity.action === 'CREATE' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                                                        )}>
                                                                            {activity.action === 'CREATE' ? <Package size={18} /> : <Clock size={18} />}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-bold text-gray-900 text-sm">{activity.productName}</h4>
                                                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                                {format(new Date(activity.timestamp), 'dd MMM, hh:mm a')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <button onClick={() => navigate('/shop')} className="p-2 text-gray-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                                        <ExternalLink size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                                <Clock className="w-8 h-8 text-gray-200" />
                                                            </div>
                                                            <p className="text-gray-400 text-sm font-medium">No activity recorded</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-bold mb-6">Order History</h2>
                                <div className="space-y-4">
                                    {[1, 2].map((order) => (
                                        <div key={order} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-900">Order #12345{order}</p>
                                                <p className="text-sm text-gray-500">Placed on Oct 24, 2025</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">Shipped</span>
                                                <span className="font-bold">₹1250.00</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                                {user?.likedProducts && user.likedProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.likedProducts.map(product => (
                                            // Handle case where product might be ID only or populated object
                                            typeof product === 'object' ? (
                                                <ProductCard key={product._id || product.id} product={product} />
                                            ) : (
                                                // If IDs only, we can't render card details easily without fetching them. 
                                                // We need valid populated data. 
                                                // Assuming backend populates them. If not, filtered out.
                                                null
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                            <Heart size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                                        <p className="text-gray-500 mb-6">Save items you love to revisit them later.</p>
                                        <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                                            Explore Shop
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 max-w-xl">
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                                            Update Password
                                        </button>
                                    </form>

                                    <div className="mt-12 pt-12 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-red-600 mb-4">
                                            <ShieldAlert size={20} />
                                            <h3 className="font-bold">Danger Zone</h3>
                                        </div>
                                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-red-900 text-sm">Delete Account Permanently</p>
                                                <p className="text-xs text-red-600/70">Once deleted, your profile, wishlist, and settings are gone forever.</p>
                                            </div>
                                            <button
                                                onClick={() => setDeleteModal({ ...deleteModal, isOpen: true })}
                                                className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 whitespace-nowrap"
                                            >
                                                Delete My Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Deletion Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-red-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-gray-900">Final Confirmation</h3>
                                    <p className="text-xs text-gray-500 font-medium tracking-tight">This action is irreversible</p>
                                </div>
                            </div>
                            <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false, password: '' })} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"><X /></button>
                        </div>
                        <form onSubmit={handleDeleteAccount} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    Are you absolutely sure? Deleting your account will remove your <span className="text-gray-900 font-bold">wishlist, profile preferences, and all personal data</span>.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Enter Password to Confirm</label>
                                    <input
                                        type="password"
                                        placeholder="Your current password"
                                        value={deleteModal.password}
                                        onChange={e => setDeleteModal({ ...deleteModal, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={deleteModal.loading || !deleteModal.password}
                                    className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50 active:scale-95"
                                >
                                    {deleteModal.loading ? 'Deleting Account...' : 'Yes, Delete My Account'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteModal({ ...deleteModal, isOpen: false, password: '' })}
                                    className="w-full py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                                >
                                    No, Keep My Account
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
