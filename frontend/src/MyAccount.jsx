import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { updateUserProfile } from '../services/authService';
import { 
  MapPinIcon, 
  BagIcon, 
  UserIcon, 
  EditIcon, 
  XIcon, 
  CheckIcon 
} from './Icons';
import { validateName, validatePhone, validatePinCode, validateRequired } from './utils/validation';

export default function MyAccount() {
  const { user, setUser, logout, showToast } = useApp();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('greennest_orders');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return [];
  });

  // Address & Profile Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPinCode, setFormPinCode] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormName(user.name || '');
      setFormPhone(user.phone || '');
      setFormAddress(user.address || '');
      setFormCity(user.city || '');
      setFormState(user.state || '');
      setFormPinCode(user.pinCode || '');
    }
  }, [user]);

  if (!user || !user.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7faf7] w-full">
        <Navbar />

        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ece0] p-8 text-center shadow-md">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign In to Your Account</h2>
            <p className="text-xs text-gray-500 mt-2">
              Sign in to manage your orders, wishlist, and plant delivery address.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] text-white py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl text-xs font-semibold border border-gray-200 transition-colors"
              >
                Create Client Account
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const hasAddress = Boolean(user.address && user.address.trim());

  const validateForm = () => {
    const errs = {};
    const nameErr = validateName(formName, 'Full name');
    if (nameErr) errs.name = nameErr;

    const phoneErr = validatePhone(formPhone, true);
    if (phoneErr) errs.phone = phoneErr;

    const addressErr = validateRequired(formAddress, 'Street address', 5);
    if (addressErr) errs.address = addressErr;

    const cityErr = validateRequired(formCity, 'City', 2);
    if (cityErr) errs.city = cityErr;

    const stateErr = validateRequired(formState, 'State', 2);
    if (stateErr) errs.state = stateErr;

    const pinErr = validatePinCode(formPinCode, 'PIN code');
    if (pinErr) errs.pinCode = pinErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in your profile information', 'error');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateUserProfile({
        name: formName.trim() || user.name,
        phone: formPhone.trim(),
        address: formAddress.trim(),
        city: formCity.trim(),
        state: formState.trim(),
        pinCode: formPinCode.trim()
      });
      setUser(updated);
      showToast('Profile and address updated successfully!', 'success');
      setIsEditingAddress(false);
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] w-full">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="bg-white rounded-3xl border border-[#e2ece0] p-8 sm:p-12 shadow-sm space-y-8 w-full max-w-5xl mx-auto">
            
            {/* Header: User Profile Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm bg-emerald-100 text-[#1e4d2b]">
                  {(user.name || 'User').charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-[#1e4d2b] px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <UserIcon className="w-3 h-3" />
                      GreenNest Member
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Sign Out Button */}
              <div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Shipping Address Card with Edit / Add Prompt */}
              {hasAddress ? (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-[#1e4d2b]" />
                        Delivery & Shipping Address
                      </h3>
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e4d2b] hover:text-[#163b21] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                        title="Edit address"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                        <span>Edit Address</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      {user.address}<br />
                      {user.city}{user.state ? `, ${user.state}` : ''}{user.pinCode ? ` - ${user.pinCode}` : ''}<br />
                      <span className="text-gray-500 font-normal">Phone:</span> {user.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200/60 mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Default delivery destination</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckIcon className="w-3 h-3 text-emerald-600" /> Active
                    </span>
                  </div>
                </div>
              ) : (
                /* New User: Address Not Set -> Prompt to Add Profile Details */
                <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#1e4d2b] font-bold text-sm mb-2">
                      <MapPinIcon className="w-4.5 h-4.5 text-emerald-700" />
                      Add Profile & Delivery Details
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You haven't set up your delivery address yet. Add your address and phone number so you can receive plants directly at your doorstep!
                    </p>
                  </div>
                  
                  <div className="pt-5">
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="bg-[#1e4d2b] hover:bg-[#163b21] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <EditIcon className="w-3.5 h-3.5" />
                      Add Address Details
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Orders / Activity Card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <BagIcon className="w-4 h-4 text-[#1e4d2b]" />
                    Order Status & Activity
                  </h3>
                  {orders.length > 0 ? (
                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      {orders.map((ord, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200/80 text-xs flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1e4d2b]">{ord.orderId}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                Preparing
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {ord.date} • {ord.items?.length || 1} plant{(ord.items?.length || 1) > 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="font-extrabold text-gray-900">
                            ${(Number(ord.total) || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">
                      {user.ordersCount && user.ordersCount > 0 
                        ? `You have placed ${user.ordersCount} plant orders with GreenNest.` 
                        : 'You have no recent orders yet. Explore our fresh botanical collection!'}
                    </p>
                  )}
                </div>
                <div className="pt-4">
                  <Link
                    to="/shop"
                    className="text-xs font-semibold text-[#1e4d2b] hover:underline"
                  >
                    Browse Plants in Nursery →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <Link
                to="/shop"
                className="bg-[#1e4d2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#163b21]"
              >
                Continue Shopping
              </Link>
              <Link
                to="/wishlist"
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                View Wishlist
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile & Address Modal */}
      {isEditingAddress && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1e4d2b] flex items-center justify-center">
                  <EditIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {hasAddress ? 'Edit Delivery Address' : 'Add Profile & Address Details'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Provide shipping coordinates for botanical deliveries</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingAddress(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Your full name"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.phone}</p>
                )}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Street Address / House / Flat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formAddress}
                  onChange={(e) => {
                    setFormAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="e.g. 45 Green Avenue, Blossom Enclave"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.address
                      ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.address}</p>
                )}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => {
                      setFormCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    placeholder="e.g. Chennai"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      errors.city
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState}
                    onChange={(e) => {
                      setFormState(e.target.value);
                      if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
                    }}
                    placeholder="e.g. Tamil Nadu"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                      errors.state
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.state}</p>
                  )}
                </div>
              </div>

              {/* Pin Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  PIN / Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formPinCode}
                  onChange={(e) => {
                    setFormPinCode(e.target.value);
                    if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: '' }));
                  }}
                  placeholder="e.g. 600028"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    errors.pinCode
                      ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                  }`}
                />
                {errors.pinCode && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.pinCode}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1e4d2b] hover:bg-[#163b21] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
