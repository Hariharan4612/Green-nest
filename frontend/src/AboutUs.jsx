import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { StarIcon, LeafIcon, AwardIcon, ArrowRightIcon } from './Icons';

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Main 2-Column Section matching Screen 10 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl border border-[#e2ece0] p-8 sm:p-14 shadow-sm">
            {/* Left Column: Mission & Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#1e4d2b] text-xs font-semibold">
                <LeafIcon className="w-3.5 h-3.5" />
                Our Story & Vision
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#142e1b] tracking-tight leading-tight">
                About GreenNest
              </h1>

              <p className="text-base text-gray-700 leading-relaxed font-medium">
                We're passionate about plants and believe in a greener, healthier world for everyone.
              </p>

              {/* Our Mission Box matching Screen 10 */}
              <div className="bg-[#f4f8f3] rounded-2xl p-6 border-l-4 border-[#1e4d2b] space-y-2">
                <h3 className="font-bold text-[#142e1b] text-base">Our Mission</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  To bring nature closer to you through quality plants, expert care, and a greener lifestyle. We eliminate the guesswork from plant keeping by pairing premium farm-grown foliage with lifetime horticultural support.
                </p>
              </div>

              {/* Key Metrics Row matching Screen 10: 10K+ Happy Customers, 4.8 Rating, Free Shipping */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1e4d2b]">10K+</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Happy Customers</div>
                </div>

                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1e4d2b] flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
                    4.8
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Customer Rating</div>
                </div>

                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1e4d2b]">Free</div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">Eco Shipping</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-[#1e4d2b] hover:bg-[#163b21] text-white px-7 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10"
                >
                  Explore Plant Collection
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Plant Shelf Showcase Image matching Screen 10 */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-[4/5] bg-emerald-50">
                <img
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80"
                  alt="GreenNest Nursery Plant Shelf"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xl flex items-center gap-3 max-w-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#1e4d2b] flex items-center justify-center shrink-0">
                  <AwardIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Direct From Greenhouse</p>
                  <p className="text-[10px] text-gray-500">Zero middle-tier transit stress for plants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
