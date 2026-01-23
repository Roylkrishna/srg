import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', username: '', password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.auth);

    const suggestions = ['gift_lover', 'gift_master_23', 'shree_rama_fan']; // Still mock for now, can be connected to API later

    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true });
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };


    return (
        <div className="min-h-screen flex bg-gift-cream">
            {/* Right Side - Image/Decor (Swapped for variety) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="bg-gift-red p-2 rounded-full text-white group-hover:bg-gift-dark-red transition-colors">
                                <Gift size={24} />
                            </div>
                            <span className="font-serif text-2xl font-bold text-gray-800">
                                Shree Rama<span className="text-gift-red">.</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gift-red">Create account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="font-medium text-gift-red hover:underline">Sign in</Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gift-red focus:border-gift-red" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gift-red focus:border-gift-red" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gift-red focus:border-gift-red" />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gift-red focus:border-gift-red"
                            />
                            {/* Suggestion Chips Mock */}
                            {formData.username.length > 3 && (
                                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                    <span className="text-gray-500">Suggestions:</span>
                                    {suggestions.map(sug => (
                                        <button key={sug} type="button" onClick={() => setFormData({ ...formData, username: sug })} className="px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-200 hover:bg-green-100 transition-colors">
                                            {sug}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gift-red focus:border-gift-red pr-12"
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

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50">
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign up with Google
                        </button>
                    </form>
                </div>
            </div>

            {/* Left Side - Image/Decor */}
            <div className="hidden lg:flex w-1/2 bg-gift-gold items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 text-center text-white px-12">
                    <h2 className="text-4xl font-serif font-bold mb-4">Join the Family</h2>
                    <p className="text-lg text-white/90">
                        "Create an account to track orders, save your wishlist, and get exclusive rewards."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
