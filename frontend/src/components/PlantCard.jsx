import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeartIcon, StarIcon } from '../Icons';

function PlantCard({ plant }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const wishlisted = isInWishlist(plant.id);

  return (
    <div className="group bg-white rounded-2xl border border-[#e2ece0] p-4 flex flex-col justify-between hover:shadow-xl hover:border-emerald-300 transition-all duration-300 relative overflow-hidden">
      {/* Top badges & Wishlist button */}
      <div className="relative">
        {plant.tag && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-emerald-50 text-[#1e4d2b] border border-emerald-200/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            {plant.tag}
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(plant);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? 'bg-rose-50 text-rose-500 shadow-sm'
              : 'bg-white/90 text-gray-500 hover:text-rose-500 shadow-sm hover:scale-110'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon className="w-4 h-4" filled={wishlisted} />
        </button>

        {/* Plant Photo Link */}
        <Link to={`/plants/${plant.id}`} className="block overflow-hidden rounded-xl bg-[#f4f7f4] mb-3 aspect-square">
          <img
            src={plant.image}
            alt={plant.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/photos/plant-1.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Plant Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-1">
            <StarIcon className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-800">{plant.rating}</span>
            <span className="text-gray-400">({plant.reviewCount || 120})</span>
          </div>

          <Link to={`/plants/${plant.id}`}>
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#1e4d2b] transition-colors leading-snug mb-1">
              {plant.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {plant.scientificName || plant.category}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#1e4d2b]">
              ${plant.price.toFixed(2)}
            </span>
            {plant.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${plant.originalPrice.toFixed(2)}
              </span>
            )}
            {plant.discount && (
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.5 rounded">
                {plant.discount}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(plant)}
            className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PlantCard);

