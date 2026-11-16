import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LeafIcon, MailIcon, MapPinIcon } from '../Icons';
import { useApp } from '../context/AppContext';
import { validateEmail } from '../utils/validation';

export default function Footer() {
  const { showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const err = validateEmail(newsletterEmail);
    if (err) {
      setError(err);
      if (showToast) showToast(err, 'error');
      return;
    }
    setError('');
    setSubscribed(true);
    showToast('Subscribed to Green Club! 15% discount code sent to your inbox.', 'success');
    setNewsletterEmail('');
  };
  return (
    <footer className="bg-[#12281a] text-gray-300 pt-16 pb-8 border-t border-[#1e3c28] w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Top brand & newsletter row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2e7d32] flex items-center justify-center text-white">
                <LeafIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Green<span className="text-emerald-400">Nest</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bringing vibrant living greenery into modern homes. Premium sustainably nurtured plants delivered directly to your doorstep.
            </p>
            <div className="text-xs text-emerald-300/90 flex flex-col gap-1.5 pt-2">
              <span className="flex items-center gap-2">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-400" /> 123 Green Street, Chennai, India
              </span>
              <span className="flex items-center gap-2">
                <MailIcon className="w-3.5 h-3.5 text-emerald-400" /> support@greennest.com
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-emerald-300 transition-colors">Plant Collection</Link></li>
              <li><Link to="/about" className="hover:text-emerald-300 transition-colors">About Us</Link></li>
              <li><Link to="/wishlist" className="hover:text-emerald-300 transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-300 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-300 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Plant Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=air-purifying" className="hover:text-emerald-300 transition-colors">Indoor Air Purifiers</Link></li>
              <li><Link to="/shop?category=succulents" className="hover:text-emerald-300 transition-colors">Succulents & Cacti</Link></li>
              <li><Link to="/shop?category=pet-friendly" className="hover:text-emerald-300 transition-colors">Pet-Friendly Greenery</Link></li>
              <li><Link to="/shop?category=flowering" className="hover:text-emerald-300 transition-colors">Flowering Beauties</Link></li>
              <li><Link to="/shop?category=indoor" className="hover:text-emerald-300 transition-colors">Indoor Plants</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Join Green Club</h4>
            <p className="text-xs text-gray-400 mb-3">
              Get weekly plant care advice and 15% off your first nursery order.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-emerald-400">✓ Welcome to Green Club!</p>
                <p className="text-[11px] text-gray-400 mt-1">Check your inbox for 15% off code.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 bg-emerald-950/60 border rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    error ? 'border-red-400 focus:border-red-400' : 'border-emerald-800/60 focus:border-emerald-500'
                  }`}
                />
                {error && (
                  <p className="text-[11px] text-red-400 font-medium">⚠️ {error}</p>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#2e7d32] hover:bg-[#256829] text-white py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} GreenNest Plants Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-emerald-300">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-emerald-300">Terms of Service</Link>
            <Link to="/faq" className="hover:text-emerald-300">Plant FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
