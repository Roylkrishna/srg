import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Package, Search, TrendingUp, AlertCircle, Activity, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ActivityMap from './ActivityMap';

const AnalyticsDashboard = ({ data, loading, timeRange, onTimeRangeChange }) => {

    // Memoize data for charts to prevent unnecessary calcs
    const chartData = useMemo(() => {
        if (!data?.viewsOverTime) return [];
        return data.viewsOverTime.map(item => ({
            date: new Date(item._id).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
            views: item.count
        }));
    }, [data]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-gray-400 font-medium animate-pulse">Gathering Intelligence...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-gray-400">Analytics data unavailable</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Performance metrics and user engagement insights.
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {[
                        { label: '7 Days', value: '7d' },
                        { label: '30 Days', value: '30d' },
                        { label: 'All Time', value: 'all' }
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => onTimeRangeChange(range.value)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeRange === range.value
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Views Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Views</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalViews || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Total Searches Card */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Search size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Searches</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalSearches || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Active Users Card (Real-time) */}
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                    <div className="bg-green-500 text-white p-2 rounded-lg animate-pulse">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-green-700 font-bold uppercase tracking-wide">Active Now (5m)</p>
                        <p className="text-2xl font-black text-green-800 leading-none">
                            {data.activeUsers || 0}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Traffic Trend Chart (Area Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">Traffic Trends</h3>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#DC2626', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#DC2626"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products (List View - Standard for Ranking) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <Package size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">Most Viewed Products</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2 custom-scrollbar">
                        {data.topProducts?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-default">
                                <span className={`text-sm font-black w-6 ${idx < 3 ? 'text-red-500' : 'text-gray-300'}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div className="h-12 w-12 rounded-lg bg-gray-100 p-1 border border-gray-200 shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-red-600 transition-colors">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">₹{item.price?.toLocaleString()}</p>
                                </div>
                                <div className="bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm text-xs font-bold text-gray-700">
                                    {item.views}
                                </div>
                            </div>
                        ))}
                        {(!data.topProducts || data.topProducts.length === 0) && (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <Package size={32} className="mb-2 opacity-50" />
                                <p className="text-sm italic">No product data collected yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Search Terms (Bar Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Search size={20} />
                        </div>
                        <h3 className="font-bold text-gray-900">Top Search Queries</h3>
                    </div>

                    <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topSearches} layout="vertical" margin={{ left: 10, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="_id"
                                    type="category"
                                    tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }}
                                    width={100}
                                    tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 12)}...` : val}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#3B82F6"
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        {(!data.topSearches || data.topSearches.length === 0) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-white/50 backdrop-blur-sm z-10">
                                <Search size={32} className="mb-2 opacity-50" />
                                <p className="text-sm italic">No search data collected yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Activity Log (New) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Activity size={20} />
                            </div>
                            <h3 className="font-bold text-gray-900">Recent User Activity (Log)</h3>
                        </div>
                        <Link to="/admin-secure-access-7x24/activity-log" className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                            View Full Logs <ArrowRight size={16} />
                        </Link>
                    </div>


                    {/* Live Map Visualization */}
                    <div className="mb-8">
                        <ActivityMap activityData={data.recentActivity} />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="p-4">Time</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Event</th>
                                    <th className="p-4">Details</th>
                                    <th className="p-4">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {data.recentActivity?.map((log, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {log.userId ? (
                                                <div className="flex flex-col">
                                                    <span>{log.userId.firstName} {log.userId.lastName}</span>
                                                    <span className="text-xs text-gray-400 font-normal">{log.userId.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Guest</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${log.eventType === 'VIEW_PRODUCT' ? 'bg-blue-50 text-blue-600' :
                                                    log.eventType === 'SEARCH' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {log.eventType.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate">
                                            {log.eventType === 'VIEW_PRODUCT' && log.productId ? (
                                                <span className="flex items-center gap-2">
                                                    <img src={log.productId.image} className="w-6 h-6 rounded object-contain bg-gray-100" />
                                                    {log.productId.name}
                                                </span>
                                            ) : log.eventType === 'SEARCH' ? (
                                                `Query: "${log.metadata?.query}"`
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-gray-500">
                                            <div>{log.ipAddress || 'Unknown'}</div>
                                            {log.location?.lat && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${log.location.lat},${log.location.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] text-blue-500 mt-1 hover:underline block"
                                                >
                                                    📍 {log.location.lat.toFixed(4)}, {log.location.lng.toFixed(4)}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!data.recentActivity || data.recentActivity.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400 italic">No recent activity recorded</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default AnalyticsDashboard;
