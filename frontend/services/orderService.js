/**
 * orderService.js — GreenNest Order / Cart Service
 */

const ORDERS_KEY = 'greennest_orders';
const FREE_SHIPPING_THRESHOLD = 35;
const SHIPPING_FEE = 4.99;

export function calculateTotals(cartItems = []) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    isFreeShipping: shipping === 0,
  };
}

export async function placeOrder({ items, shippingAddress, paymentMethod }) {
  if (!items?.length) throw new Error('Cart is empty.');

  const totals = calculateTotals(items);
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const order = {
    orderId,
    items,
    shippingAddress,
    paymentMethod,
    totals,
    placedAt: new Date().toISOString(),
    status: 'confirmed',
  };

  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    existing.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch {
    // ignore storage errors
  }

  return { orderId, totals };
}

export function getOrderHistory() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

