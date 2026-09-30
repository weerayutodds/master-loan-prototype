"use client"

import {createPortal} from "react-dom"

type LoadingToastProps = {
  open: boolean
  title?: string
  description?: string
}

export function LoadingToast({
  open,
  title = "กำลังบันทึกข้อมูล",
  description = "กรุณารอสักครู่...",
}: LoadingToastProps) {
  if (!open || typeof document === "undefined") return null

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-auto">
      <div className="flex min-h-37.75 min-w-75.25 flex-col items-center justify-center gap-2 rounded-lg bg-[#1E1E1F]/80 shadow-secondary-xs">
        <div className="relative h-10 w-10 animate-spin">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #FFFFFF 0deg, #FFFFFF 63.24deg, rgba(255, 255, 255, 0) 360deg)",
              WebkitMask:
                "radial-gradient(closest-side, transparent 70%, black 72%)",
              mask: "radial-gradient(closest-side, transparent 70%, black 72%)",
            }}
          />
          <div className="absolute left-[17.2px] top-8.5 h-1.5 w-1.5 rounded-full bg-white" />
        </div>

        <div className="mt-2 flex flex-col items-center text-white">
          <p className="text-lg font-medium leading-[160%] tracking-[0.01em]">
            {title}
          </p>
          {description && (
            <p className="text-base font-normal leading-[160%] tracking-[0.01em]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
