import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { CheckIcon, MapPinIcon, TruckIcon } from './Icons';

export default function PaymentSuccess() {
  const location = useLocation();
  const { clearCart } = useApp();

  // Clear cart upon successful order
  useEffect(() => {
    clearCart(true);
  }, []);

  const order = location.state?.order;
  const orderId = order?.orderId || '#GN2026101';
  const items = order?.items || [
    {
      id: 2,
      name: 'Monstera Deliciosa',
      price: 27.99,
      quantity: 1,
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Monstera_deliciosa2.jpg/330px-Monstera_deliciosa2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail'
    }
  ];
  const subtotal = order?.subtotal ?? 27.99;
  const shippingFee = order?.shippingFee ?? 0.00;
  const total = order?.total ?? (subtotal + shippingFee);
  const deliveryType = order?.deliveryType || 'standard';
  const customer = order?.customer;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4 relative">
        {/* Decorative corner plant leaves matching Screen 06 */}
        <div className="absolute bottom-0 left-6 sm:left-12 pointer-events-none opacity-40 lg:opacity-80">
          <img
            src="https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=300&q=80"
            alt="Botanical corner"
            className="w-36 sm:w-48 h-auto object-contain -rotate-6 filter drop-shadow-md"
          />
        </div>
        <div className="absolute bottom-0 right-6 sm:right-12 pointer-events-none opacity-40 lg:opacity-80">
          <img
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=300&q=80"
            alt="Botanical corner"
            className="w-36 sm:w-48 h-auto object-contain rotate-6 filter drop-shadow-md"
          />
        </div>

        {/* Central Success Card matching Screen 06 */}
        <div className="relative z-10 bg-white rounded-3xl border border-[#e2ece0] p-6 sm:p-10 shadow-xl max-w-xl w-full text-center">
          {/* Big Green Circle Checkmark matching Screen 06 */}
          <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#34a853] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/30 ring-8 ring-emerald-50">
            <CheckIcon className="w-9 h-9 sm:w-11 sm:h-11 stroke-[3]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142e1b] tracking-tight">
            Payment Successful!
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
            Your nursery order has been placed successfully.
          </p>

          <div className="my-5 inline-block bg-emerald-50 border border-emerald-200/80 rounded-xl px-5 py-2">
            <span className="text-xs text-gray-500 font-medium">Order ID: </span>
            <span className="text-sm font-bold text-[#1e4d2b] tracking-wider">{orderId}</span>
          </div>

          {/* Receipt Breakdown matching Screen 06 */}
          <div className="bg-[#f9fbf9] rounded-2xl border border-emerald-100 p-4 sm:p-5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/70 text-xs font-bold text-gray-800">
              <span>Receipt Breakdown</span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                {deliveryType === 'express' ? 'Priority Transit' : 'Standard Eco Delivery'}
              </span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 leading-snug">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-800">
                    ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery address destination */}
            {customer && customer.address && (
              <div className="pt-2 border-t border-gray-200/60 flex items-start gap-2 text-[11px] text-gray-600">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  Deliver to: {customer.fullName || ''}, {customer.address}, {customer.city}
                </span>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-medium">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#1e4d2b] pt-1 border-t border-gray-200">
                <span>Total Paid</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
            A confirmation receipt and tracking code have been dispatched to your email address. Our nursery team is carefully preparing your botanical companions!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white px-8 py-3 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/15"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-full font-semibold text-xs transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
