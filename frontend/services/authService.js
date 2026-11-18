/**
 * authService.js — GreenNest Authentication & User Management
 * -----------------------------------------------------------
 * - User Sign Up: Saved to MySQL users table (or local storage fallback)
 * - User Login: Authenticated against MySQL database (or local storage fallback)
 */

import { apiGet, apiPost, apiPut } from './apiClient.js';

const USER_KEY = 'greennest_user';
const CLIENTS_KEY = 'greennest_clients_list';

// Initial seed accounts (mirrored from database seed)
const DEFAULT_CLIENTS = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    role: 'client',
    ordersCount: 4,
    totalSpent: 124.50,
    joinedDate: '2026-10-14',
    city: 'Bangalore'
  },
  {
    id: 2,
    name: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    password: 'password123',
    role: 'client',
    ordersCount: 2,
    totalSpent: 68.00,
    joinedDate: '2026-10-28',
    city: 'Hyderabad'
  },
  {
    id: 3,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'password123',
    role: 'client',
    ordersCount: 6,
    totalSpent: 215.80,
    joinedDate: '2026-11-02',
    city: 'Chennai'
  }
];

export function getClientsList() {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    if (!raw) {
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(DEFAULT_CLIENTS));
      return DEFAULT_CLIENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CLIENTS;
  }
}

/**
 * Fetch registered clients list directly from MySQL via backend API (/api/auth/clients)
 */
export async function fetchClientsList() {
  try {
    const data = await apiGet('/api/auth/clients');
    if (data?.clients && Array.isArray(data.clients) && data.clients.length > 0) {
      saveClientsList(data.clients);
      return data.clients;
    }
  } catch (err) {
    // Backend offline: fall back to local store
  }
  return getClientsList();
}

export function saveClientsList(list) {
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save clients list', e);
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.isLoggedIn) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function storeUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store user', e);
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error('Failed to clear user', e);
  }
}

/**
 * User Login:
 * Authenticated against MySQL database (or local storage fallback)
 */
