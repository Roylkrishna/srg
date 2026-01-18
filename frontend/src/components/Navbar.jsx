import React, { useState } from 'react';
import { Search, User, Menu, X, Gift, LogOut, Shield, Edit, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { searchProducts, clearSearchResults } from '../redux/slices/productSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    const { user } = useSelector((state) => state.auth);
    const { searchResults, searchLoading } = useSelector((state) => state.products);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsOpen(false);
        setDropdownOpen(false);
    };

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle click outside dropdown
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search logic
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                dispatch(searchProducts(searchQuery));
            } else {
                dispatch(clearSearchResults());
            }
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    return (
        <nav className={cn(
            "fixed w-full z-50 transition-all duration-500",
            scrolled ? "glass-nav py-3" : "bg-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <img src="/logo.png" alt="SRG" className="h-12 w-auto object-contain relative z-10" />
                            <div className="absolute inset-0 bg-royal-gold/20 blur-xl rounded-full group-hover:bg-royal-gold/40 transition-colors"></div>
                        </div>
                        <span className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
                            Shree Rama<span className="text-royal-red">.</span>
                        </span>
                    </Link>


                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="relative group/search">
                            <div className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 border border-gray-200 shadow-md hover:shadow-lg focus-within:border-royal-red focus-within:ring-4 focus-within:ring-royal-red/10 transition-all w-48 lg:w-72 group">
                                <Search className="text-gray-400 group-focus-within:text-royal-red transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search treasures..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-full font-medium"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchQuery.length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full mt-4 -right-20 w-[400px] glass-card rounded-2xl shadow-premium overflow-hidden z-[60]"
                                    >
                                        <div className="p-4 border-b border-gray-100/50 bg-gray-50/50 flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Results</span>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    document.getElementById('product-collection')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="text-[10px] font-black uppercase tracking-widest text-royal-red hover:underline"
                                            >
                                                View All
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {searchLoading ? (
                                                <div className="p-10 flex justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-royal-red"></div>
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <div className="divide-y divide-gray-50">
                                                    {searchResults.map(product => (
                                                        <Link
                                                            key={product._id}
                                                            to={`/product/${product._id}`}
                                                            onClick={() => setSearchQuery('')}
                                                            className="flex items-center gap-4 p-4 hover:bg-royal-red/5 transition-colors group"
                                                        >
                                                            <div className="h-12 w-12 rounded-xl bg-gift-cream overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={product.images?.[0] || product.image}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-contain p-1"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-royal-red transition-colors">{product.name}</p>
                                                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{product.category?.name || 'Handcrafted'}</p>
                                                            </div>
                                                            <div className="text-sm font-black text-gray-900">₹{product.price}</div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <p className="text-xs text-gray-400 font-serif italic">No treasures found for "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 group focus:outline-none"
                                >
                                    <div className="h-10 w-10 rounded-full border-2 border-white shadow-premium group-hover:border-royal-red transition-all p-0.5 overflow-hidden">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full rounded-full bg-red-50 text-royal-red flex items-center justify-center font-bold text-xs uppercase">
                                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-72 glass-card rounded-2xl shadow-premium py-3 animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100/50 mb-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-gray-500 truncate mb-2">{user.email}</p>
                                            <span className="px-2 py-0.5 rounded-full bg-royal-red/10 text-royal-red text-[10px] font-black uppercase tracking-wider">
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="space-y-1 px-2">
                                            <DropdownLink to="/dashboard" onClick={() => setDropdownOpen(false)} icon={<User size={16} />} text="Profile" />
                                            <DropdownLink to="/wishlist" onClick={() => setDropdownOpen(false)} icon={<Heart size={16} />} text="Wishlist" />
                                            {user.role !== 'user' && (
                                                <DropdownLink to="/admin" onClick={() => setDropdownOpen(false)} icon={<Shield size={16} />} text="Admin Portal" />
                                            )}
                                        </div>
                                        <div className="h-px bg-gray-100/50 my-2"></div>
                                        <div className="px-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-royal-red hover:bg-red-50 rounded-xl transition-all font-semibold"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-2.5 bg-royal-red text-white rounded-full text-sm font-bold hover:bg-royal-black transition-all shadow-lg shadow-red-200">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 hover:text-royal-red transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-nav absolute w-full animate-in slide-in-from-top-4 duration-300 border-b border-gray-100/50">
                    <div className="px-4 py-8 space-y-6">
                        {user && (
                            <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                                <div className="h-12 w-12 rounded-full gold-gradient shadow-lg flex items-center justify-center text-white font-bold text-lg">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100/50 flex flex-col gap-4">
                            {!user ? (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-royal-red text-white py-4 rounded-xl text-center font-bold shadow-xl shadow-red-100"
                                >
                                    Get Started
                                </Link>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-gray-50 text-royal-red py-4 rounded-xl text-center font-bold flex items-center justify-center gap-2"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const DropdownLink = ({ to, onClick, icon, text }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all group"
    >
        <div className="text-gray-400 group-hover:text-royal-red transition-colors">{icon}</div>
        <span className="font-medium group-hover:text-gray-900 transition-colors">{text}</span>
    </Link>
);

export default Navbar;
