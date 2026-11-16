import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { plantsData } from './data/plants';
import { useApp } from './context/AppContext';
import { usePlantById } from './hooks/usePlants';
import { 
  StarIcon, 
  HeartIcon, 
  WindIcon, 
  DropletIcon, 
  HomeIcon, 
  CheckIcon,
  SproutIcon
} from './Icons';

export default function ProductDetails() {
  const { plantId } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const { plant: fetchedPlant, loading } = usePlantById(plantId);

  const localPlant = plantsData.find(
    (p) => String(p.id) === String(plantId) || (p.slug && p.slug.toLowerCase() === String(plantId).toLowerCase())
  );
  const plant = fetchedPlant || localPlant || plantsData[0];

  const [selectedImage, setSelectedImage] = useState(plant?.image || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (plant?.image) {
      setSelectedImage(plant.image);
    }
  }, [plant?.image]);

  const wishlisted = plant ? isInWishlist(plant.id) : false;
  const gallery = plant?.gallery && plant.gallery.length > 0 ? plant.gallery : [plant?.image || ''];

  if (loading && !fetchedPlant && !localPlant) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7faf7]">
        <Navbar />
        <main className="flex-1 py-12 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#1e4d2b] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-600">Retrieving plant details from botanical database...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Breadcrumbs matching Screen 03 */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 flex-wrap">
            <Link to="/" className="hover:text-[#1e4d2b]">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#1e4d2b]">Shop</Link>
            <span>/</span>
            <span className="text-gray-400">{plant.category || 'Plants'}</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{plant.name}</span>
            {plant.source === 'Perenual' && (
              <span className="ml-2 text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <SproutIcon className="w-3 h-3 text-[#1e4d2b]" /> Live Perenual
              </span>
            )}
          </nav>

          {/* Main 2-Column Product Layout matching Screen 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-[#e2ece0] p-6 sm:p-10 shadow-sm">
            {/* Left Column: Image Gallery (Thumbnail column + Main Image) */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-center">
              {/* Vertical Thumbnails */}
              <div className="flex sm:flex-col gap-3 shrink-0">
                {gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === imgUrl
                        ? 'border-[#1e4d2b] ring-2 ring-emerald-200'
                        : 'border-gray-200 hover:border-emerald-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${plant.name} preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Featured Large Image */}
              <div className="flex-1 w-full bg-[#f4f7f4] rounded-2xl overflow-hidden relative aspect-square flex items-center justify-center p-4">
                <img
                  src={selectedImage || plant.image}
                  alt={plant.name}
                  className="w-full h-full object-contain max-h-[460px] drop-shadow-md transition-all duration-300"
                />
                {plant.discount && (
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {plant.discount}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Plant Information & Purchase Action */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-semibold text-[#1e4d2b] tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                    {plant.category || 'Botanical Species'}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                    <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-gray-900">{plant.rating ?? 4.8}</span>
                    <span className="text-gray-500 font-normal">({plant.reviewCount || '1.2k'} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142e1b] mt-3 tracking-tight">
                  {plant.name}
                </h1>
                {plant.scientificName && (
                  <p className="text-xs font-mono text-gray-500 italic mt-0.5">
                    {plant.scientificName}
                  </p>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="text-3xl font-extrabold text-[#1e4d2b]">
                    ${(plant.price ?? 24.99).toFixed(2)}
                  </span>
                  {plant.originalPrice && (
                    <span className="text-base text-gray-400 line-through">
                      ${plant.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {plant.discount && (
                    <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      {plant.discount}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {plant.description || `${plant.name} is a healthy botanical specimen delivered directly to your doorstep with guaranteed nursery quality.`}
                </p>

                {/* Feature Icons: Air Purifying, Low Maintenance, Indoor Friendly */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <WindIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Air Purifying</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <DropletIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Low Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <HomeIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Indoor Friendly</span>
                  </div>
                </div>

                {/* Quantity and Add to Cart Row */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100 active:scale-95 shadow-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-gray-800 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100 active:scale-95 shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(plant, quantity)}
                    className="flex-1 bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
                  >
                    Add to Cart
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(plant)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      wishlisted
                        ? 'border-rose-300 bg-rose-50 text-rose-500'
                        : 'border-gray-300 text-gray-600 hover:text-rose-500 hover:border-rose-200'
                    }`}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon className="w-5 h-5" filled={wishlisted} />
                  </button>
                </div>

                {/* Product Highlights Box matching Screen 03 */}
                <div className="bg-[#f5f8f5] rounded-2xl p-4 border border-[#e2ece0] space-y-2">
                  <h4 className="text-xs font-bold text-[#142e1b] uppercase tracking-wider mb-2">
                    Product Highlights
                  </h4>
                  {plant.highlights ? (
                    plant.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckIcon className="w-4 h-4 text-[#1e4d2b] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckIcon className="w-4 h-4 text-[#1e4d2b] shrink-0" />
                        <span>Fresh & Healthy Plant guaranteed</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckIcon className="w-4 h-4 text-[#1e4d2b] shrink-0" />
                        <span>Comes with free expert Care Guide</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckIcon className="w-4 h-4 text-[#1e4d2b] shrink-0" />
                        <span>Secure transit plant protection packaging</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description | Plant Care Guide | Reviews | FAQs */}
          <div className="mt-12 bg-white rounded-3xl border border-[#e2ece0] p-6 sm:p-8 shadow-sm">
            <div className="flex border-b border-gray-200 gap-8 text-sm font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 relative whitespace-nowrap transition-colors ${
                  activeTab === 'description' ? 'text-[#1e4d2b]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Description
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d2b]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-4 relative whitespace-nowrap transition-colors ${
                  activeTab === 'care' ? 'text-[#1e4d2b]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Plant Care Guide
                {activeTab === 'care' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d2b]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 relative whitespace-nowrap transition-colors ${
                  activeTab === 'reviews' ? 'text-[#1e4d2b]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Reviews (1.2k)
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d2b]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`pb-4 relative whitespace-nowrap transition-colors ${
                  activeTab === 'faqs' ? 'text-[#1e4d2b]' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                FAQs
                {activeTab === 'faqs' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e4d2b]" />
                )}
              </button>
            </div>

            <div className="pt-6 text-sm text-gray-700 leading-relaxed">
              {activeTab === 'description' && (
                <div className="space-y-4 max-w-3xl">
                  {plant.description ? (
                    <p className="whitespace-pre-line leading-relaxed">{plant.description}</p>
                  ) : (
                    <>
                      <p>
                        {plant.name} is one of the most celebrated and beloved botanical houseplants worldwide.
                        Characterized by its broad, glossy foliage, it lends instant lush tropical warmth to any corner, living room, office, or patio.
                      </p>
                      <p>
                        Grown with organic minerals and acclimatized in nursery green spaces, our plants arrive established,
                        well-rooted in premium aerated potting soil, and ready to thrive in your space.
                      </p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#f7faf7] p-4 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-[#1e4d2b] uppercase">Sunlight</span>
                      <p className="text-xs text-gray-600 mt-1">{plant.care?.sunlight || 'Bright indirect light'}</p>
                    </div>
                    <div className="bg-[#f7faf7] p-4 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-[#1e4d2b] uppercase">Watering</span>
                      <p className="text-xs text-gray-600 mt-1">{plant.care?.water || 'Every 7-10 days when topsoil dries'}</p>
                    </div>
                    <div className="bg-[#f7faf7] p-4 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-[#1e4d2b] uppercase">Humidity</span>
                      <p className="text-xs text-gray-600 mt-1">{plant.care?.humidity || 'Moderate to high humidity'}</p>
                    </div>
                    <div className="bg-[#f7faf7] p-4 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-[#1e4d2b] uppercase">Temperature</span>
                      <p className="text-xs text-gray-600 mt-1">{plant.care?.temperature || '65°F - 85°F'}</p>
                    </div>
                  </div>

                  {plant.careGuides && plant.careGuides.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Perenual Care Guides</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {plant.careGuides.map((guide, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-[#f7faf7] border border-emerald-100">
                            <h5 className="font-bold text-xs text-[#1e4d2b] uppercase">{guide.type || 'Care Tip'}</h5>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{guide.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-xs">Priya Sharma</span>
                      <span className="text-[11px] text-gray-400">2 days ago</span>
                    </div>
                    <div className="flex text-amber-400 text-xs mb-2">★★★★★</div>
                    <p className="text-xs text-gray-600">
                      "Arrived in immaculate condition! The packaging was 100% cardboard with no soil spilled. Two new fenestrated leaves unfurled in just a week!"
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'faqs' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h5 className="font-bold text-gray-900 text-xs">How do I know when to water?</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Insert your finger 2 inches into the soil. If it feels completely dry to touch, give it a thorough soaking until water drains through the bottom.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
