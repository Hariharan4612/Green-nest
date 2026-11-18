import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LockIcon, EyeIcon, EyeOffIcon, RefreshIcon, CheckCircleIcon, MailIcon } from './Icons';
import { validatePassword, validateEmail, getPasswordStrength } from './utils/validation';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(() => {
    return emailParam || localStorage.getItem('greennest_pending_reset_email') || '';
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const errs = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(password, 6);
    if (passErr) errs.password = passErr;

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      setApiError('Reset token is missing. Please click the link from your email or request a new one.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await resetPassword(token, password, email.trim());
      setIsSuccess(true);
    } catch (err) {
      setApiError(err.message || 'Failed to reset password. Your link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] w-full">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ece0] p-8 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <LockIcon className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-[#142e1b] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 mb-6">
            Enter a new password for your GreenNest account.
          </p>

          {!token && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left mb-6 space-y-2">
              <p className="font-bold">⚠️ Missing Reset Token</p>
              <p>No valid reset token was detected in the URL. Please click the reset link directly from your email, or request a new one.</p>
              <Link to="/forgot-password" className="inline-block font-semibold text-emerald-800 underline">
                Go to Forgot Password
              </Link>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* Account Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Account Email <span className="text-red-500">*</span>
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
                    placeholder="Enter your registered email"
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
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
                    placeholder="Min. 6 characters"
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LockIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="Repeat new password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#142e1b] text-sm">Password Updated!</h4>
              <p className="text-xs text-gray-600">
                {email ? (
                  <>Your password for <strong>{email}</strong> has been successfully updated. You can now log in with your new credentials.</>
                ) : (
                  <>Your password has been successfully updated. You can now log in with your new credentials.</>
                )}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] text-white py-2.5 rounded-xl text-xs font-semibold transition-all mt-2 cursor-pointer"
              >
                Go to Sign In
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link to="/login" className="text-xs font-semibold text-[#1e4d2b] hover:underline">
              ← Return to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
