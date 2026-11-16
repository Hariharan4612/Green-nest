import React, { createContext, useContext, useState, useEffect } from 'react';
import { plantsData } from '../data/plants';
import { 
  getStoredUser, 
  storeUser, 
  clearUser 
} from '../../services/authService.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Cart state: loads user's saved cart from localStorage or starts empty
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('greennest_cart');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.id && typeof item.price === 'number');
        }
      }
    } catch { /* ignore */ }
    return [];
  });

  // Wishlist state: starts empty unless the user explicitly added items
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('greennest_wishlist');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Remove the legacy mock 4-item auto-preload so wishlist is empty unless user added items
          const isLegacyMockPreload = parsed.length === 4 &&
            parsed.every(item => 
              [3, 5, 6, 7, 'peace-lily', 'rubber-plant', 'areca-palm', 'snake-plant'].includes(item.id) ||
              [3, 5, 6, 7].includes(Number(item.id))
            );
          if (!isLegacyMockPreload) {
            return parsed.filter(item => item && item.id);
          }
        }
      }
    } catch { /* ignore */ }
    return [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greennest_cart', JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart]);

  // Persist wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greennest_wishlist', JSON.stringify(wishlist));
    } catch { /* ignore */ }
  }, [wishlist]);

  // User auth state with role support: only changes when user actually logs in!
  const [user, setUserState] = useState(() => getStoredUser());

  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser && newUser.isLoggedIn) {
      storeUser(newUser);
    } else {
      clearUser();
    }
  };

  const logout = () => {
    setUser(null);
    clearUser();
    showToast('Logged out successfully', 'info');
  };

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (plant, quantity = 1) => {
    if (!plant || !plant.id) return;
    setCart(prev => {
      const existing = prev.find(item => item && item.id === plant.id);
      if (existing) {
        return prev.map(item =>
          item.id === plant.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      return [...prev.filter(item => item && item.id), { ...plant, quantity }];
    });
    showToast(`Added ${plant.name} to cart!`);
  };

  const updateQuantity = (plantId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(plantId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === plantId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (plantId) => {
    setCart(prev => prev.filter(item => item.id !== plantId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = (silent = false) => {
    setCart([]);
    if (!silent) {
      showToast('Cart cleared', 'info');
    }
  };

  // Wishlist operations
  const toggleWishlist = (plant) => {
    const exists = wishlist.some(item => item.id === plant.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== plant.id));
      showToast(`Removed ${plant.name} from wishlist`, 'info');
    } else {
      setWishlist(prev => [...prev, plant]);
      showToast(`Added ${plant.name} to wishlist!`);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  const isInWishlist = (plantId) => {
    return wishlist.some(item => item.id === plantId);
  };

  // Cart Calculations
  const validCart = cart.filter(item => item && item.id && typeof item.price === 'number');
  const cartCount = validCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartSubtotal = validCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shippingFee = cartSubtotal > 35 || cartSubtotal === 0 ? 0.00 : 4.99;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <AppContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        user,
        setUser,
        logout,
        toast,
        showToast,
        hideToast: () => setToast(null)
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

