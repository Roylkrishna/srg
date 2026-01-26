import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import api from '../lib/api';

const Login = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [captchaToken, setCaptchaToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            if (user.role === 'owner') {
                navigate('/admin-secure-access-7x24', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [captchaSvg, setCaptchaSvg] = useState('');

    const captchaFetchedRef = useRef(false);

    useEffect(() => {
        if (!captchaFetchedRef.current) {
            fetchCaptcha();
            captchaFetchedRef.current = true;
        }
    }, []);

    const fetchCaptcha = async () => {
        try {
            const response = await api.get('/auth/captcha');
            setCaptchaSvg(response.data);
            setCaptchaToken(''); // Reset input
        } catch (error) {
            console.error("Failed to fetch captcha", error);
        }
    };

    const handleCaptchaChange = (e) => {
        setCaptchaToken(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        if (!captchaToken) {
            alert("Please enter the captcha.");
            return;
        }
        dispatch(loginUser({ ...formData, captchaToken }));
    };

    return (
        <div className="min-h-screen flex bg-gift-cream">
            {/* Left Side - Image/Decor */}
            <div className="hidden lg:flex w-1/2 bg-red-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 text-center text-white px-12">
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                        <h2 className="text-4xl font-serif font-bold mb-4">Welcome Back!</h2>
                        <p className="text-lg text-white/90">
                            "Gifts are the language of love. Log in to continue spreading joy."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="bg-red-600 p-2 rounded-full text-white group-hover:bg-red-700 transition-colors">
                                <Gift size={24} />
                            </div>
                            <span className="font-serif text-2xl font-bold text-gray-800">
                                Shree Rama<span className="text-red-600">.</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-800 underline">create a new account</Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email or Username</label>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600 transition-colors pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="block text-sm font-medium text-gray-700">Type the characters below</label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 w-40 flex items-center justify-center p-2"
                                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                                />
                                <button
                                    type="button"
                                    onClick={fetchCaptcha}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Refresh Captcha"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={captchaToken || ''}
                                onChange={handleCaptchaChange}
                                placeholder="Enter captcha"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-600 focus:border-red-600 transition-colors"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-red-600 hover:underline">Forgot your password?</Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50">
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
