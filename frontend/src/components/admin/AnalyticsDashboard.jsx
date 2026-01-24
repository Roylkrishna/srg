import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Package, Search, TrendingUp, AlertCircle } from 'lucide-react';

const AnalyticsDashboard = ({ data, loading }) => {

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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Performance metrics and user engagement insights (Last 30 Days)
                    </p>
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

                    <div className="h-[300px] w-full">
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

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
