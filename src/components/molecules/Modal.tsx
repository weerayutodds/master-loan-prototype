"use client"

import {useEffect} from "react"
import {createPortal} from "react-dom"

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "md" | "lg"
  variant?: "form" | "info"
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  md: "max-w-md",
  lg: "max-w-[556px]",
}

const variantClasses: Record<NonNullable<ModalProps["variant"]>, string> = {
  form: "rounded-[20px] border-2 border-card-border shadow-primary-s",
  info: "rounded-2xl shadow-secondary-m",
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  variant = "form",
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClasses[size]} ${variantClasses[variant]} bg-surface p-6`}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        ) : null}
        <div className={title ? "mt-4" : ""}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
