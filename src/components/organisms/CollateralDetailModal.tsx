"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {Input} from "@/components/atoms/Input"
import {Select} from "@/components/atoms/Select"
import {FormField} from "@/components/molecules/FormField"
import {Modal} from "@/components/molecules/Modal"
import {ChassisNumberInfoModal} from "@/components/organisms/ChassisNumberInfoModal"
import {provinceOptions} from "@/lib/mock"
import type {CollateralIdentifier} from "@/types/ratebook"
import {zodResolver} from "@hookform/resolvers/zod"
import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"

const schema = z
  .object({
    licensePlateNumber: z.string().optional(),
    licensePlateProvince: z.string().optional(),
    chassisNumber: z.string().optional(),
    // Not a real input -- just a slot for the "fill in one or the other"
    // banner message when every field is empty.
    general: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasPlate = !!data.licensePlateNumber?.trim()
    const hasProvince = !!data.licensePlateProvince?.trim()
    const hasChassis = !!data.chassisNumber?.trim()

    if (!hasPlate && !hasProvince && !hasChassis) {
      ctx.addIssue({
        path: ["general"],
        message: "กรุณากรอกข้อมูลเลขทะเบียนรถและจังหวัดที่จดทะเบียน หรือ เลขตัวถัง",
        code: z.ZodIssueCode.custom,
      })
      return
    }

    if (hasProvince && !hasPlate) {
      ctx.addIssue({
        path: ["licensePlateNumber"],
        message: "กรุณากรอกเลขทะเบียนรถ",
        code: z.ZodIssueCode.custom,
      })
    }

    if (hasPlate && !hasProvince) {
      ctx.addIssue({
        path: ["licensePlateProvince"],
        message: "กรุณาเลือกจังหวัดที่จดทะเบียน",
        code: z.ZodIssueCode.custom,
      })
    }
  })

type FormValues = z.infer<typeof schema>

type CollateralDetailModalProps = {
  open: boolean
  initialValue?: CollateralIdentifier
  onClose: () => void
  onSave: (value: CollateralIdentifier) => void
}

export function CollateralDetailModal({
  open,
  initialValue,
  onClose,
  onSave,
}: CollateralDetailModalProps) {
  const [infoOpen, setInfoOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // Errors (and the auto-focus that comes with them) should only ever
    // appear right when "บันทึก" is clicked, not from editing a field again
    // after an earlier failed attempt.
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      licensePlateNumber: "",
      licensePlateProvince: "",
      chassisNumber: "",
    },
  })

  // ...but a field that's now filled in should drop its own red state right
  // away, instead of waiting for the next "บันทึก" to notice it's fixed.
  const plateValue = watch("licensePlateNumber")
  const provinceValue = watch("licensePlateProvince")
  const chassisValue = watch("chassisNumber")

  useEffect(() => {
    const hasPlate = !!plateValue?.trim()
    const hasProvince = !!provinceValue?.trim()
    const hasChassis = !!chassisValue?.trim()
    if (hasPlate || hasProvince || hasChassis) clearErrors("general")
    if (hasPlate) clearErrors("licensePlateNumber")
    if (hasProvince) clearErrors("licensePlateProvince")
  }, [plateValue, provinceValue, chassisValue, clearErrors])

  useEffect(() => {
    if (!open) return
    reset({
      licensePlateNumber: initialValue?.licensePlateNumber ?? "",
      licensePlateProvince: initialValue?.licensePlateProvince ?? "",
      chassisNumber: initialValue?.chassisNumber ?? "",
    })
  }, [open, initialValue, reset])

  function onSubmit(data: FormValues) {
    onSave({
      licensePlateNumber: data.licensePlateNumber?.trim() || undefined,
      licensePlateProvince: data.licensePlateProvince || undefined,
      chassisNumber: data.chassisNumber?.trim() || undefined,
    })
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="text-center text-xl font-semibold text-foreground">
          กรอกเลขทะเบียน / เลขตัวถัง
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="เลขทะเบียนรถ"
            error={errors.licensePlateNumber?.message}
          >
            <Input
              placeholder="EX. 1กก1234"
              invalid={!!errors.licensePlateNumber}
              {...register("licensePlateNumber")}
            />
          </FormField>

          <FormField
            label="จังหวัดที่จดทะเบียน"
            error={errors.licensePlateProvince?.message}
          >
            <Select
              options={[{value: "", label: "เลือกข้อมูล"}, ...provinceOptions]}
              invalid={!!errors.licensePlateProvince}
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
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                aria-label="เลขตัวถังคืออะไร"
              >
                <Icon name="info" className="size-4 text-muted-foreground" />
              </button>
            </span>
          }
          error={errors.chassisNumber?.message}
        >
          <Input placeholder="กรอกข้อมูล" {...register("chassisNumber")} />
        </FormField>

        {errors.general?.message ? (
          <div className="flex items-start gap-2 rounded-lg bg-badge-danger-bg px-4 py-3 text-sm text-badge-danger-fg">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
              !
            </span>
            <span>{errors.general.message}</span>
          </div>
        ) : null}

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

      <ChassisNumberInfoModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
      />
    </Modal>
  )
}
