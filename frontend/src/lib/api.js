import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Important for cookies
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Force logout on auth failure
            // Note: We avoid direct store import to prevent circular dependencies if possible,
            // or we use a custom event/redirect-logic.
            // For now, redirecting to login is a robust standard.
            // Force logout on auth failure, but ignore the initial auth check
            // which is expected to fail if the user is not logged in.
            const isAuthCheck = error.config.url.endsWith('/auth/check');
            if (!isAuthCheck && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
