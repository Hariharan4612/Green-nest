import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { login } from '../services/authService';
import { EyeIcon, EyeOffIcon, LeafIcon, MailIcon, LockIcon, ShieldCheckIcon, RefreshIcon } from './Icons';
import { validateEmail, validateRequired } from './utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errs = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validateRequired(password, 'Password');
    if (passErr) errs.password = passErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4">
        <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#e2ece0] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Sign in form matching Screen 07 */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e4d2b] uppercase tracking-wider mb-2">
                <LeafIcon className="w-4 h-4 text-emerald-600" />
                GreenNest Account
              </div>
              <h1 className="text-3xl font-extrabold text-[#142e1b] tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Sign in to your GreenNest account to explore plants and track orders.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MailIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LockIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.password}</p>
                )}
              </div>

              {/* Remember me & Forgot Password matching Screen 07 */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#1e4d2b] rounded"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#1e4d2b] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Login Button matching Screen 07 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 mt-2 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>


            {/* Sign up prompt */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-[#1e4d2b] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Right Column: Architectural botanical image matching Screen 07 */}
          <div className="hidden md:block md:col-span-5 bg-gradient-to-br from-[#e5efe3] via-[#d2e7cf] to-[#b8ddb4] relative overflow-hidden p-8 flex flex-col justify-end">
            <div className="absolute inset-x-8 top-12 bottom-24 rounded-t-full bg-white/40 border border-white/60 backdrop-blur-xs flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80"
                alt="GreenNest Botanical Sanctuary"
                className="w-full h-full object-cover object-bottom"
              />
            </div>
            <div className="relative z-10 text-center bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <p className="text-xs font-bold text-[#142e1b]">Green Living Starts Here</p>
              <p className="text-[11px] text-gray-600">Over 10,000 thriving indoor plants delivered.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
