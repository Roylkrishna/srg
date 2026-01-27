import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProductEdit from './pages/ProductEdit';
import UserDetail from './pages/UserDetail';
import Wishlist from './pages/Wishlist';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ActivityLog from './pages/ActivityLog';

import Footer from './components/Footer';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { fetchAllCategories } from './redux/slices/categorySlice';
import { fetchContact } from './redux/slices/contactSlice';

// Helper to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchAllCategories());
    dispatch(fetchContact());

    // Listen for logout in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'logout') {
        dispatch({ type: 'auth/logout' });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthWrapper>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-secure-access-7x24"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-secure-access-7x24/edit-product/:id"
              element={
                <AdminRoute>
                  <ProductEdit />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-secure-access-7x24/user/:id"
              element={
                <AdminRoute>
                  <UserDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/admin-secure-access-7x24/activity-log"
              element={
                <AdminRoute>
                  <ActivityLog />
                </AdminRoute>
              }
            />
          </Routes>
          <Footer />
        </AuthWrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
