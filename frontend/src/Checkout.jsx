import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { ShieldCheckIcon, LeafIcon, ArrowRightIcon } from './Icons';
import { validateEmail, validateName, validatePhone, validatePinCode, validateRequired } from './utils/validation';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, shippingFee, cartTotal, user, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pinCode: user?.pinCode || '',
    deliveryType: 'standard'
  });
  const [errors, setErrors] = useState({});

  const isExpress = formData.deliveryType === 'express';
  const effectiveShipping = shippingFee + (isExpress ? 4.99 : 0);
  const finalTotal = cartSubtotal + effectiveShipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    const nameErr = validateName(formData.fullName, 'Full name');
    if (nameErr) errs.fullName = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errs.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) errs.phone = phoneErr;

    const addressErr = validateRequired(formData.address, 'Street address', 5);
    if (addressErr) errs.address = addressErr;

    const cityErr = validateRequired(formData.city, 'City', 2);
    if (cityErr) errs.city = cityErr;

    const pinErr = validatePinCode(formData.pinCode, 'PIN code');
    if (pinErr) errs.pinCode = pinErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      navigate('/cart');
      return;
    }

    if (!validateForm()) {
      if (showToast) showToast('Please correct the highlighted errors before continuing.', 'error');
      return;
    }
    const orderId = '#GN' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee: effectiveShipping,
      deliveryType: formData.deliveryType,
      total: finalTotal,
      customer: { ...formData }
    };
    try {
      const stored = JSON.parse(localStorage.getItem('greennest_orders') || '[]');
      localStorage.setItem('greennest_orders', JSON.stringify([orderData, ...stored]));
    } catch { /* ignore */ }
    navigate('/payment-success', { state: { order: orderData } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Progress Steps Header matching Screen 05 */}
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-200 -z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center bg-[#f7faf7] px-3">
                <div className="w-9 h-9 rounded-full bg-[#1e4d2b] text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100 shadow-sm">
                  1
                </div>
                <span className="text-xs font-bold text-[#1e4d2b] mt-1.5">Shipping</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center bg-[#f7faf7] px-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1e4d2b] flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-xs font-medium text-gray-500 mt-1.5">Payment</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center bg-[#f7faf7] px-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1e4d2b] flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-xs font-medium text-gray-500 mt-1.5">Review</span>
              </div>
            </div>
          </div>

          {(!cart || cart.length === 0) ? (
            <div className="bg-white rounded-3xl border border-[#e2ece0] p-12 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Items to Checkout</h2>
              <p className="text-xs text-gray-500 mb-6">
                Your cart is currently empty. Please choose plants before proceeding to checkout.
              </p>
              <Link
                to="/shop"
                className="bg-[#1e4d2b] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#163b21] inline-flex items-center gap-2"
              >
                Browse Plant Shop
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Shipping Address Form matching Screen 05 */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2ece0] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the destination where your healthy potted plants will be delivered.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Hariharan S"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Address (Street / Door No.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Green Street, Green Valley"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.address
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Chennai"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
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
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="600001"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.pinCode
                          ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                      }`}
                    />
                    {errors.pinCode && (
                      <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.pinCode}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Option */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Delivery Speed
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3.5 border-2 rounded-2xl cursor-pointer border-[#1e4d2b] bg-emerald-50/50">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="standard"
                        checked={formData.deliveryType === 'standard'}
                        onChange={handleChange}
                        className="accent-[#1e4d2b]"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">Standard Eco Delivery</p>
                        <p className="text-[11px] text-gray-500">2 - 4 Business Days • Free</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer border-gray-200 hover:border-gray-300">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="express"
                        checked={formData.deliveryType === 'express'}
                        onChange={handleChange}
                        className="accent-[#1e4d2b]"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">Priority Nursery Transit</p>
                        <p className="text-[11px] text-gray-500">Next Day Safe Transport • +$4.99</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary matching Screen 05 */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-[#e2ece0] p-6 shadow-sm sticky top-24 space-y-6">
                  <h3 className="font-bold text-gray-900 text-base">Order Summary</h3>

                  {/* Items Preview */}
                  <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-xs text-gray-900">{item.name}</p>
                            <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown matching Screen 05 */}
                  <div className="space-y-2.5 text-xs pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-700">
                        {effectiveShipping === 0 ? '$0.00 (Free)' : `$${effectiveShipping.toFixed(2)}${isExpress ? ' (Express)' : ''}`}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-gray-900">Total</span>
                      <span className="text-xl font-extrabold text-[#1e4d2b]">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Continue to Payment button matching Screen 05 */}
                  <button
                    type="submit"
                    className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10"
                  >
                    Continue to Payment
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
                    <span>Safe & Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
