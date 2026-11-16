/**
 * userService.js — GreenNest User Service Layer
 * ------------------------------------------------
 * Manages user profile, user garden collection, plant wishlist / favorites,
 * and personalized plant care reminders via backend API (/api/user/*)
 * with robust local storage fallbacks.
 */

import { apiGet, apiPost, apiFetch } from './apiClient.js';
import { plantsData } from '../src/data/plants.js';

const STORAGE_KEYS = {
  PROFILE: 'greennest_user_profile',
  WISHLIST: 'greennest_user_wishlist',
  GARDEN: 'greennest_user_garden',
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or access errors
  }
}

// ── Profile API ──────────────────────────────────────────────────────────────
/**
 * Fetch current user profile from backend or localStorage.
 * @returns {Promise<{ id: string, name: string, email: string, experienceLevel: string }>}
 */
export async function getUserProfile() {
  try {
    const data = await apiGet('/api/user/profile');
    if (data?.profile) {
      setLocal(STORAGE_KEYS.PROFILE, data.profile);
      return data.profile;
    }
  } catch {
    // Fall back to local storage
  }

  return getLocal(STORAGE_KEYS.PROFILE, {
    id: 'user_default',
    name: 'Plant Enthusiast',
    email: 'user@greennest.com',
    experienceLevel: 'Beginner',
    location: 'Zone 8',
    joinedDate: new Date().toISOString().split('T')[0],
  });
}

/**
 * Update current user profile.
 * @param {object} updates
 */
export async function updateUserProfile(updates) {
  const current = await getUserProfile();
  const merged = { ...current, ...updates };

  try {
    const res = await apiFetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    });
    if (res?.profile) {
      setLocal(STORAGE_KEYS.PROFILE, res.profile);
      return res.profile;
    }
  } catch {
    // Offline update
  }

  setLocal(STORAGE_KEYS.PROFILE, merged);
  return merged;
}

// ── Wishlist / Favorites API ─────────────────────────────────────────────────
/**
 * Get user wishlist / favorite plant IDs and full plant objects.
 * @returns {Promise<{ wishlistIds: Array<number|string>, plants: Array<object> }>}
 */
export async function getUserWishlist() {
  try {
    const data = await apiGet('/api/user/wishlist');
    if (data?.wishlistIds) {
      setLocal(STORAGE_KEYS.WISHLIST, data.wishlistIds);
      return {
        wishlistIds: data.wishlistIds,
        plants: data.plants || [],
      };
    }
  } catch {
    // Fallback to local
  }

  const ids = getLocal(STORAGE_KEYS.WISHLIST, [1, 2, 8, 9]);
  const matchedPlants = plantsData.filter((p) => ids.includes(p.id) || ids.includes(Number(p.id)));
  return { wishlistIds: ids, plants: matchedPlants };
}

/**
 * Add a plant to user wishlist.
 * @param {number|string} plantId
 */
export async function addUserFavorite(plantId) {
  const numericId = parseInt(plantId, 10) || plantId;

  try {
    const res = await apiPost('/api/user/wishlist', { plantId: numericId });
    if (res?.wishlist) {
      setLocal(STORAGE_KEYS.WISHLIST, res.wishlist);
      return res.wishlist;
    }
  } catch {
    // Fallback
  }

  const existing = getLocal(STORAGE_KEYS.WISHLIST, []);
  if (!existing.includes(numericId)) {
    const updated = [...existing, numericId];
    setLocal(STORAGE_KEYS.WISHLIST, updated);
    return updated;
  }
  return existing;
}

/**
 * Remove a plant from user wishlist.
 * @param {number|string} plantId
 */
export async function removeUserFavorite(plantId) {
  const numericId = parseInt(plantId, 10) || plantId;

  try {
    const res = await apiFetch(`/api/user/wishlist/${encodeURIComponent(numericId)}`, {
      method: 'DELETE',
    });
    if (res?.wishlist) {
      setLocal(STORAGE_KEYS.WISHLIST, res.wishlist);
      return res.wishlist;
    }
  } catch {
    // Fallback
  }

  const existing = getLocal(STORAGE_KEYS.WISHLIST, []);
  const updated = existing.filter((id) => id !== numericId && String(id) !== String(plantId));
  setLocal(STORAGE_KEYS.WISHLIST, updated);
  return updated;
}

// ── User Garden (Owned Plants & Watering Trackers) ───────────────────────────
/**
 * Get plants owned by the user with watering history.
 */
export async function getUserGarden() {
  try {
    const data = await apiGet('/api/user/garden');
    if (data?.garden) {
      setLocal(STORAGE_KEYS.GARDEN, data.garden);
      return data.garden;
    }
  } catch {
    // Fallback
  }

  return getLocal(STORAGE_KEYS.GARDEN, [
    {
      plantId: 1,
      nickname: 'Monty',
      acquiredDate: '2026-02-10',
      lastWatered: '2026-11-08',
      plant: plantsData[0],
    },
  ]);
}

/**
 * Add a plant to user's virtual garden.
 * @param {{ plantId: number|string, nickname?: string }} param0
 */
export async function addPlantToUserGarden({ plantId, nickname }) {
  try {
    const res = await apiPost('/api/user/garden', { plantId, nickname });
    if (res?.item) {
      const existing = getLocal(STORAGE_KEYS.GARDEN, []);
      const updated = [...existing, res.item];
      setLocal(STORAGE_KEYS.GARDEN, updated);
      return res.item;
    }
  } catch {
    // Fallback
  }

  const numericId = parseInt(plantId, 10) || plantId;
  const plantObj = plantsData.find((p) => p.id === numericId || String(p.id) === String(plantId));
  const newEntry = {
    plantId: numericId,
    nickname: nickname || plantObj?.name || 'My Plant',
    acquiredDate: new Date().toISOString().split('T')[0],
    lastWatered: new Date().toISOString().split('T')[0],
    plant: plantObj || null,
  };

  const existing = getLocal(STORAGE_KEYS.GARDEN, []);
  const updated = [...existing, newEntry];
  setLocal(STORAGE_KEYS.GARDEN, updated);
  return newEntry;
}

/**
 * Get personalized plant recommendations for the user.
 * @param {{ hasPets?: boolean, lightLevel?: string, experience?: string }} preferences
 */
export async function getUserRecommendedPlants(preferences = {}) {
  const { hasPets = false, lightLevel = 'any', experience = 'beginner' } = preferences;

  return plantsData.filter((p) => {
    if (hasPets && !p.toxicity?.toLowerCase().includes('pet friendly') && !p.features?.some((f) => f.toLowerCase().includes('pet'))) {
      return false;
    }
    if (experience === 'beginner' && p.careLevel && !p.careLevel.toLowerCase().includes('easy')) {
      return false;
    }
    if (lightLevel !== 'any' && p.care?.sunlight && !p.care.sunlight.toLowerCase().includes(lightLevel.toLowerCase())) {
      return false;
    }
    return true;
  }).slice(0, 6);
}

