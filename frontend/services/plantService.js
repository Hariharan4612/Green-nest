/**
 * plantService.js — GreenNest Plant Data Layer
 * ------------------------------------------------
 * Fetches plant data from the backend (/api/plants*) which serves the
 * comprehensive 50-plant catalog with Perenual integration.
 * Falls back gracefully to local plantsData when the backend is unreachable.
 *
 * API endpoints (via Vite proxy → http://localhost:4000):
 *   GET /api/plants               → Full catalog with filtering, sorting, pagination
 *   GET /api/plants/featured      → Featured/bestseller plants
 *   GET /api/plants/categories    → Categories with plant counts
 *   GET /api/plants/search?q=...  → Full catalog / botanical species search
 *   GET /api/plants/:id           → Single plant details by numeric ID or slug
 *   GET /api/plants/:id/care-guide→ Dedicated plant care guides
 */

import { plantsData, categoriesList } from '../src/data/plants.js';

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Merge API plant response with matching local data to ensure all UI fields are present.
 */
function normalizePlantItem(apiPlant) {
  if (!apiPlant) return null;

  const local = plantsData.find(
    (p) =>
      String(p.id) === String(apiPlant.id) ||
      (p.slug && apiPlant.slug && p.slug.toLowerCase() === apiPlant.slug.toLowerCase()) ||
      p.name.toLowerCase() === (apiPlant.name || '').toLowerCase() ||
      p.scientificName?.toLowerCase() === (apiPlant.scientificName || '').toLowerCase()
  );

  const fallbackImage = 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80';
  const resolvedImage = apiPlant.image || apiPlant.imageUrl || local?.image || fallbackImage;

  return {
    // Defaults & spread local
    price: 24.99,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviewCount: 150,
    tag: 'Popular',
    badge: 'Popular',
    category: 'Indoor Plants',
    inStock: true,
    isPopular: false,
    features: ['Air Purifying', 'Low Maintenance', 'Indoor Friendly'],
    highlights: [
      'Fresh & Healthy Plant direct from nursery',
      'Comes with step-by-step Care Guide',
      'Secure, 100% recyclable packaging',
    ],
    gallery: [resolvedImage],
    ...(local || {}),
    // Overwrite with API values
    id: apiPlant.id ?? local?.id ?? apiPlant.name,
    slug: apiPlant.slug || local?.slug || (apiPlant.name ? apiPlant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
    name: apiPlant.name || local?.name || 'Unknown Plant',
    scientificName: apiPlant.scientificName || local?.scientificName || '',
    description: apiPlant.description || local?.description || '',
    image: resolvedImage,
    imageUrl: resolvedImage,
    category: apiPlant.category || local?.category || 'Indoor Plants',
    price: apiPlant.price !== undefined ? apiPlant.price : (local?.price || 24.99),
    originalPrice: apiPlant.originalPrice !== undefined ? apiPlant.originalPrice : local?.originalPrice,
    discount: apiPlant.discount || local?.discount,
    rating: apiPlant.rating !== undefined ? apiPlant.rating : (local?.rating || 4.8),
    reviewCount: apiPlant.reviewCount !== undefined ? apiPlant.reviewCount : (local?.reviewCount || 120),
    tag: apiPlant.tag || apiPlant.badge || local?.tag || 'Popular',
    badge: apiPlant.badge || apiPlant.tag || local?.badge || 'Popular',
    inStock: apiPlant.inStock !== undefined ? apiPlant.inStock : (local?.inStock ?? true),
    isPopular: apiPlant.isPopular !== undefined ? apiPlant.isPopular : (local?.isPopular ?? false),
    care: {
      sunlight: apiPlant.care?.sunlight || apiPlant.sunlight || local?.care?.sunlight || 'Bright indirect light',
      water: apiPlant.care?.water || apiPlant.watering || local?.care?.water || 'Every 7-10 days',
      humidity: apiPlant.care?.humidity || local?.care?.humidity || 'Moderate to high',
      temperature: apiPlant.care?.temperature || local?.care?.temperature || '65°F - 85°F',
      soil: apiPlant.care?.soil || local?.care?.soil || 'Well-draining potting soil',
      fertilizer: apiPlant.care?.fertilizer || local?.care?.fertilizer || 'Monthly during growing season',
    },
    careGuides: apiPlant.careGuides || local?.careGuides || [],
    source: apiPlant.source || 'backend',
  };
}

function fromLocal(localPlant) {
  return { ...localPlant, source: 'local' };
}

// ── Service Methods ──────────────────────────────────────────────────────────

/**
 * Fetch all plants with optional filtering, sorting, and pagination.
 *
 * @param {object} [params]
 * @param {string} [params.category]   - 'all' | 'indoor' | 'outdoor' | 'flowering' | 'succulents' | 'ferns' | 'air-purifying' | 'pet-friendly'
 * @param {string} [params.search]     - Search query string
 * @param {string} [params.sortBy]     - 'popular' | 'price-low' | 'price-high' | 'rating' | 'name'
 * @param {number} [params.maxPrice]   - Maximum price filter
 * @param {number} [params.page]       - Page number
 * @param {number} [params.limit]      - Items per page
 * @param {boolean} [params.featured]  - Filter only featured plants
 * @returns {Promise<{ plants: object[], total: number, page: number, totalPages: number }>}
 */
export async function getAllPlants(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.category && params.category !== 'all') queryParams.set('category', params.category);
  if (params.search) queryParams.set('search', params.search);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.maxPrice !== undefined && params.maxPrice !== null) queryParams.set('maxPrice', String(params.maxPrice));
  if (params.featured) queryParams.set('featured', 'true');
  if (params.page) queryParams.set('page', String(params.page));
  if (params.limit) queryParams.set('limit', String(params.limit));

  const url = `/api/plants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const rawList = Array.isArray(data) ? data : (data.plants || []);
    const normalized = rawList.map(normalizePlantItem);

    return {
      plants: normalized,
      total: data.total || normalized.length,
      page: data.page || params.page || 1,
      totalPages: data.totalPages || 1,
      source: 'backend',
    };
  } catch (err) {
    console.warn(`[plantService] Backend API unavailable (${err.message}). Using local 50-plant catalog.`);
    
    // Fallback: client-side filter of local 50 plants
    let filtered = [...plantsData];

    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      filtered = filtered.filter((p) => {
        if (cat === 'air-purifying') {
          return p.features?.some((f) => f.toLowerCase().includes('air')) || p.tag?.toLowerCase().includes('air');
        }
        if (cat === 'pet-friendly') {
          return p.features?.some((f) => f.toLowerCase().includes('pet')) || p.tag?.toLowerCase().includes('pet') || p.toxicity?.toLowerCase().includes('pet friendly');
        }
        return p.category.toLowerCase().includes(cat.split(' ')[0]);
      });
    }

    if (params.maxPrice) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.scientificName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    if (params.sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (params.sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (params.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (params.sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

    return {
      plants: filtered.map(fromLocal),
      total: filtered.length,
      page: 1,
      totalPages: 1,
      source: 'local',
    };
  }
}

/**
 * Fetch featured/bestseller plants for homepage and carousels.
 * @param {number} [limit=8]
 * @returns {Promise<object[]>}
 */
export async function getFeaturedPlants(limit = 8) {
  try {
    const res = await fetch(`/api/plants/featured?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = data.plants || (Array.isArray(data) ? data : []);
    if (list.length > 0) {
      return list.map(normalizePlantItem);
    }
  } catch {
    // Fallback
  }

  return plantsData.filter((p) => p.isPopular).slice(0, limit).map(fromLocal);
}

