import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LeafIcon, 
  XIcon, 
  ArrowRightIcon,
  SproutIcon,
  PottedPlantIcon,
  MonsteraLeafIcon,
  FlowerIcon,
  WateringCanIcon,
  GreenhouseIcon,
  PlantCartIcon,
  PlantPackageIcon,
  PlantKeyIcon,
  HeartIcon,
  SearchIcon,
  MailIcon
} from '../Icons';

export default function FloatingScreenSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const screens = [
    { name: 'Home Page', path: '/', icon: SproutIcon, color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Plant Shop / Catalog', path: '/shop', icon: PottedPlantIcon, color: 'bg-teal-100 text-teal-800' },
    { name: 'Product Details', path: '/plants/monstera-deliciosa', icon: MonsteraLeafIcon, color: 'bg-green-100 text-green-800' },
    { name: 'Shopping Cart', path: '/cart', icon: PlantCartIcon, color: 'bg-lime-100 text-lime-800' },
    { name: 'Checkout', path: '/checkout', icon: PlantPackageIcon, color: 'bg-amber-100 text-amber-800' },
    { name: 'Payment Success', path: '/payment-success', icon: FlowerIcon, color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Login', path: '/login', icon: PlantKeyIcon, color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Sign Up', path: '/signup', icon: LeafIcon, color: 'bg-green-100 text-green-700' },
    { name: 'Forgot Password', path: '/forgot-password', icon: MailIcon, color: 'bg-teal-100 text-teal-700' },
    { name: 'About Us', path: '/about', icon: GreenhouseIcon, color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Contact Us', path: '/contact', icon: WateringCanIcon, color: 'bg-teal-100 text-teal-800' },
    { name: 'Wishlist', path: '/wishlist', icon: HeartIcon, color: 'bg-rose-100 text-rose-700' },
    { name: 'Search Results', path: '/search?q=monstera', icon: SearchIcon, color: 'bg-green-100 text-green-800' },
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* Subtle Floating Button in bottom-right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group bg-[#1e4d2b] hover:bg-[#163b21] text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl border border-emerald-500/30 flex items-center gap-2.5 text-xs font-semibold hover:scale-105 active:scale-95 transition-all"
            title="Open Screen Switcher"
          >
            <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <LeafIcon className="w-3.5 h-3.5" />
            </span>
            <span>Explore Screens</span>
            <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full">
              🌿 13
            </span>
          </button>
        ) : null}
      </div>

      {/* Slide-over Drawer / Modal for quick screen switching */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-l border-emerald-100">
            {/* Drawer Header */}
            <div className="p-4 bg-[#142e1b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2e7d32] flex items-center justify-center text-white">
                  <LeafIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">GreenNest Screens</h3>
                  <p className="text-[11px] text-emerald-300">Tap any screen to visit</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Link to All-in-One Showcase Board */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-100">
              <Link
                to="/screens"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <GreenhouseIcon className="w-4 h-4" />
                <span>View All 13 Screens Board</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List of Screens - Numbers removed, replaced with botanical plant icons! */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-gray-50">
              {screens.map((s) => {
                const IconComponent = s.icon;
                const isActive =
                  currentPath === s.path ||
                  (s.path.startsWith('/plants/') && currentPath.startsWith('/plants/')) ||
                  (s.path.startsWith('/search') && currentPath.startsWith('/search'));

                return (
                  <button
                    key={s.name}
                    onClick={() => {
                      navigate(s.path);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-emerald-100/90 text-[#142e1b] font-bold border border-emerald-300 shadow-xs'
                        : 'text-gray-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Botanical Plant Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isActive ? 'bg-[#1e4d2b] text-white shadow-xs scale-105' : s.color
                      }`}>
                        <IconComponent className="w-4 h-4" filled={s.name === 'Wishlist' && isActive} />
                      </div>
                      <span className="text-xs">{s.name}</span>
                    </div>

                    {isActive && (
                      <span className="text-[10px] bg-[#1e4d2b] text-white font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
