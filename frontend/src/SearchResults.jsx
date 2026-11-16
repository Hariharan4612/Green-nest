import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlantCard from './components/PlantCard';
import { usePlants } from './hooks/usePlants';
import { SearchIcon, FilterIcon, SproutIcon } from './Icons';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || 'monstera';
  const [inputValue, setInputValue] = useState(queryParam);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceBracket, setPriceBracket] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(true);

  // 🌿 Live Perenual search — falls back to local data automatically
  const { plants: rawPlants, loading, source } = usePlants(queryParam);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  }, [inputValue, setSearchParams]);

  // Client-side filter/sort on top of API results
  const results = useMemo(() => {
    return rawPlants.filter((plant) => {
      if (activeCategory === 'indoor' && !plant.category?.toLowerCase().includes('indoor')) return false;
      if (activeCategory === 'outdoor' && !plant.category?.toLowerCase().includes('outdoor')) return false;
      if (activeCategory === 'flowering' && !plant.category?.toLowerCase().includes('flowering')) return false;

      if (priceBracket === 'under20' && plant.price >= 20) return false;
      if (priceBracket === '20to40' && (plant.price < 20 || plant.price > 40)) return false;
      if (priceBracket === '40to60' && (plant.price < 40 || plant.price > 60)) return false;

      if (onlyInStock && !plant.inStock) return false;
      return true;
    });
  }, [rawPlants, activeCategory, priceBracket, onlyInStock]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-[#e2ece0] p-4 shadow-sm mb-8">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search plants by name, category, or feature (e.g. monstera, indoor)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1e4d2b] hover:bg-[#163b21] text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 xl:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-[#e2ece0] p-6 shadow-sm sticky top-24 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-[#1e4d2b]" />
                    Filter By
                  </h3>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setPriceBracket('all');
                      setOnlyInStock(true);
                    }}
                    className="text-xs text-[#1e4d2b] font-medium hover:underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Category</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'all', label: 'All Categories' },
                      { id: 'indoor', label: 'Indoor Plants' },
                      { id: 'outdoor', label: 'Outdoor Plants' },
                      { id: 'flowering', label: 'Flowering Plants' },
                    ].map(({ id, label }) => (
                      <label key={id} className="flex items-center gap-2 cursor-pointer hover:text-[#1e4d2b]">
                        <input
                          type="radio"
                          name="category"
                          checked={activeCategory === id}
                          onChange={() => setActiveCategory(id)}
                          className="accent-[#1e4d2b]"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Price Range</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: 'under20', label: 'Under $20' },
                      { id: '20to40', label: '$20 – $40' },
                      { id: '40to60', label: '$40 – $60' },
                    ].map(({ id, label }) => (
                      <label key={id} className="flex items-center gap-2 cursor-pointer hover:text-[#1e4d2b]">
                        <input
                          type="radio"
                          name="price"
                          checked={priceBracket === id}
                          onChange={() => setPriceBracket(id)}
                          className="accent-[#1e4d2b]"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Availability</h4>
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="accent-[#1e4d2b] rounded"
                      />
                      <span>In Stock</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">({results.length})</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Results */}
            <section className="lg:col-span-3 xl:col-span-4">
              {/* Category Quick Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mb-4 pb-1">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'indoor', label: 'Indoor Plants' },
                  { id: 'outdoor', label: 'Outdoor Plants' },
                  { id: 'flowering', label: 'Flowering Plants' },
                ].map(({ id, label }) => {
                  const isActive = activeCategory === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveCategory(id)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#1e4d2b] text-white font-semibold shadow-2xs scale-102 ring-2 ring-[#1e4d2b]/20'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h2 className="text-xl font-extrabold text-[#142e1b]">
                  Search Results for &ldquo;{queryParam}&rdquo;
                </h2>
                <div className="flex items-center gap-2">
                  {source === 'perenual' && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <SproutIcon className="w-3 h-3" /> Live from Perenual
                    </span>
                  )}
                  <span className="text-xs font-semibold text-gray-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {loading ? '…' : `${results.length} Results`}
                  </span>
                </div>
              </div>

              {/* Loading skeleton */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-[#e2ece0] overflow-hidden animate-pulse">
                      <div className="h-52 bg-emerald-50" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-4 bg-gray-100 rounded w-1/4 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results grid */}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((plant) => (
                    <PlantCard key={plant.id} plant={plant} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && results.length === 0 && (
                <div className="bg-white rounded-3xl border border-[#e2ece0] p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No results for &ldquo;{queryParam}&rdquo;
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                    Check your spelling or try broader terms like &ldquo;indoor&rdquo;, &ldquo;succulent&rdquo;, or &ldquo;plant&rdquo;.
                  </p>
                  <button
                    onClick={() => {
                      setInputValue('monstera');
                      setSearchParams({ q: 'monstera' });
                    }}
                    className="bg-[#1e4d2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Search &ldquo;Monstera&rdquo;
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