/**
 * Fetch categories with real plant counts from backend.
 * @returns {Promise<Array<{ id: string, name: string, count: number }>>}
 */
export async function getCategories() {
  try {
    const res = await fetch('/api/plants/categories');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.categories?.length > 0) {
      return data.categories;
    }
  } catch {
    // Fallback
  }

  return categoriesList;
}

/**
 * Get a single plant by its numeric ID or string slug.
 * @param {string|number} idOrSlug
 * @returns {Promise<object|null>}
 */
export async function getPlantById(idOrSlug) {
  if (!idOrSlug) return null;

  try {
    const res = await fetch(`/api/plants/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.error) throw new Error(data.error);
    return normalizePlantItem(data);
  } catch {
    // Local fallback
    const str = String(idOrSlug).toLowerCase();
    const match = plantsData.find(
      (p) => String(p.id) === str || (p.slug && p.slug.toLowerCase() === str)
    );
    return match ? fromLocal(match) : null;
  }
}

/**
 * Search plants by query string.
 * @param {string} query
 * @param {number} [page=1]
 * @param {number} [limit=12]
 * @returns {Promise<{ plants: object[], total: number, currentPage: number, source: string }>}
 */
export async function searchPlants(query, page = 1, limit = 12) {
  const q = (query || '').trim();
  if (!q) {
    return { plants: plantsData.map(fromLocal), total: plantsData.length, currentPage: 1, source: 'local' };
  }

  try {
    const res = await fetch(`/api/plants/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const plants = (data.plants || []).map(normalizePlantItem);
    return {
      plants,
      total: data.total || plants.length,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 1,
      source: data.source || 'backend',
    };
  } catch {
    // Local fallback filter
    const lq = q.toLowerCase();
    const plants = plantsData
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lq) ||
          p.scientificName?.toLowerCase().includes(lq) ||
          p.category?.toLowerCase().includes(lq) ||
          p.description?.toLowerCase().includes(lq) ||
          p.features?.some((f) => f.toLowerCase().includes(lq))
      )
      .map(fromLocal);

    return { plants, total: plants.length, currentPage: 1, totalPages: 1, source: 'local' };
  }
}

/**
 * Get plant care guides.
 * @param {string|number} plantId
 * @returns {Promise<Array>}
 */
export async function getPlantCareGuides(plantId) {
  try {
    const res = await fetch(`/api/plants/${encodeURIComponent(plantId)}/care-guide`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.careGuides) {
      return data.careGuides;
    }
  } catch {
    // Fallback
  }

  const plant = await getPlantById(plantId);
  return plant?.careGuides || [];
}
