import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircleIcon, XIcon, LeafIcon, AlertTriangleIcon } from '../Icons';

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';
  const isSuccess = !isError && !isWarning && !isInfo;

  let title = 'Success';
  let badgeClasses = 'bg-emerald-500/25 text-emerald-300';
  let borderClasses = 'border-emerald-500/40';
  let titleColor = 'text-emerald-300';

  if (isError) {
    title = 'Error';
    badgeClasses = 'bg-red-500/25 text-red-300';
    borderClasses = 'border-red-500/40';
    titleColor = 'text-red-400';
  } else if (isWarning) {
    title = 'Warning';
    badgeClasses = 'bg-amber-500/25 text-amber-300';
    borderClasses = 'border-amber-500/40';
    titleColor = 'text-amber-300';
  } else if (isInfo) {
    title = 'Notice';
    badgeClasses = 'bg-teal-500/20 text-teal-300';
    borderClasses = 'border-teal-500/40';
    titleColor = 'text-teal-300';
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[9999] max-w-sm sm:max-w-md animate-toastSlideIn"
    >
      <div className={`flex items-center gap-3.5 bg-[#142e1b]/95 backdrop-blur-md text-white px-4.5 py-3.5 rounded-2xl shadow-2xl border ${borderClasses} ring-1 ring-black/10`}>
        {/* Icon Badge */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${badgeClasses}`}
        >
          {isError ? (
            <AlertTriangleIcon className="w-5 h-5 text-red-400" />
          ) : isWarning ? (
            <AlertTriangleIcon className="w-5 h-5 text-amber-300" />
          ) : isInfo ? (
            <LeafIcon className="w-5 h-5" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 pr-1">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${titleColor}`}>
            {title}
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
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
