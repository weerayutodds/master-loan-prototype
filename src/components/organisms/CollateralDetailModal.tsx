"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { ChassisNumberInfoModal } from "@/components/organisms/ChassisNumberInfoModal";
import { provinceOptions } from "@/lib/mock";
import type { CollateralIdentifier } from "@/types/ratebook";

const schema = z
  .object({
    licensePlateNumber: z.string().optional(),
    licensePlateProvince: z.string().optional(),
    chassisNumber: z.string().optional(),
  })
  .refine(
    (data) => (!!data.licensePlateNumber && !!data.licensePlateProvince) || !!data.chassisNumber,
    {
      message: "กรุณากรอกเลขทะเบียนพร้อมจังหวัด หรือเลขตัวถัง",
      path: ["chassisNumber"],
    },
  );

type FormValues = z.infer<typeof schema>;

type CollateralDetailModalProps = {
  open: boolean;
  initialValue?: CollateralIdentifier;
  onClose: () => void;
  onSave: (value: CollateralIdentifier) => void;
};

export function CollateralDetailModal({
  open,
  initialValue,
  onClose,
  onSave,
}: CollateralDetailModalProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { licensePlateNumber: "", licensePlateProvince: "", chassisNumber: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      licensePlateNumber: initialValue?.licensePlateNumber ?? "",
      licensePlateProvince: initialValue?.licensePlateProvince ?? "",
      chassisNumber: initialValue?.chassisNumber ?? "",
    });
  }, [open, initialValue, reset]);

  function onSubmit(data: FormValues) {
    onSave(data);
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="text-center text-xl font-semibold text-foreground">
          กรอกเลขทะเบียน / เลขตัวถัง
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="เลขทะเบียนรถ">
            <Input placeholder="EX. 1กก1234" {...register("licensePlateNumber")} />
          </FormField>
          <FormField label="จังหวัดที่จดทะเบียน">
            <Select
              options={[{ value: "", label: "เลือกข้อมูล" }, ...provinceOptions]}
              {...register("licensePlateProvince")}
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-secondary-border" />
          <span className="text-sm text-muted-foreground">หรือ</span>
          <div className="h-px flex-1 bg-secondary-border" />
        </div>

        <FormField
          label={
            <span className="flex items-center gap-1">
              เลขตัวถัง
              <button type="button" onClick={() => setInfoOpen(true)} aria-label="เลขตัวถังคืออะไร">
                <Icon name="info" className="size-4 text-muted-foreground" />
              </button>
            </span>
          }
          error={errors.chassisNumber?.message}
        >
          <Input placeholder="กรอกข้อมูล" {...register("chassisNumber")} />
        </FormField>

        <div className="border-t border-divider" />

        <div className="flex gap-4">
          <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            บันทึก
          </Button>
        </div>
      </form>

      <ChassisNumberInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </Modal>
  );
}
