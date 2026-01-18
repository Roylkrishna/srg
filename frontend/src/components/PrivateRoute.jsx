import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (location.pathname.startsWith('/admin')) {
        const allowedRoles = ['owner', 'manager', 'admin', 'editor'];
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