export async function login({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required.');

  const trimmedId = email.trim();
  const normalizedId = trimmedId.toLowerCase();
  const trimmedPassword = password.trim();

  // 1. Call backend API /api/auth/login
  try {
    const data = await apiPost('/api/auth/login', { email: trimmedId, password: trimmedPassword });
    if (data?.user) {
      storeUser(data.user);
      return { user: data.user };
    }
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    const isServiceDown = 
      msg.includes('404') || 
      msg.includes('not found') || 
      msg.includes('network') || 
      msg.includes('timed out') || 
      msg.includes('500') || 
      msg.includes('502') || 
      msg.includes('503') || 
      msg.includes('504');

    if (!isServiceDown) {
      // Real backend authentication failure (e.g. bad password)
      throw err;
    }
  }

  // 2. Fallback to local store if backend offline
  const clients = getClientsList();
  const existingClient = clients.find(c => c.email.toLowerCase() === normalizedId);

  if (existingClient) {
    if (existingClient.password && existingClient.password !== trimmedPassword) {
      throw new Error('Invalid password. Please check your password and try again.');
    }
    const clientUser = {
      ...existingClient,
      isLoggedIn: true,
      loginAt: new Date().toISOString()
    };
    storeUser(clientUser);
    return { user: clientUser };
  }

  throw new Error('Invalid email or password. Please verify your credentials or create an account.');
}

/**
 * Create User (Sign Up):
 * Takes name, email, password and directly saves user to database.
 */
export async function register({ name, email, password }) {
  if (!name || !email || !password) throw new Error('Name, email and password are required.');

  const trimmedName = name.trim();
  const trimmedId = email.trim();
  const normalizedEmail = trimmedId.toLowerCase();
  const trimmedPassword = password.trim();

  // 1. Try saving to backend MySQL database directly
  try {
    const data = await apiPost('/api/auth/register', {
      name: trimmedName,
      email: normalizedEmail,
      password: trimmedPassword
    });

    if (data?.user) {
      storeUser(data.user);
      const clients = getClientsList();
      if (!clients.some(c => c.email.toLowerCase() === normalizedEmail)) {
        saveClientsList([data.user, ...clients]);
      }
      return { user: data.user, message: data.message, emailSent: data.emailSent };
    }
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    const isServiceDown = 
      msg.includes('404') || 
      msg.includes('not found') || 
      msg.includes('network') || 
      msg.includes('timed out') || 
      msg.includes('500') || 
      msg.includes('502') || 
      msg.includes('503') || 
      msg.includes('504');

    if (!isServiceDown) {
      // Real backend validation error (e.g. email already exists, forbidden)
      throw err;
    }
  }

  // 2. Direct fallback store
  const newClient = {
    id: `client_${Date.now()}`,
    name: trimmedName,
    email: normalizedEmail,
    password: trimmedPassword,
    role: 'client',
    ordersCount: 0,
    totalSpent: 0.00,
    joinedDate: new Date().toISOString().split('T')[0],
    city: '',
    address: '',
    state: '',
    pinCode: '',
    phone: '',
    isLoggedIn: true,
    createdAt: new Date().toISOString()
  };

  const clients = getClientsList();
  if (clients.some(c => c.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  saveClientsList([newClient, ...clients]);
  storeUser(newClient);
  return { user: newClient };
}

/**
 * Update User Profile (Address, Phone, City, etc.)
 */
export async function updateUserProfile(updates) {
  const currentUser = getStoredUser();
  if (!currentUser) throw new Error('Not logged in.');

  const updatedUser = {
    ...currentUser,
    ...updates,
    isLoggedIn: true
  };

  // 1. Try updating backend MySQL table
  try {
    const res = await apiPut('/api/auth/profile', {
      email: currentUser.email,
      ...updates
    });
    if (res?.user) {
      const merged = { ...updatedUser, ...res.user, isLoggedIn: true };
      storeUser(merged);
      updateClientInList(merged);
      return merged;
    }
  } catch (e) {
    console.warn('Backend unavailable, updating local user store', e.message);
  }

  // 2. Fallback / local store
  storeUser(updatedUser);
  updateClientInList(updatedUser);
  return updatedUser;
}

function updateClientInList(updatedUser) {
  try {
    const clients = getClientsList();
    const index = clients.findIndex(c => c.email?.toLowerCase() === updatedUser.email?.toLowerCase());
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedUser };
      saveClientsList(clients);
    }
  } catch (err) {
    console.error('Failed to update client in list', err);
  }
}

export function logout() {
  clearUser();
  return { success: true };
}

/**
 * Request Password Reset Link:
 * Calls backend API /api/auth/forgot-password to send password reset email via Gmail SMTP.
 * Seamlessly falls back to local simulation if the backend is offline or user exists in local store.
 */
export async function forgotPassword(email) {
  if (!email || !email.trim()) throw new Error('Email address is required.');

  const trimmedEmail = email.trim().toLowerCase();

  try {
    const data = await apiPost('/api/auth/forgot-password', { email: trimmedEmail });
    localStorage.setItem('greennest_pending_reset_email', trimmedEmail);
    // Ensure resetLink includes email parameter for seamless sync
    if (data?.resetLink && !data.resetLink.includes('email=')) {
      const sep = data.resetLink.includes('?') ? '&' : '?';
      data.resetLink = `${data.resetLink}${sep}email=${encodeURIComponent(trimmedEmail)}`;
    }
    return data;
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    const isServiceDown =
      msg.includes('404') ||
      msg.includes('not found') ||
      msg.includes('network') ||
      msg.includes('timed out') ||
      msg.includes('failed to fetch') ||
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('504');

    const clients = getClientsList();
    const existing = clients.find(c => c.email.toLowerCase() === trimmedEmail);

    if (existing) {
      // Local fallback simulation when backend is offline or account is in local store
      const demoToken = `local-${Date.now()}`;
      localStorage.setItem('greennest_pending_reset_email', trimmedEmail);
      localStorage.setItem('greennest_pending_reset_token', demoToken);
      return {
        success: true,
        sentViaSmtp: false,
        message: 'Reset link generated successfully for your account:',
        resetLink: `${window.location.origin}/reset-password?token=${demoToken}&email=${encodeURIComponent(trimmedEmail)}`
      };
    }

    if (isServiceDown) {
      throw new Error('No account registered with this email address. Please check or create an account.');
    }
    throw err;
  }
}

/**
 * Reset Password using Token:
 * Calls backend API /api/auth/reset-password.
 * Synchronizes the new password with the local client storage as well.
 */
export async function resetPassword(token, newPassword, emailOverride = null) {
  if (!token) throw new Error('Reset token is missing or invalid.');
  if (!newPassword || newPassword.trim().length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const trimmedPassword = newPassword.trim();
  const rawEmail = emailOverride || localStorage.getItem('greennest_pending_reset_email') || '';
  const targetEmail = rawEmail.trim().toLowerCase();

  // Helper to sync updated password to local client list
  const syncLocalPassword = () => {
    try {
      if (targetEmail) {
        const clients = getClientsList();
        const idx = clients.findIndex(c => c.email && c.email.toLowerCase() === targetEmail);
        if (idx !== -1) {
          clients[idx].password = trimmedPassword;
          saveClientsList(clients);
        } else {
          // If the account was not yet in local clients list, add it so user can log in
          const newClient = {
            id: `client_${Date.now()}`,
            name: targetEmail.split('@')[0],
            email: targetEmail,
            password: trimmedPassword,
            role: 'client',
            ordersCount: 0,
            totalSpent: 0,
            joinedDate: new Date().toISOString().split('T')[0],
            city: '',
            isLoggedIn: false
          };
          saveClientsList([newClient, ...clients]);
        }
      }
      const currentUser = getStoredUser();
      if (currentUser && (!targetEmail || currentUser.email?.toLowerCase() === targetEmail)) {
        storeUser({ ...currentUser, password: trimmedPassword });
      }
      localStorage.removeItem('greennest_pending_reset_email');
      localStorage.removeItem('greennest_pending_reset_token');
    } catch (e) {
      console.warn('Failed to sync local password', e);
    }
  };

  try {
    const data = await apiPost('/api/auth/reset-password', {
      token: token.trim(),
      newPassword: trimmedPassword,
      email: targetEmail
    });

    // Update password in local storage so client credentials remain in sync
    syncLocalPassword();
    return data;
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    const isServiceDown =
      msg.includes('404') ||
      msg.includes('not found') ||
      msg.includes('network') ||
      msg.includes('timed out') ||
      msg.includes('failed to fetch') ||
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('504');

    if (isServiceDown || token.startsWith('local-')) {
      syncLocalPassword();
      return {
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.'
      };
    }
    throw err;
  }
}
