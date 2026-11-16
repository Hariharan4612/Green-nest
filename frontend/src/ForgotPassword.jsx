import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MailIcon, ArrowLeftIcon, CheckCircleIcon } from './Icons';
import { validateEmail } from './utils/validation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsSubmitted(true);
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
                    }}
                    placeholder="Enter your email"
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
                className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 mt-2 cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#142e1b] text-sm">Reset link dispatched!</h4>
              <p className="text-xs text-gray-600">
                We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
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
