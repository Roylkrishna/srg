import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Calendar, ChevronLeft, ChevronRight, User, MousePointer, Terminal, Download, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../lib/api';

const ActivityLog = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // State
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1, totalLogs: 0 });

    // Filters
    const [filters, setFilters] = useState({
        eventType: 'all',
        startDate: '',
        endDate: '',
        userId: '' // This could be enhanced with a user search dropdown
    });

    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [debouncedUserQuery, setDebouncedUserQuery] = useState('');

    // Debounce user search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUserQuery(userSearchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [userSearchQuery]);

    // Fetch Logs
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const config = {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    eventType: filters.eventType,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    userId: filters.userId
                }
            };

            const response = await api.get('/analytics/logs', config);

            if (response.data.success) {
                setLogs(response.data.logs);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && (user.role === 'owner' || user.role === 'admin')) {
            fetchLogs();
        } else {
            // Redirect or show access denied if not authorized
            // verifyOwner middleware on backend handles security, but frontend redirect is good UX
        }
    }, [pagination.page, filters, user]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const clearFilters = () => {
        setFilters({ eventType: 'all', startDate: '', endDate: '', userId: '' });
        setUserSearchQuery('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'VIEW_PRODUCT': return <MousePointer className="text-blue-500" size={16} />;
            case 'SEARCH': return <Search className="text-orange-500" size={16} />;
            case 'LOGIN': return <User className="text-green-500" size={16} />;
            default: return <Terminal className="text-gray-500" size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar mimic or simple header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 sm:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin-secure-access-7x24?tab=analytics" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">User Activity Logs</h1>
                </div>
                <button onClick={fetchLogs} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Refresh">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="flex-1 p-4 sm:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Filters Section */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-xs font-bold text-gray-500 uppercase">Event Type</label>
                            <div className="relative">
                                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
                                    value={filters.eventType}
                                    onChange={(e) => handleFilterChange('eventType', e.target.value)}
                                >
                                    <option value="all">All Events</option>
                                    <option value="VIEW_PRODUCT">View Product</option>
                                    <option value="SEARCH">Search</option>
                                    <option value="PAGE_VIEW">Page Views</option>
                                    <option value="ADD_TO_CART">Add to Cart</option>
                                    {/* Add other types as they exist in backend */}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">From Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">To Date</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <label className="text-xs font-bold text-gray-500 uppercase">User ID (Optional)</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Paste User ID..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.userId}
                                    onChange={(e) => handleFilterChange('userId', e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mb-0.5"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location/IP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                                    <span>Loading activities...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                No activity logs found for the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(log.timestamp)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {log.userId ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                                                                {log.userId.firstName?.[0] || 'U'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-gray-900">{log.userId.firstName} {log.userId.lastName}</span>
                                                                <span className="text-xs text-gray-400">{log.userId.email}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">Guest User</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-gray-100 rounded-full">
                                                            {getEventIcon(log.eventType)}
                                                        </div>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${log.eventType === 'VIEW_PRODUCT' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            log.eventType === 'SEARCH' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                            }`}>
                                                            {log.eventType}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {log.productId ? (
                                                        <div className="flex items-center gap-2">
                                                            {log.productId.images?.[0] && <img src={log.productId.images[0]} alt="" className="h-8 w-8 rounded object-cover border border-gray-100" />}
                                                            <span className="truncate max-w-[200px]" title={log.productId.name}>{log.productId.name}</span>
                                                        </div>
                                                    ) : log.metadata?.query ? (
                                                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">"{log.metadata.query}"</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span>{log.ipAddress || 'Unknown IP'}</span>
                                                        {log.location && log.location.lat && (
                                                            <span className="text-xs text-gray-400">
                                                                {log.location.lat.toFixed(2)}, {log.location.lng.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of <span className="font-bold text-gray-900">{pagination.totalPages}</span>
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
