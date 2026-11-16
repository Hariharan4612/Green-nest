/**
 * usePlants.js — Custom React hook for plant data
 * --------------------------------------------------------------------------
 * Integrates directly with plantService and the backend 50-plant API.
 * Provides live loading states, error handling, and offline fallbacks.
 */

import { useState, useEffect } from 'react';
import { getAllPlants, getPlantById as fetchPlantById, searchPlants } from '../../services/plantService.js';
import { plantsData } from '../data/plants';

export function mergeApiWithLocal(apiPlant) {
  if (!apiPlant) return null;
  return apiPlant;
}

/**
 * Hook to search or list plants.
 * @param {string} query
 * @param {{ skip?: boolean }} options
 */
export function usePlants(query = '', { skip = false } = {}) {
  const [plants, setPlants] = useState(plantsData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('catalog');

  useEffect(() => {
    if (skip) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const q = (query || '').trim();
        let res;
        if (q) {
          res = await searchPlants(q);
        } else {
          res = await getAllPlants();
        }

        if (isMounted) {
          setPlants(res.plants || []);
          setSource(res.source || 'backend');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setPlants(plantsData);
          setSource('local');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [query, skip]);

  return { plants, loading, error, source };
}

/**
 * Hook to fetch a single plant by numeric ID or slug.
 */
export function usePlantById(id) {
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchPlantById(id)
      .then((data) => {
        if (isMounted) {
          setPlant(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          const fallback = plantsData.find(
            (p) => String(p.id) === String(id) || (p.slug && p.slug.toLowerCase() === String(id).toLowerCase())
          );
          setPlant(fallback || null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { plant, loading };
}
