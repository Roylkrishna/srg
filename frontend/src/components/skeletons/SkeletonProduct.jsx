import React from 'react';

const SkeletonProduct = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-[4/5] w-full bg-gray-200"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-8"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProduct;
