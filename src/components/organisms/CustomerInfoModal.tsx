"use client";

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import type { CustomerInfo } from "@/types/ratebook";

type CustomerInfoModalProps = {
  open: boolean;
  initialValue?: CustomerInfo;
  onClose: () => void;
  onSave: (info: CustomerInfo) => void;
};

export function CustomerInfoModal({ open, initialValue, onClose, onSave }: CustomerInfoModalProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      phone: String(data.get("phone") ?? ""),
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="ข้อมูลลูกค้า">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ชื่อ">
            <Input name="firstName" defaultValue={initialValue?.firstName} />
          </FormField>
          <FormField label="นามสกุล">
            <Input name="lastName" defaultValue={initialValue?.lastName} />
          </FormField>
        </div>
        <FormField label="เบอร์โทรศัพท์">
          <Input name="phone" type="tel" defaultValue={initialValue?.phone} />
        </FormField>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="primary">
            บันทึก
          </Button>
        </div>
      </form>
    </Modal>
  );
}
