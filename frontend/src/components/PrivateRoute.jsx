import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (location.pathname.startsWith('/admin')) {
        const allowedRoles = ['owner', 'manager', 'admin', 'editor'];
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default PrivateRoute;
