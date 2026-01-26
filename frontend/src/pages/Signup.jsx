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
        if (loading) return;
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
