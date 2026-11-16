import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { TrashIcon, ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon, LeafIcon } from './Icons';

export default function ShoppingCart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal, shippingFee, cartTotal } = useApp();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'GREEN10' || promoCode.trim().toUpperCase() === 'GREENNEST') {
      const disc = Number((cartSubtotal * 0.1).toFixed(2));
      setDiscountAmount(disc);
      setCouponSuccess(`Coupon applied! Saved $${disc.toFixed(2)} (10% OFF)`);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try GREEN10 for 10% off.');
      setCouponSuccess('');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Header matching Screen 04 */}
          <div className="flex items-center justify-between pb-6 border-b border-[#e2ece0] mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142e1b]">
              Your Cart{' '}
              <span className="text-lg font-normal text-gray-500">
                ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)
              </span>
            </h1>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart items list */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-[#e2ece0] p-6 shadow-sm divide-y divide-gray-100">
                  {cart.filter(item => item && item.id).map((item) => (
                    <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Image + Info */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link to={`/plants/${item.id}`} className="w-20 h-20 bg-[#f4f7f4] rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link to={`/plants/${item.id}`} className="font-bold text-gray-900 hover:text-[#1e4d2b] text-base transition-colors">
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                          <p className="text-sm font-extrabold text-[#1e4d2b] mt-1">
                            ${(Number(item.price) || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper + Trash */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100 text-sm shadow-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-800">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100 text-sm shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-extrabold text-gray-900 text-sm">
                            ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove plant"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to shopping link matching Screen 04 */}
                <div className="pt-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e4d2b] hover:underline"
                  >
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary card matching Screen 04 */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-[#e2ece0] p-6 shadow-sm sticky top-24 space-y-6">
                  <h3 className="font-bold text-gray-900 text-base">Order Summary</h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-900">${cartSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-700">
                        {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount (GREEN10)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-gray-900">Total</span>
                      <span className="text-xl font-extrabold text-[#1e4d2b]">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Promo code field */}
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. GREEN10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase font-medium focus:outline-none focus:border-[#1e4d2b]"
                      />
                      <button
                        type="submit"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-xl text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
                    {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
                  </form>

                  {/* Checkout Button matching Screen 04 */}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
                    <span>Safe & Secure 256-Bit Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#e2ece0] p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
                <LeafIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-xs text-gray-500 mb-6">
                Looks like you haven't added any green companions yet. Browse our lush plant catalog!
              </p>
              <Link
                to="/shop"
                className="bg-[#1e4d2b] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#163b21] inline-flex items-center gap-2"
              >
                Browse Plants
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
