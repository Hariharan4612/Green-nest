import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />
      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <h1 className="text-3xl font-extrabold text-[#142e1b] mb-4">Terms & Conditions</h1>
        <div className="bg-white p-8 rounded-3xl border border-[#e2ece0] shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            Welcome to GreenNest! By purchasing from our nursery, you agree to our standard plant care and delivery terms.
          </p>
          <p>
            Plants are living organisms; slight variations in leaf foliage, height, and coloration from photos are completely natural and reflect healthy plant life.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
