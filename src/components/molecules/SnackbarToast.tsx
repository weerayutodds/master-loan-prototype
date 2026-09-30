"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/atoms/Icon";

type SnackbarToastProps = {
  open: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
};

export function SnackbarToast({
  open,
  message,
  onClose,
  duration = 3000,
}: SnackbarToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed left-1/2 top-[200px] z-[9999] -translate-x-1/2">
      <div className="flex h-[46px] w-[362px] flex-row items-center gap-[6px] rounded-xl bg-[#D7FFE4] px-3 py-2.5 pointer-events-auto shadow-sm">
        {/* Icon Container */}
        <div className="flex h-[26px] w-[24px] flex-row items-start pt-[2px]">
          <Icon name="check-circle-solid" className="size-6 text-success" />
        </div>

        {/* Text Container */}
        <div className="flex h-[26px] flex-1 flex-col items-start">
          <span className="font-secondary text-[16px] font-medium leading-[160%] tracking-[0.01em] text-foreground">
            {message}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}