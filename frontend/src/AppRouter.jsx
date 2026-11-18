import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FloatingScreenSwitcher from './components/FloatingScreenSwitcher.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute.jsx';

// 13 Core Screens from the mockup
import HomePage from './HomePage.jsx'; // 01
import PlantShop from './PlantShop.jsx'; // 02
import ProductDetails from './ProductDetails.jsx'; // 03
import ShoppingCart from './ShoppingCart.jsx'; // 04
import Checkout from './Checkout.jsx'; // 05
import PaymentSuccess from './PaymentSuccess.jsx'; // 06
import Login from './Login.jsx'; // 07
import SignUp from './SignUp.jsx'; // 08
import ForgotPassword from './ForgotPassword.jsx'; // 09
import AboutUs from './AboutUs.jsx'; // 10
import ContactUs from './ContactUs.jsx'; // 11
import Wishlist from './Wishlist.jsx'; // 12
import SearchResults from './SearchResults.jsx'; // 13

// All 13 Screens Showcase Board (visual board matching initial idea)
import AllScreensBoard from './AllScreensBoard.jsx';

// Auxiliary supporting routes
import MyAccount from './MyAccount.jsx';
import FAQ from './FAQ.jsx';
import AiPlantScannerPage from './AiPlantScannerPage.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import ResetPassword from './ResetPassword.jsx';
import ChangePassword from './ChangePassword.jsx';
import NotFound from './NotFound.jsx';

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Scroll smoothly to top on route change */}
      <ScrollToTop />

      {/* Discreet floating screen switcher widget (bottom-right) */}
      <FloatingScreenSwitcher />

      <Routes>
        {/* Public authentication and password management routes */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected screens: Must login or create account first, then enter Home Page */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><PlantShop /></ProtectedRoute>} />
        <Route path="/plants/:plantId" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><ShoppingCart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />

        {/* Visual overview board of all 13 screens */}
        <Route path="/screens" element={<AllScreensBoard />} />

        {/* Auxiliary user routes */}
        <Route path="/scan" element={<ProtectedRoute><AiPlantScannerPage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
