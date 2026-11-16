import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, LeafIcon, CheckCircleIcon } from './Icons';
import { validateEmail, validateName, validateRequired } from './utils/validation';

export default function ContactUs() {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const errs = {};
    const nameErr = validateName(formData.name, 'Your name');
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) errs.email = emailErr;

    const msgErr = validateRequired(formData.message, 'Message', 10);
    if (msgErr) errs.message = msgErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitted(true);
    showToast('Your message has been sent to our plant specialists!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] relative overflow-hidden">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 relative">
        {/* Botanical corner decor matching Screen 11 */}
        <div className="absolute bottom-0 left-0 pointer-events-none opacity-20 lg:opacity-40 -translate-x-12 translate-y-12">
          <LeafIcon className="w-96 h-96 text-emerald-800" />
        </div>

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
          <div className="bg-white rounded-3xl border border-[#e2ece0] shadow-sm overflow-hidden p-8 sm:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Contact details matching Screen 11 */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e4d2b] uppercase tracking-wider mb-2">
                    <LeafIcon className="w-4 h-4 text-emerald-600" />
                    Help & Support
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142e1b] tracking-tight">
                    Get in Touch
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                    We'd love to hear from you! Fill out the form or reach out to our botanists directly.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <PhoneIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Phone</h4>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">+91 98765 43210</p>
                      <p className="text-[11px] text-gray-400">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <MailIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Email</h4>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">support@greennest.com</p>
                      <p className="text-[11px] text-gray-400">Response within 2 hours</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1e4d2b] flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Nursery Location</h4>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">
                        123 Green Street, Chennai, India - 600001
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social media links matching Screen 11 */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Follow Our Greenhouse
                  </h4>
                  <div className="flex items-center gap-3 text-gray-600">
                    <a href="#facebook" className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1e4d2b] flex items-center justify-center transition-colors">
                      <FacebookIcon className="w-4 h-4 fill-current" />
                    </a>
                    <a href="#instagram" className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1e4d2b] flex items-center justify-center transition-colors font-bold text-xs">
                      ig
                    </a>
                    <a href="#linkedin" className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#1e4d2b] flex items-center justify-center transition-colors font-bold text-xs">
                      in
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form matching Screen 11 */}
              <div className="lg:col-span-7 bg-[#f9fbf9] p-6 sm:p-10 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                {!submitted ? (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        placeholder="e.g. Hariharan S"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                          errors.name
                            ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                        }}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white ${
                          errors.email
                            ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="5"
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                        }}
                        placeholder="How can we help your plants thrive? (min. 10 characters)"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors bg-white resize-none ${
                          errors.message
                            ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-[#1e4d2b]'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-red-600 font-medium mt-1">⚠️ {errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1e4d2b] hover:bg-[#163b21] active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/10 cursor-pointer"
                    >
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1e4d2b] flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Message Delivered!</h3>
                    <p className="text-xs text-gray-600 max-w-sm mx-auto">
                      Thank you for contacting GreenNest. Our botanical support team will respond to {formData.email} shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-semibold text-[#1e4d2b] hover:underline pt-2"
                    >
                      Send another message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
