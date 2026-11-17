import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MailIcon, ArrowLeftIcon, CheckCircleIcon, RefreshIcon } from './Icons';
import { validateEmail } from './utils/validation';
import { forgotPassword } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setApiError('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setSuccessInfo(res);
      setIsSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to send reset email. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] w-full">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-8 lg:px-12 w-full">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#e2ece0] p-8 sm:p-10 shadow-xl text-center relative overflow-hidden">
          {/* Botanical Envelope Graphic matching Screen 09 */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1e4d2b] flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-sm">
            <MailIcon className="w-8 h-8 text-[#1e4d2b]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142e1b] tracking-tight">
            Forgot Password?
          </h1>

          <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">
            Enter your email address and we'll send you a secure link to reset your account password.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MailIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                      if (apiError) setApiError('');
                    }}
                    placeholder="Enter your email (e.g. yourname@gmail.com)"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      error
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] disabled:opacity-60 active:scale-[0.98] text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#142e1b] text-sm">
                {successInfo?.sentViaSmtp ? 'Reset email dispatched!' : 'Reset link generated!'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {successInfo?.sentViaSmtp ? (
                  <>We've dispatched password reset instructions to <strong>{email}</strong>. Please check your Gmail inbox and spam folder.</>
                ) : (
                  <>Password reset link is ready for <strong>{email}</strong>.</>
                )}
              </p>

              {successInfo?.resetLink && (
                <div className="mt-3 p-3.5 bg-white border border-emerald-200 rounded-xl text-left text-[11px] text-gray-700 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#142e1b] flex items-center gap-1">
                      <span>🔑</span> Reset Password Link
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard && successInfo.resetLink) {
                          navigator.clipboard.writeText(successInfo.resetLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="text-[11px] text-[#1e4d2b] hover:underline font-semibold cursor-pointer"
                    >
                      {copied ? '✓ Copied!' : 'Copy Link'}
                    </button>
                  </div>

                  <Link
                    to={
                      successInfo.resetLink.startsWith('http')
                        ? new URL(successInfo.resetLink).pathname + new URL(successInfo.resetLink).search
                        : successInfo.resetLink
                    }
                    className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <span>Proceed to Reset Password</span>
                    <span>→</span>
                  </Link>

                  <p className="text-[10px] text-gray-400 font-mono break-all pt-1 select-all">
                    {successInfo.resetLink}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSuccessInfo(null);
                }}
                className="text-xs font-semibold text-[#1e4d2b] hover:underline pt-2 block mx-auto cursor-pointer"
              >
                ← Send to another email
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e4d2b] hover:underline"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
