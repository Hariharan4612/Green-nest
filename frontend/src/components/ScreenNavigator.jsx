import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ScreenNavigator() {
  const location = useLocation();
  const navigate = useNavigate();

  const screens = [
    { num: '01', name: 'Home Page', path: '/' },
    { num: '02', name: 'Plant Shop', path: '/shop' },
    { num: '03', name: 'Product Details', path: '/plants/monstera-deliciosa' },
    { num: '04', name: 'Shopping Cart', path: '/cart' },
    { num: '05', name: 'Checkout', path: '/checkout' },
    { num: '06', name: 'Payment Success', path: '/payment-success' },
    { num: '07', name: 'Login', path: '/login' },
    { num: '08', name: 'Sign Up', path: '/signup' },
    { num: '09', name: 'Forgot Password', path: '/forgot-password' },
    { num: '10', name: 'About Us', path: '/about' },
    { num: '11', name: 'Contact Us', path: '/contact' },
    { num: '12', name: 'Wishlist', path: '/wishlist' },
    { num: '13', name: 'Search Results', path: '/search?q=monstera' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="bg-[#0f2817] text-white border-b border-[#2d5a37] sticky top-0 z-50 shadow-md w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#2e7d32] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            Design System
          </span>
          <span className="font-semibold text-emerald-200 hidden sm:inline">
            GreenNest 13 Screens:
          </span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none flex-1 mx-3">
          {screens.map(s => {
            const isActive = currentPath === s.path || 
              (s.path.startsWith('/plants/') && currentPath.startsWith('/plants/')) ||
              (s.path.startsWith('/search') && currentPath.startsWith('/search'));
            return (
              <button
                key={s.num}
                onClick={() => navigate(s.path)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-white/30 font-semibold'
                    : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-emerald-700 text-white' : 'bg-black/30 text-emerald-400'}`}>
                  {s.num}
                </span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
