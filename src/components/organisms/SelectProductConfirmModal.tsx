"use client";

import { Button } from "@/components/atoms/Button";
import { Modal } from "@/components/molecules/Modal";

type SelectProductConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SelectProductConfirmModal({
  open,
  onCancel,
  onConfirm,
}: SelectProductConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} variant="info">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-icon-warning text-3xl font-bold text-white">
          ?
        </span>
        <h2 className="text-xl font-semibold text-foreground">ยืนยันการเลือกผลิตภัณฑ์</h2>
        <p className="text-base text-price-label">
          คุณได้ตรวจสอบอัตราดอกเบี้ยและเงื่อนไข LTV แล้วหรือไม่
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={onConfirm}>
          ยืนยัน
        </Button>
      </div>
    </Modal>
  );
}
