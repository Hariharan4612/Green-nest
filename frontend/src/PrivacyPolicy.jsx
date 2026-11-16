import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />
      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="text-3xl font-extrabold text-[#142e1b] mb-4">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-3xl border border-[#e2ece0] shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            At GreenNest, protecting your personal privacy is fundamental to our nursery community. We collect your delivery address and contact data strictly to fulfill plant orders and provide lifetime plant care support.
          </p>
          <p>
            Your information is never sold to third parties. All payment processing is guarded by 256-bit encrypted gateway standards.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
