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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {['Home', 'Shop', 'About Us', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                className="text-gray-600 hover:text-royal-red font-medium transition-all duration-300 relative group text-sm uppercase tracking-widest"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-royal-red transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-0 group-hover:w-40 focus:w-40 transition-all duration-500 border-none bg-gray-100/50 rounded-full outline-none text-xs px-0 group-hover:px-4 focus:px-4 py-2 text-gray-700 placeholder-gray-400 backdrop-blur-sm"
                            />
                            <Search className="text-gray-600 group-hover:text-royal-red cursor-pointer transition-colors" size={18} />
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
                        <div className="flex flex-col gap-4 px-2">
                            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-serif font-bold text-gray-800 hover:text-royal-red transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

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
