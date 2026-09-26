"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
