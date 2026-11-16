import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlantCard from './components/PlantCard';
import { useApp } from './context/AppContext';
import { HeartIcon, ArrowLeftIcon, ArrowRightIcon } from './Icons';

export default function Wishlist() {
  const { wishlist, clearWishlist, wishlistCount } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Header matching Screen 12 */}
          <div className="flex items-center justify-between pb-6 border-b border-[#e2ece0] mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                <HeartIcon className="w-5 h-5 fill-rose-500" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142e1b]">
                My Wishlist{' '}
                <span className="text-lg font-normal text-gray-500">
                  ({wishlistCount} {wishlistCount === 1 ? 'Item' : 'Items'})
                </span>
              </h1>
            </div>

            {wishlistCount > 0 && (
              <button
                onClick={clearWishlist}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Plant Wishlist Grid matching Screen 12 */}
          {wishlistCount > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {wishlist.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#1e4d2b] hover:underline"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" />
                  Explore More Plants to Wishlist
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#e2ece0] p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
              <p className="text-xs text-gray-500 mb-6">
                Save the indoor and outdoor plants you love so you can easily find them later!
              </p>
              <Link
                to="/shop"
                className="bg-[#1e4d2b] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#163b21] inline-flex items-center gap-2"
              >
                Discover Plants
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
