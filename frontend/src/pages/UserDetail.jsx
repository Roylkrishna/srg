import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Calendar, Mail, Phone, MapPin, Package, Clock,
    ArrowLeft, Trash2, Ban, CheckCircle, Info, ExternalLink, Filter, Search, Key, X as XIcon
} from 'lucide-react';
import { fetchUserWithOrders, deleteUser, toggleUserStatus, clearUserDetails, fetchManagerActivity, adminResetPassword } from '../redux/slices/userSlice';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUserDetails: userData, loading, activities, activityLoading, error } = useSelector((state) => state.user);
    const { user: loggedInUser } = useSelector((state) => state.auth);

    const [dateFilter, setDateFilter] = useState({
        startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    // Password Reset State
    const [resetPasswordModal, setResetPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        dispatch(fetchUserWithOrders(id));
        return () => dispatch(clearUserDetails());
    }, [dispatch, id]);

    useEffect(() => {
        if (userData && ['owner', 'manager', 'admin', 'editor'].includes(userData.role)) {
            dispatch(fetchManagerActivity({ id, ...dateFilter }));
        }
    }, [dispatch, id, userData, dateFilter]);

    const isStaff = userData && ['owner', 'manager', 'admin', 'editor'].includes(userData.role);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            const result = await dispatch(deleteUser(id));
            if (deleteUser.fulfilled.match(result)) {
                navigate('/admin-secure-access-7x24');
            }
        }
    };

    const handleToggleStatus = () => {
        dispatch(toggleUserStatus(id));
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        dispatch(adminResetPassword({
            userId: id,
            newPassword: newPassword
        })).then((res) => {
            if (!res.error) {
                alert("Password reset successfully!");
                setResetPasswordModal(false);
                setNewPassword('');
            } else {
                alert("Failed to reset password: " + res.payload);
            }
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setDateFilter(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    );

    if (!userData) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Info className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">{error || "User Not Found"}</h2>
            <button onClick={() => navigate('/admin-secure-access-7x24')} className="mt-4 text-red-600 hover:underline flex items-center gap-2">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 relative">
            {/* Password Reset Modal */}
            {resetPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <Key size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                                    <p className="text-xs text-gray-500">For user: <span className="font-bold">{userData.firstName} {userData.lastName}</span></p>
                                </div>
                            </div>
                            <button onClick={() => setResetPasswordModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><XIcon /></button>
                        </div>
                        <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase">New Password</label>
                                <input
                                    type="text"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="border border-gray-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-red-500 outline-none transition-all font-mono"
                                    required
                                    minLength={6}
                                />
                                <p className="text-[10px] text-gray-400">Must be at least 6 characters long.</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setResetPasswordModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="bg-red-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95 transition-all">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin-secure-access-7x24')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors w-fit"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest",
                            userData.role === 'owner' ? "bg-purple-100 text-purple-700" :
                                userData.role === 'manager' ? "bg-blue-100 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                        )}>
                            {userData.role}
                        </span>
                        {!userData.isActive && (
                            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-100 text-red-700">
                                Disabled
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: User Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-gray-50 p-1 mb-6">
                                    {userData.profilePicture ? (
                                        <img src={userData.profilePicture} alt={userData.username} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full rounded-full bg-red-50 text-red-600 flex items-center justify-center text-3xl font-bold uppercase">
                                            {userData.firstName?.[0]}{userData.lastName?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className={cn(
                                    "absolute bottom-4 right-4 h-5 w-5 rounded-full border-4 border-white",
                                    userData.isActive ? "bg-green-500" : "bg-gray-400"
                                )}></div>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <p className="text-gray-500 font-medium mb-8">@{userData.username}</p>

                            <div className="w-full space-y-4 text-left border-t border-gray-50 pt-8">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm truncate">{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{userData.mobileNumber || "No mobile number"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm leading-relaxed">
                                        {userData.address ? (
                                            typeof userData.address === 'string' ? userData.address :
                                                `${userData.address.street || ''} ${userData.address.city || ''} ${userData.address.state || ''} ${userData.address.zip || ''}`.trim() || "No address provided"
                                        ) : "No address provided"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">
                                        Joined {userData.createdAt ? format(new Date(userData.createdAt), 'dd MMMM yyyy') : 'Unknown Date'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        {loggedInUser?.role === 'owner' && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Administrative Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setResetPasswordModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 font-bold text-sm transition-all border border-transparent hover:border-gray-200"
                                    >
                                        <Key size={18} /> Reset Password
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleToggleStatus}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all",
                                                userData.isActive
                                                    ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                            )}
                                        >
                                            {userData.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                                            {userData.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm transition-all"
                                        >
                                            <Trash2 size={18} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content: Activity or History */}
                    <div className="lg:col-span-2 space-y-6">
                        {isStaff ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Work Done</h3>
                                            <p className="text-sm text-gray-500 font-medium mb-2">Tracking manager productivity and updates</p>
                                            <div className="flex gap-4">
                                                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    Added: {activities?.filter(a => a.action === 'CREATE').length || 0}
                                                </div>
                                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                    Updated: {activities?.filter(a => a.action === 'UPDATE').length || 0}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">From</label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={dateFilter.startDate}
                                                    onChange={handleFilterChange}
                                                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">To</label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={dateFilter.endDate}
                                                    onChange={handleFilterChange}
                                                    className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {activityLoading ? (
                                        <div className="flex justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                        </div>
                                    ) : activities && activities.length > 0 ? (
                                        <div className="space-y-4">
                                            {activities.map((activity) => (
                                                <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white hover:shadow-md hover:border-red-100 border border-transparent rounded-2xl transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center",
                                                            activity.action === 'CREATE' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                                        )}>
                                                            {activity.action === 'CREATE' ? <Package size={24} /> : <Clock size={24} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-gray-900">{activity.productName}</h4>
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                                                    activity.action === 'CREATE' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                                )}>
                                                                    {activity.action === 'CREATE' ? 'Added' : 'Updated'}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                <Clock size={12} /> {format(new Date(activity.timestamp), 'dd MMM yyyy, hh:mm a')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/shop`)} // Temporary as product detail might not be implemented
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="View in Shop"
                                                    >
                                                        <ExternalLink size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                <Search className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">No activity found</h4>
                                            <p className="text-gray-500 max-w-xs mx-auto">No products were added or updated by this manager during the selected period.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6">
                                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                            <Package size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Orders</p>
                                            <p className="text-3xl font-bold text-gray-900">{userData.orders?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-6">
                                        <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                            <Package size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Loyalty Status</p>
                                            <p className="text-2xl font-bold text-gray-900">Regular Customer</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                                    <div className="px-8 py-6 border-b border-gray-50">
                                        <h3 className="text-xl font-serif font-bold text-gray-900">Purchase History</h3>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 h-full mt-20">
                                        <Package className="w-20 h-20 text-gray-100 mb-6" />
                                        <p className="font-medium">No purchases recorded yet.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
