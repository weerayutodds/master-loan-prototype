"use client";

import { useEffect } from "react";

type ToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
};

export function Toast({ open, message, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex w-62.5 flex-col items-center justify-center gap-2 rounded-lg bg-toast p-6 shadow-secondary-xs">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#FFFFFF" />
          <path
            d="M13 20.5 17.5 25 27 15.5"
            stroke="#1E1E1F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-center text-lg font-medium text-white">{message}</p>
      </div>
    </div>
  );
}
