import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FloatingScreenSwitcher from './components/FloatingScreenSwitcher.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

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
        {/* All 13 screens matching mockup image */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<PlantShop />} />
        <Route path="/plants/:plantId" element={<ProductDetails />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Visual overview board of all 13 screens */}
        <Route path="/screens" element={<AllScreensBoard />} />

        {/* Auxiliary user routes */}
        <Route path="/scan" element={<AiPlantScannerPage />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
