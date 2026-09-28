"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { isValidThaiPhone } from "@/lib/validation";

const PHONE_ERROR_MESSAGE = "รูปแบบเบอร์มือถือไม่ถูกต้อง";

type PhoneNumberFormValues = {
  phone: string;
};

type PhoneNumberModalProps = {
  open: boolean;
  initialValue?: string;
  onClose: () => void;
  onSave: (phone: string) => void;
};

export function PhoneNumberModal({
  open,
  initialValue,
  onClose,
  onSave,
}: PhoneNumberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhoneNumberFormValues>({
    defaultValues: { phone: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ phone: initialValue ?? "" });
  }, [open, initialValue, reset]);

  function onSubmit(data: PhoneNumberFormValues) {
    onSave(data.phone);
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="text-center text-xl font-semibold text-foreground">
          เพิ่มเบอร์มือถือ
        </h2>

        <div className="border-t border-divider" />

        <FormField label="เบอร์มือถือ" error={errors.phone?.message}>
          <Input
            type="tel"
            placeholder="กรอกเบอร์มือถือ"
            invalid={!!errors.phone}
            {...register("phone", {
              required: "กรุณากรอกเบอร์มือถือ",
              validate: (value) =>
                isValidThaiPhone(value) || PHONE_ERROR_MESSAGE,
            })}
          />
        </FormField>

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
