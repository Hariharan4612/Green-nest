/**
 * apiClient.js — GreenNest Generic Fetch Wrapper
 */

const DEFAULT_TIMEOUT_MS = 10_000;

export async function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out. Please try again.');
    throw new Error('Network error. Check your connection.');
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) detail = body.message;
      else if (body?.error) detail = body.error;
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  return res.json();
}

export function apiGet(url, params = {}) {
  const u = new URL(url, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  });
  return apiFetch(u.pathname + u.search);
}

export function apiPost(url, body) {
  return apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiPut(url, body) {
  return apiFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

