import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircleIcon, XIcon, LeafIcon } from '../Icons';

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isInfo = toast.type === 'info';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[9999] max-w-sm sm:max-w-md animate-toastSlideIn"
    >
      <div className="flex items-center gap-3.5 bg-[#142e1b]/95 backdrop-blur-md text-white px-4.5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 ring-1 ring-black/10">
        {/* Icon Badge */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isInfo
              ? 'bg-teal-500/20 text-teal-300'
              : 'bg-emerald-500/25 text-emerald-300'
          }`}
        >
          {isInfo ? (
            <LeafIcon className="w-5 h-5" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 pr-1">
          <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-0.5">
            {isInfo ? 'Notice' : 'Success'}
          </p>
          <p className="text-sm font-medium text-white leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Dismiss Button */}
        {hideToast && (
          <button
            type="button"
            onClick={hideToast}
            className="p-1 text-emerald-300/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
