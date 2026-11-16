import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LeafIcon, 
  SearchIcon, 
  HeartIcon, 
  BagIcon, 
  UserIcon, 
  MenuIcon, 
  XIcon, 
  SparklesIcon, 
  CameraIcon 
} from '../Icons';
import AiPlantScannerModal from './AiPlantScannerModal';

export default function Navbar() {
  const { cartCount, wishlistCount, user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiScannerOpen, setAiScannerOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5efe3] transition-all w-full shadow-xs">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1e4d2b] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <LeafIcon className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#1b3a24]">
            Green<span className="text-[#2e7d32]">Nest</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#1e4d2b] relative py-1 ${
                  isActive ? 'text-[#1e4d2b] font-semibold' : 'text-gray-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d2b] rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}

        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* AI Plant Scan Trigger */}
          <button
            onClick={() => setAiScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#1e4d2b] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            title="AI Plant Identification & Care Scanner (Free)"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">AI Scan</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-700 hover:text-[#1e4d2b] hover:bg-[#f2f7f1] rounded-full transition-colors relative"
            title="Search plants"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="p-2 text-gray-700 hover:text-[#1e4d2b] hover:bg-[#f2f7f1] rounded-full transition-colors relative"
            title="Wishlist"
          >
            <HeartIcon className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#e05353] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="p-2 text-gray-700 hover:text-[#1e4d2b] hover:bg-[#f2f7f1] rounded-full transition-colors relative"
            title="Shopping Cart"
          >
            <BagIcon className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#1e4d2b] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Profile */}
          <Link
            to={user && user.isLoggedIn ? "/account" : "/login"}
            className="p-2 text-gray-700 hover:text-[#1e4d2b] hover:bg-[#f2f7f1] rounded-full transition-colors relative"
            title={user && user.isLoggedIn ? `Account (${user.name})` : "Sign In"}
          >
            <UserIcon className="w-5 h-5" />
            {user && user.isLoggedIn && (
              <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
            )}
          </Link>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#1e4d2b] rounded-lg"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="bg-[#f7faf7] border-t border-[#e2ede0] px-4 sm:px-6 lg:px-8 py-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search indoor plants, succulents, monstera..."
                autoFocus
                className="w-full pl-11 pr-32 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e4d2b] bg-white text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setAiScannerOpen(true);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#1e4d2b] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                title="Identify by photo"
              >
                <CameraIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scan Photo</span>
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#1e4d2b] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#163b21] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e5efe3] px-5 py-4 space-y-3">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setAiScannerOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 text-sm font-extrabold text-[#1e4d2b] py-2.5 bg-emerald-50 hover:bg-emerald-100 px-3 rounded-xl border border-emerald-200 transition-colors shadow-2xs"
          >
            <SparklesIcon className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>AI Plant Scanner (100% Free)</span>
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-gray-800 hover:text-[#1e4d2b] py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-[#1e4d2b]"
            >
              Account / Sign In
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium bg-[#1e4d2b] text-white px-3 py-1.5 rounded-full"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      )}

      {/* AI Plant Scanner Modal */}
      <AiPlantScannerModal 
        isOpen={aiScannerOpen} 
        onClose={() => setAiScannerOpen(false)} 
      />
    </header>
  );
}
