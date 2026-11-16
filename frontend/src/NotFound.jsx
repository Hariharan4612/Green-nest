import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LeafIcon, ArrowLeftIcon } from './Icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ece0] p-10 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
            <LeafIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#142e1b] mb-2">404</h1>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            The garden path you took didn't lead to any greenery. Let's get you back to the nursery.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1e4d2b] hover:bg-[#163b21] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
