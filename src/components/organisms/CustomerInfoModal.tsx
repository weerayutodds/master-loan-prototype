"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { isValidThaiPhone } from "@/lib/validation";
import type { CustomerInfo } from "@/types/ratebook";

const PHONE_ERROR_MESSAGE = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";

type CustomerInfoModalProps = {
  open: boolean;
  initialValue?: CustomerInfo;
  onClose: () => void;
  onSave: (info: CustomerInfo) => void;
};

export function CustomerInfoModal({ open, initialValue, onClose, onSave }: CustomerInfoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInfo>({
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      firstName: initialValue?.firstName ?? "",
      lastName: initialValue?.lastName ?? "",
      phone: initialValue?.phone ?? "",
    });
  }, [open, initialValue, reset]);

  function onSubmit(data: CustomerInfo) {
    onSave(data);
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="text-center text-xl font-semibold text-foreground">
          ข้อมูลลูกค้า
        </h2>

        <div className="border-t border-divider" />

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="ชื่อ" error={errors.firstName?.message}>
              <Input
                placeholder="กรอกชื่อ"
                invalid={!!errors.firstName}
                {...register("firstName", { required: "กรุณากรอกชื่อ" })}
              />
            </FormField>
            <FormField label="นามสกุล" error={errors.lastName?.message}>
              <Input
                placeholder="กรอกนามสกุล"
                invalid={!!errors.lastName}
                {...register("lastName", { required: "กรุณากรอกนามสกุล" })}
              />
            </FormField>
            <FormField label="เบอร์โทรศัพท์" error={errors.phone?.message}>
              <Input
                type="tel"
                placeholder="0812345678"
                invalid={!!errors.phone}
                {...register("phone", {
                  required: "กรุณากรอกเบอร์โทรศัพท์",
                  validate: (value) => isValidThaiPhone(value) || PHONE_ERROR_MESSAGE,
                })}
              />
            </FormField>
          </div>
        </div>

        <div className="border-t border-divider" />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            บันทึก
          </Button>
        </div>
      </form>
    </Modal>
  );
}
