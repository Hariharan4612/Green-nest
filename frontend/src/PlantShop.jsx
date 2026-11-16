import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlantCard from './components/PlantCard';
import { 
  plantsData, 
  categoriesList as initialCategories, 
  filterAndSortPlants, 
  getCategoriesWithCounts 
} from './data/plants';
import { getAllPlants, getCategories } from '../services/plantService';
import { 
  FilterIcon, 
  LeafIcon, 
  SparklesIcon, 
  SproutIcon, 
  FlowerIcon, 
  PottedPlantIcon, 
  WindIcon, 
  HeartIcon, 
  HomeIcon 
} from './Icons';
import AiPlantScannerModal from './components/AiPlantScannerModal';

export default function PlantShop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(65);
  const [selectedFeature, setSelectedFeature] = useState('all');
  
  // Base category catalog in memory — preserves stable object references to prevent card re-renders
  const [categoryPlants, setCategoryPlants] = useState(() => {
    const initial = filterAndSortPlants({
      category: initialCategory,
      sortBy: 'popular',
    });
    return initial?.plants?.length ? initial.plants : plantsData;
  });

  const [categories, setCategories] = useState(() => {
    try {
      return getCategoriesWithCounts();
    } catch {
      return initialCategories;
    }
  });

  const [isFetchingCategory, setIsFetchingCategory] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [aiScannerOpen, setAiScannerOpen] = useState(false);

  // Sync category state whenever the URL search param changes
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    if (urlCategory !== selectedCategory) {
      startTransition(() => {
        setSelectedCategory(urlCategory);
      });
    }
  }, [searchParams]);

  // Load backend category counts on mount
  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => {
        if (active && data?.length) {
          setCategories(data);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Update base category plants smoothly whenever category or sort order changes
  useEffect(() => {
    let active = true;

    // 1. Instant optimistic local filtering from memory
    const localResult = filterAndSortPlants({
      category: selectedCategory,
      sortBy,
    });
    if (localResult?.plants) {
      setCategoryPlants(localResult.plants);
    }

    // 2. Fetch fresh catalog from backend in the background for category changes
    setIsFetchingCategory(true);
    getAllPlants({
      category: selectedCategory,
      sortBy,
    })
      .then((res) => {
        if (active && res?.plants && res.source === 'backend') {
          startTransition(() => {
            setCategoryPlants(res.plants);
          });
        }
      })
      .catch(() => {
        // Local data already active
      })
      .finally(() => {
        if (active) setIsFetchingCategory(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCategory, sortBy]);

  // Handle smooth category selection
  const handleCategorySelect = (catId) => {
    if (catId === selectedCategory) return;

    startTransition(() => {
      setSelectedCategory(catId);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (catId === 'all') {
            next.delete('category');
          } else {
            next.set('category', catId);
          }
          return next;
        },
        { replace: true }
      );
    });
  };

  // Instantaneous, buttery-smooth client-side filtering (0ms latency, zero flicker, 60fps locked)
  const filteredPlants = useMemo(() => {
    return categoryPlants.filter((plant) => {
      // Price range filter
      if (maxPrice !== null && plant.price > maxPrice) {
        return false;
      }
      // Feature tags filter
      if (selectedFeature !== 'all') {
        const matchesFeature = plant.features?.some((f) =>
          f.toLowerCase().includes(selectedFeature.toLowerCase())
        );
        if (!matchesFeature) return false;
      }
      return true;
    });
  }, [categoryPlants, maxPrice, selectedFeature]);

  // Category Icon helper
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'indoor':
        return <HomeIcon className="w-4 h-4" />;
      case 'flowering':
        return <FlowerIcon className="w-4 h-4" />;
      case 'succulents':
        return <PottedPlantIcon className="w-4 h-4" />;
      case 'air-purifying':
        return <WindIcon className="w-4 h-4" />;
      case 'pet-friendly':
        return <HeartIcon className="w-4 h-4" />;
      case 'trees':
        return <SproutIcon className="w-4 h-4" />;
      default:
        return <LeafIcon className="w-4 h-4" />;
    }
  };

  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const currentCategoryTitle = currentCategoryObj ? currentCategoryObj.name : 'All Plants';

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-r from-[#173a21] via-[#1e4d2b] to-[#255e34] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none flex items-center justify-center">
            <LeafIcon className="w-96 h-96 -rotate-12" />
          </div>
          <div className="w-full max-w-[1720px] mx-auto relative z-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
              Explore Nature Indoors • 100+ Verified Species
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">
              Our Plant Collection
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Find the perfect plant for your space — from low-maintenance air purifiers to rare tropical collector specimens.
            </p>
            <div className="mt-5 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setAiScannerOpen(true)}
                className="bg-white/95 hover:bg-white text-[#1e4d2b] px-4 py-2 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <SparklesIcon className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Have a plant photo? Identify with AI Scanner (Free)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
          
          {/* Quick Category Bar (Horizontal Scrollable Pills for Mobile & Quick Access) */}
          <div className="mb-6 pb-2 border-b border-gray-200/70">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5">
                <FilterIcon className="w-3.5 h-3.5 text-[#1e4d2b]" />
                Browse:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e4d2b] text-white font-semibold shadow-sm scale-102 ring-2 ring-[#1e4d2b]/20'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-[#1e4d2b]'
                    }`}
                  >
                    <span className={isSelected ? 'text-emerald-300' : 'text-gray-400'}>
                      {getCategoryIcon(cat.id)}
                    </span>
                    <span>{cat.name}</span>
                    {cat.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 xl:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-[#e2ece0] p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                    <FilterIcon className="w-4 h-4 text-[#1e4d2b]" />
                    Categories
                  </h3>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className="text-xs text-[#1e4d2b] font-medium hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Categories List */}
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e4d2b] text-white font-semibold shadow-sm translate-x-1'
                            : 'text-gray-600 hover:bg-emerald-50 hover:text-[#1e4d2b]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isSelected ? 'text-emerald-300' : 'text-gray-400'}>
                            {getCategoryIcon(cat.id)}
                          </span>
                          <span>{cat.name}</span>
                        </div>
                        {cat.count !== undefined && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {cat.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Price Filter */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Price Range
                    </h4>
                    <span className="text-xs font-bold text-[#1e4d2b] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Up to ${maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#1e4d2b] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
                    <span>$10</span>
                    <span>$65</span>
                  </div>
                </div>

                {/* Special Tags */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Air Purifying', 'Low Maintenance', 'Pet Friendly', 'Indoor Friendly'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedFeature(selectedFeature === tag ? 'all' : tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          selectedFeature === tag
                            ? 'bg-[#1e4d2b] text-white border-[#1e4d2b] shadow-2xs font-semibold'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Plant Grid */}
            <section className="lg:col-span-3 xl:col-span-4 relative">
              {/* Subtle top loading indicator bar for background network sync ONLY during category transitions */}
              {isFetchingCategory && (
                <div className="absolute -top-3 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#1e4d2b] rounded-full animate-pulse z-20" />
              )}

              {/* Grid Header */}
              <div className="bg-white rounded-2xl border border-[#e2ece0] p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {currentCategoryTitle}
                  </h2>
                  <span className="text-xs font-semibold text-[#1e4d2b] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {filteredPlants.length} plants
                  </span>
                  {(selectedCategory !== 'all' || maxPrice < 65 || selectedFeature !== 'all') && (
                    <button
                      onClick={() => {
                        handleCategorySelect('all');
                        setMaxPrice(65);
                        setSelectedFeature('all');
                      }}
                      className="text-xs text-gray-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>✕ Reset filters</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-xs text-gray-500 font-medium">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#1e4d2b] cursor-pointer"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Plant Cards Grid (Clean, stable container without jarring scale or opacity animations) */}
              <div className="w-full">
                {filteredPlants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlants.map((plant) => (
                      <PlantCard key={plant.id} plant={plant} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#e2ece0] p-12 text-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
                      <LeafIcon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      No plants found under ${maxPrice}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                      Try expanding your price range slider or clearing features to explore our collection.
                    </p>
                    <button
                      onClick={() => {
                        setMaxPrice(65);
                        setSelectedFeature('all');
                      }}
                      className="bg-[#1e4d2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#163b21] transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    >
                      Show All Prices ($10 - $65)
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <AiPlantScannerModal
        isOpen={aiScannerOpen}
        onClose={() => setAiScannerOpen(false)}
      />

      <Footer />
    </div>
  );
}
