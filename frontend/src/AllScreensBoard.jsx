import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { 
  ArrowRightIcon, 
  LeafIcon,
  SproutIcon,
  PottedPlantIcon,
  MonsteraLeafIcon,
  FlowerIcon,
  WateringCanIcon,
  GreenhouseIcon,
  PlantCartIcon,
  PlantPackageIcon,
  PlantKeyIcon,
  HeartIcon,
  SearchIcon,
  MailIcon
} from './Icons';

export default function AllScreensBoard() {
  const screens = [
    {
      title: 'Home Page',
      icon: SproutIcon,
      color: 'bg-emerald-100 text-emerald-800',
      route: '/',
      desc: 'Hero section with CTA, trust badges (Free Shipping, Plant Care, Secure Payments), "Why Shop with GreenNest?", and featured collection.',
      previewBg: 'bg-[#edf7ea]',
      tag: 'Storefront'
    },
    {
      title: 'Plant Shop / Catalog',
      icon: PottedPlantIcon,
      color: 'bg-teal-100 text-teal-800',
      route: '/shop',
      desc: 'Plant collection banner, filter sidebar (Categories, Price range, Sunlight), sort dropdown, and responsive catalog card grid.',
      previewBg: 'bg-[#eaf3eb]',
      tag: 'Catalog'
    },
    {
      title: 'Product Details',
      icon: MonsteraLeafIcon,
      color: 'bg-green-100 text-green-800',
      route: '/plants/monstera-deliciosa',
      desc: 'Monstera Deliciosa with 4-angle thumbnail gallery, rating, pricing discount, feature badges, quantity stepper, and tabbed info.',
      previewBg: 'bg-[#f4f7f4]',
      tag: 'Product'
    },
    {
      title: 'Shopping Cart',
      icon: PlantCartIcon,
      color: 'bg-lime-100 text-lime-800',
      route: '/cart',
      desc: 'Cart items (Monstera Deliciosa, Snake Plant), quantity steppers, trash removal, Order Summary, coupon code input, and checkout button.',
      previewBg: 'bg-white',
      tag: 'Cart'
    },
    {
      title: 'Checkout',
      icon: PlantPackageIcon,
      color: 'bg-amber-100 text-amber-800',
      route: '/checkout',
      desc: 'Progress indicator (Shipping → Payment → Review), Shipping Address form (Hariharan S), and order summary recap.',
      previewBg: 'bg-white',
      tag: 'Checkout'
    },
    {
      title: 'Payment Success',
      icon: FlowerIcon,
      color: 'bg-emerald-100 text-emerald-800',
      route: '/payment-success',
      desc: 'Circular checkmark badge, "Payment Successful!", Order ID #GN2026101, delivery recap, and continue shopping action.',
      previewBg: 'bg-[#eaf5ec]',
      tag: 'Order Confirmed'
    },
    {
      title: 'Login',
      icon: PlantKeyIcon,
      color: 'bg-emerald-100 text-emerald-700',
      route: '/login',
      desc: 'Welcome Back sign-in form, email/password inputs, show/hide toggle, and botanical arch graphic.',
      previewBg: 'bg-white',
      tag: 'Authentication'
    },
    {
      title: 'Sign Up',
      icon: LeafIcon,
      color: 'bg-green-100 text-green-700',
      route: '/signup',
      desc: 'Create Account registration, Name, Email, Password, Terms agreement checkbox, and architectural plant arch.',
      previewBg: 'bg-white',
      tag: 'Authentication'
    },
    {
      title: 'Forgot Password',
      icon: MailIcon,
      color: 'bg-teal-100 text-teal-700',
      route: '/forgot-password',
      desc: 'Botanical envelope icon, email password reset link input, interactive confirmation state, and back to login link.',
      previewBg: 'bg-white',
      tag: 'Account Recovery'
    },
    {
      title: 'About Us',
      icon: GreenhouseIcon,
      color: 'bg-emerald-100 text-emerald-800',
      route: '/about',
      desc: 'GreenNest story, Our Mission callout, 10K+ Customers / 4.8 Rating / Free Shipping statistics, and greenhouse nursery shelf.',
      previewBg: 'bg-[#f4f8f3]',
      tag: 'Brand Story'
    },
    {
      title: 'Contact Us',
      icon: WateringCanIcon,
      color: 'bg-teal-100 text-teal-800',
      route: '/contact',
      desc: 'Get in Touch details (Phone, Email, 123 Green Street, Chennai), social links, and interactive contact message form.',
      previewBg: 'bg-white',
      tag: 'Support'
    },
    {
      title: 'Wishlist',
      icon: HeartIcon,
      color: 'bg-rose-100 text-rose-700',
      route: '/wishlist',
      desc: 'My Wishlist with active heart toggles, dynamic counter badge, empty state with discovery CTA, and Add to Cart buttons.',
      previewBg: 'bg-[#f7faf7]',
      tag: 'Wishlist'
    },
    {
      title: 'Search Results',
      icon: SearchIcon,
      color: 'bg-green-100 text-green-800',
      route: '/search?q=monstera',
      desc: 'Search query context for "monstera" (15 results), category and price filters, and matching product grid.',
      previewBg: 'bg-[#f7faf7]',
      tag: 'Search'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#eaf1e9]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[1720px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e4d2b] text-white text-xs font-semibold uppercase tracking-wider mb-3">
              <LeafIcon className="w-3.5 h-3.5" />
              GreenNest Design Board
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142e1b] tracking-tight">
              Botanical Mockup Screens
            </h1>
            <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
              Explore every screen created for the GreenNest botanical platform. Click any screen card to open and interact with the full page.
            </p>
          </div>

          {/* Grid of 13 Screen Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {screens.map((s) => {
              const IconComponent = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-white rounded-3xl border border-[#d2ded0] shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Screen Card Header with plant icon pill */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                    <div className="inline-flex items-center gap-2 bg-[#1e4d2b] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                      <IconComponent className="w-4 h-4 text-emerald-300" />
                      <span>{s.title}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      {s.tag}
                    </span>
                  </div>

                  {/* Preview Frame */}
                  <div className={`p-6 ${s.previewBg} flex-1 flex flex-col justify-center border-b border-gray-100 min-h-[160px]`}>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {s.desc}
                    </p>
                    <div className="mt-3 text-[11px] font-mono text-[#1e4d2b] font-semibold bg-white/70 py-1 px-2.5 rounded-lg border border-emerald-200/60 inline-block w-fit">
                      Route: {s.route}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="p-4 bg-white">
                    <Link
                      to={s.route}
                      className="w-full bg-[#1e4d2b] hover:bg-[#163b21] group-hover:shadow-md text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Open {s.title}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
