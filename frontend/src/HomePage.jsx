import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlantCard from './components/PlantCard';
import { plantsData } from './data/plants';
import { getFeaturedPlants } from '../services/plantService';
import { 
  TruckIcon, 
  HeadphonesIcon, 
  ShieldCheckIcon, 
  AwardIcon, 
  RefreshCwIcon, 
  ArrowRightIcon, 
  LeafIcon,
  StarIcon,
  FlowerIcon,
  SproutIcon,
  WindIcon,
  HeartIcon,
  HomeIcon,
  PottedPlantIcon
} from './Icons';

export default function HomePage() {
  const [featuredPlants, setFeaturedPlants] = useState(() => plantsData.slice(0, 4));

  useEffect(() => {
    let active = true;
    getFeaturedPlants(4)
      .then((data) => {
        if (active && data?.length) {
          setFeaturedPlants(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#eaf3eb] via-[#f1f7f0] to-[#f7faf7] py-12 md:py-20">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#1e4d2b] text-xs font-semibold tracking-wide">
                  <LeafIcon className="w-3.5 h-3.5" />
                  Fresh & Healthy Nursery Plants
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#142e1b] tracking-tight leading-[1.15]">
                  Discover beautiful indoor plants for every corner of your home
                </h1>

                <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Bring nature into your space with our fresh and carefully selected plants. Directly nurtured in organic nurseries and delivered right to your doorstep.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/shop"
                    className="bg-[#1e4d2b] hover:bg-[#163b21] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-emerald-900/15 hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                  >
                    Shop Now
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/about"
                    className="border-2 border-[#1e4d2b] text-[#1e4d2b] hover:bg-emerald-50 px-7 py-3 rounded-full font-semibold text-sm transition-all"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Rating snapshot */}
                <div className="pt-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Customer" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Customer" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Customer" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">4.9/5 from 10,000+ happy plant parents</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Image with Floating Elements */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-3xl scale-95 -z-10" />
                
                <div className="relative bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-emerald-100 shadow-2xl max-w-lg w-full">
                  <img
                    src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=80"
                    alt="Monstera Deliciosa Indoor Plant"
                    className="w-full h-96 lg:h-[420px] object-cover rounded-2xl shadow-inner"
                  />

                  {/* Floating badge 1: Air Purifying */}
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-100 shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#1e4d2b]">
                      <LeafIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">100% Organic</p>
                      <p className="text-[10px] text-gray-500">Nursery nurtured</p>
                    </div>
                  </div>

                  {/* Floating badge 2: Popular */}
                  <div className="absolute -top-3 -right-3 bg-[#1e4d2b] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    ★ Bestseller Plant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Bar */}
        <section className="bg-white border-y border-[#e2ede0] py-6">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1e4d2b] shrink-0">
                  <TruckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Free Shipping</h4>
                  <p className="text-xs text-gray-500">On all orders above $50</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1e4d2b] shrink-0">
                  <HeadphonesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Plant Care Support</h4>
                  <p className="text-xs text-gray-500">24/7 expert horticulturalist help</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#1e4d2b] shrink-0">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Secure Payments</h4>
                  <p className="text-xs text-gray-500">Your data and payments are 100% safe</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Shop with GreenNest? Section */}
        <section className="py-16 md:py-24 bg-[#f7faf7]">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#1e4d2b] tracking-wider uppercase bg-emerald-100 px-3 py-1 rounded-full">
                Our Guarantee
              </span>
              <h2 className="text-3xl font-extrabold text-[#142e1b] mt-3">
                Why Shop with GreenNest?
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                We take the hassle out of plant parenting with guaranteed healthy delivery and ongoing care support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <div className="bg-white p-6 rounded-2xl border border-[#e2ede0] shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-[#1e4d2b] mb-4">
                  <AwardIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Premium Quality Plants</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Carefully cultivated in mineral-rich soil and checked by botanists before shipping.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2ede0] shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-[#1e4d2b] mb-4">
                  <RefreshCwIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Easy Returns</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hassle-free 7-day replacement guarantee if your plant arrives unhealthy or damaged.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2ede0] shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-[#1e4d2b] mb-4">
                  <TruckIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Fast Delivery</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fast express transit across India and nationwide with shock-proof custom packaging.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e2ede0] shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-[#1e4d2b] mb-4">
                  <LeafIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">Trusted by Plant Lovers</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Over 10,000+ satisfied plant parents turning apartments into living green sanctuaries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Category Section */}
        <section className="py-14 bg-gradient-to-b from-[#f7faf7] to-white border-t border-[#e2ede0]">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold text-[#1e4d2b] tracking-wider uppercase bg-emerald-100 px-3 py-1 rounded-full">
                  Plant Categories
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142e1b] mt-3">
                  Find Plants by Space & Style
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-sm font-semibold text-[#1e4d2b] hover:text-emerald-800 flex items-center gap-1.5"
              >
                Browse All Categories <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { id: 'indoor', name: 'Indoor Plants', icon: HomeIcon, desc: 'Apartment friendly', color: 'bg-emerald-50 text-[#1e4d2b] border-emerald-200' },
                { id: 'air-purifying', name: 'Air Purifying', icon: WindIcon, desc: 'Clean living spaces', color: 'bg-teal-50 text-teal-800 border-teal-200' },
                { id: 'succulents', name: 'Succulents & Cacti', icon: PottedPlantIcon, desc: 'Low water routine', color: 'bg-amber-50 text-amber-900 border-amber-200' },
                { id: 'flowering', name: 'Flowering Plants', icon: FlowerIcon, desc: 'Vibrant blooms', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                { id: 'pet-friendly', name: 'Pet Friendly', icon: HeartIcon, desc: 'Safe for pets', color: 'bg-green-50 text-green-800 border-green-200' },
                { id: 'trees', name: 'Indoor Trees', icon: SproutIcon, desc: 'Statement foliage', color: 'bg-lime-50 text-lime-900 border-lime-200' },
              ].map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.id}`}
                    className="group bg-white p-5 rounded-2xl border border-[#e2ede0] hover:border-[#1e4d2b] hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 border ${category.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#1e4d2b] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {category.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Plants Collection */}
        <section className="py-12 bg-white border-t border-[#e2ede0]">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1e4d2b] tracking-wider uppercase">Handpicked for you</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  Trending Indoor Favorites
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-sm font-semibold text-[#1e4d2b] hover:text-emerald-800 flex items-center gap-1.5"
              >
                View Full Collection <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
