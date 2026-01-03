import React, { useState } from 'react';
import { Search, User, Menu, X, Gift, LogOut, Shield, Edit, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

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

    return (
        <nav className={cn("fixed w-full z-50 transition-all duration-300", scrolled ? "bg-white shadow-md" : "bg-transparent")}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="Shree Rama Gift Center" className="h-12 w-auto object-contain" />
                        <span className="font-serif text-2xl font-bold text-gray-800 tracking-wide">
                            Shree Rama<span className="text-red-600">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Home</Link>
                        <Link to="/shop" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Shop</Link>
                        <Link to="/about" className="text-gray-600 hover:text-red-600 font-medium transition-colors">About Us</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Contact</Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="relative group">
                            <input type="text" placeholder="Search gifts..." className="w-0 group-hover:w-48 focus:w-48 transition-all duration-300 border-b border-gray-300 focus:border-red-600 bg-transparent outline-none text-sm px-2 text-gray-600 placeholder-gray-400" />
                            <Search className="text-gray-600 group-hover:text-red-600 cursor-pointer transition-colors" size={20} />
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 group focus:outline-none"
                                >
                                    <div className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-red-600 transition-all p-0.5">
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm uppercase">
                                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="hidden lg:block font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                                        {user.firstName}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            <div className="mt-1 inline-block px-2 py-0.5 rounded bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                {user.role}
                                            </div>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <User size={18} /> See Profile
                                        </Link>
                                        <Link
                                            to="/dashboard?edit=true"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Edit size={18} /> Edit Profile
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Heart size={18} /> My Wishlist
                                        </Link>
                                        {user.role !== 'user' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <Shield size={18} /> Admin Panel
                                            </Link>
                                        )}
                                        <div className="h-px bg-gray-50 my-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium border-none outline-none text-left"
                                        >
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium">
                                <User size={20} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-red-600">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 absolute w-full animate-in slide-in-from-top-4 duration-200">
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        {user && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-2">
                                <div className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg">Home</Link>
                        <Link to="/shop" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg">Shop</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg">About</Link>

                        {user && (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg border-t border-gray-50 pt-2 flex items-center gap-2"><User size={20} /> My Profile</Link>
                                <Link to="/wishlist" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg flex items-center gap-2"><Heart size={20} /> My Wishlist</Link>
                                <Link to="/dashboard?edit=true" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg flex items-center gap-2"><Edit size={20} /> Edit Profile</Link>
                                {user.role !== 'user' && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium text-lg flex items-center gap-2"><Shield size={20} /> Admin Panel</Link>
                                )}
                            </>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                                <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                            </div>
                            {user ? (
                                <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-lg text-center font-bold flex items-center justify-center gap-2 transition-colors">
                                    <LogOut size={20} /> Sign Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full bg-red-600 text-white py-3 rounded-lg text-center font-medium shadow-lg shadow-red-200">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
