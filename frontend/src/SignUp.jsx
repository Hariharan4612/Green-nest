import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { register } from '../services/authService';
import { 
  LeafIcon, 
  UserIcon, 
  MailIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  RefreshIcon
} from './Icons';
import { validateEmail, validateName, validatePassword, getPasswordStrength } from './utils/validation';

export default function SignUp() {
  const navigate = useNavigate();
  const { user, setUser, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const errs = {};
    const nameErr = validateName(fullName, 'Full name');
    if (nameErr) errs.fullName = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(password, 6);
    if (passErr) errs.password = passErr;

    if (!agreeTerms) {
      errs.agreeTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: fullName.trim(),
        email: email.trim(),
        password: password.trim()
      });

      setUser(res.user);
      const toastMsg = res.emailSent 
        ? `🎉 Account created! A welcome email was sent to ${res.user.email}.`
        : `🎉 Account created successfully! Welcome to GreenNest, ${res.user.name}.`;
      showToast(toastMsg, 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create user. Please try again.');
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
          
          {/* Left Column: Simple & Clean Sign Up Form */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e4d2b] uppercase tracking-wider mb-2">
                <LeafIcon className="w-4 h-4 text-emerald-600" />
                GreenNest Account
              </div>
              <h1 className="text-3xl font-extrabold text-[#142e1b] tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Enter your details to create your GreenNest account and start your green journey.
              </p>
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.fullName
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.fullName}</p>
                )}
              </div>

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
                    placeholder="e.g. priya.client@greennest.com"
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
                    placeholder="Choose a password (min. 6 characters)"
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

                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Strength:</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${Math.max(passwordStrength.score, 15)}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.password}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: '' }));
                    }}
                    className="accent-[#1e4d2b] rounded"
                  />
                  <span>I agree to GreenNest's Terms & Conditions and Privacy Policy</span>
                </div>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>


            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#1e4d2b] hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Right Column: Architectural botanical image matching Screen 08 */}
          <div className="hidden md:block md:col-span-5 bg-gradient-to-br from-[#dfeed7] via-[#cfebd2] to-[#aee0b4] relative overflow-hidden p-8 flex flex-col justify-end">
            <div className="absolute inset-x-8 top-12 bottom-24 rounded-t-full bg-white/40 border border-white/60 backdrop-blur-xs flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
                alt="GreenNest Sanctuary Arch"
                className="w-full h-full object-cover object-bottom"
              />
            </div>
            <div className="relative z-10 text-center bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
              <p className="text-xs font-bold text-[#142e1b]">Join 10k+ Plant Parents</p>
              <p className="text-[11px] text-gray-600">Grow healthy greenery with complimentary care tips.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
