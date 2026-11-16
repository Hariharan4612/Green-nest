# GreenNest — Botanical Plant E-Commerce Platform

A modern, responsive botanical plant nursery and indoor plant e-commerce web application crafted with **React 19**, **Vite**, **Tailwind CSS v4**, and **React Router v7**.

## 🌿 All 13 Mockup Screens Implemented

All 13 screens from the design have been implemented with pixel-accurate layout, interactive state, and responsive design:

| # | Screen | Route | Key Features |
|---|---|---|---|
| **01** | **Home Page** | `/` | Hero with CTA, Trust badges (Free shipping, 24/7 care, Secure payments), "Why Shop with GreenNest?", trending indoor plants showcase |
| **02** | **Plant Shop / Catalog** | `/shop` | Category sidebar filters (Indoor, Outdoor, Flowering, Succulents, Air Purifying, Pet Friendly), price range slider, sort dropdown, responsive product grid |
| **03** | **Product Details** | `/plants/:plantId` | Breadcrumb navigation, 4-photo interactive thumbnail gallery, pricing discount badge, feature tags (Air Purifying, Low Maintenance, Indoor Friendly), quantity stepper, Add to Cart, Product Highlights, interactive tabs (Description, Care Guide, Reviews, FAQs) |
| **04** | **Shopping Cart** | `/cart` | Item quantity steppers, item totals, trash/remove action, Clear Cart, order summary with subtotal, free shipping calculator, coupon code input (`GREEN10`), Proceed to Checkout |
| **05** | **Checkout** | `/checkout` | 3-step progress bar (Shipping → Payment → Review), Shipping Address form with prefilled defaults, delivery speed selection (Standard vs Express), order summary recap |
| **06** | **Payment Success** | `/payment-success` | Large animated green checkmark, Order ID `#GN2026101`, receipt breakdown, corner botanical illustrations, Continue Shopping & Return Home actions |
| **07** | **Login** | `/login` | Split-card layout with architectural botanical arch, Email & password inputs with show/hide toggle, Remember Me, Forgot Password link, Google & Facebook social buttons |
| **08** | **Sign Up** | `/signup` | Create Account form, Name, Email, Password, Terms agreement checkbox, social login alternatives, matching architectural greenery backdrop |
| **09** | **Forgot Password** | `/forgot-password` | Botanical mail envelope icon, email reset link input, interactive feedback state upon sending, Back to Login shortcut |
| **10** | **About Us** | `/about` | GreenNest story, Our Mission callout, nursery shelf photography, 10K+ Happy Customers / 4.8 Rating / Free Eco Shipping stats |
| **11** | **Contact Us** | `/contact` | Phone (+91 98765 43210), Email, Nursery location (123 Green Street, Chennai), social links, interactive message contact form with confirmation toast |
| **12** | **Wishlist** | `/wishlist` | "My Wishlist (4 items)", Peace Lily, Rubber Plant, Areca Palm, Snake Plant, active heart toggles, Add to Cart, Clear All |
| **13** | **Search Results** | `/search?q=monstera` | Search bar query context ("monstera"), filter sidebar by category & price brackets, real-time filtered results (Monstera Deliciosa, Monstera Adansonii, Mini Monstera) |

---

## ⚡ Instant Screen Navigator

A top sticky **Screen Navigator Bar** is included across the application, allowing reviewers to jump to any of the 13 screens in a single click:
`[01 Home]` `[02 Shop]` `[03 Details]` `[04 Cart]` `[05 Checkout]` `[06 Success]` `[07 Login]` `[08 Sign Up]` `[09 Forgot]` `[10 About]` `[11 Contact]` `[12 Wishlist]` `[13 Search]`

---

## 🚀 Running Locally

### 1. Backend Setup & Perenual API Configuration

1. Create a `backend/.env` file (or copy `backend/.env.example`):
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Get your free API key at [Perenual API Documentation](https://perenual.com/docs/api) and set it in `backend/.env`:
   ```env
   PERENUAL_API_KEY=your_actual_key_here
   PORT=4000
   ```
   *(Note: If no API key is provided, the backend automatically provides a rich curated fallback catalog so plant details and search still work without interruptions).*

3. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend API runs on `http://localhost:4000`.

### 2. Frontend

In a separate terminal:
```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite (e.g. `http://localhost:5173`). Vite automatically proxies `/api/*` to the backend on port 4000.

### Production Build

```bash
cd frontend
npm run build
npm run preview
```
