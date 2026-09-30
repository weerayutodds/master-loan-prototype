"use client"

import React from "react"
import { Modal } from "../molecules/Modal"

type ErrorModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export function ErrorModal({
  open,
  onClose,
  title,
  description,
  buttonText = "Close",
  onButtonClick,
}: ErrorModalProps) {
  const handleAction = () => {
    if (onButtonClick) onButtonClick()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} size="md" variant="info">
      {/* Modal Container: Flex column, centered, 32px gap */}
      <div className="flex flex-col items-center gap-8 pt-2">
        
        {/* Emptystate (Icon + Details): 8px gap */}
        <div className="flex flex-col items-center gap-2 w-full">
          
          {/* Icon: remove-circle-solid (64x64) */}
          <div className="flex h-16 w-16 items-center justify-center text-[#F85754]">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 58.6667C46.7276 58.6667 58.6667 46.7276 58.6667 32C58.6667 17.2724 46.7276 5.33334 32 5.33334C17.2724 5.33334 5.33334 17.2724 5.33334 32C5.33334 46.7276 17.2724 58.6667 32 58.6667Z"
                fill="currentColor"
              />
              <path
                d="M40 24L24 40M24 24L40 40"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Details (Title + Description): 4px gap */}
          <div className="flex flex-col items-center gap-1 w-full mt-2">
            <h3 className="text-center text-[20px] font-semibold leading-[160%] tracking-[0.01em] text-[#414243]">
              {title}
            </h3>
            <p className="text-center text-[16px] font-normal leading-[160%] tracking-[0.01em] text-[#414243]">
              {description}
            </p>
          </div>
        </div>

        {/* Button Group */}
        <div className="flex w-full items-center justify-center">
          <button
            onClick={handleAction}
            className="flex h-12 w-full min-w-[160px] items-center justify-center rounded-xl bg-gradient-to-br from-[#3F74F5] from-10% to-[#334ED1] to-[78.19%] px-6 py-2 transition-opacity hover:opacity-90"
          >
            <span className="text-center text-[18px] font-semibold leading-[160%] tracking-[0.01em] text-white">
              {buttonText}
            </span>
          </button>
        </div>
        
      </div>
    </Modal>
  )
}