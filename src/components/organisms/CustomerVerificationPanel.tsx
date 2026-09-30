"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {Input} from "@/components/atoms/Input"
import {Select} from "@/components/atoms/Select"
import {Card} from "@/components/molecules/Card"
import {FormField} from "@/components/molecules/FormField"
import {LoadingToast} from "@/components/molecules/LoadingToast"
import {SegmentedControl} from "@/components/molecules/SegmentedControl"
import {createCustomerLead} from "@/lib/actions/customer-lead"
import {formatPhoneInput} from "@/lib/format"
import {mockCardCustomer} from "@/lib/mock"
import {isValidThaiPhone} from "@/lib/validation"
import type {
  CardCustomerData,
  CardReadStatus,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"
import {useEffect, useRef, useState} from "react"
import {useForm, type Resolver} from "react-hook-form"
import {z} from "zod"

const CARD_READ_DELAY_MS = 1500

const phoneSchema = z
  .string()
  .min(1, "กรุณากรอกเบอร์มือถือ")
  .refine((value) => isValidThaiPhone(value), "รูปแบบเบอร์มือถือไม่ถูกต้อง")

const cardSchema = z.object({cardPhone: phoneSchema})
const manualSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  phone: phoneSchema,
})

type CustomerVerificationPanelProps = {
  customerTypeOptions: {value: CustomerType; label: string}[]
  verificationMethodOptions: {value: VerificationMethod; label: string}[]
}

type CustomerFormValues = {
  customerType: CustomerType
  cardPhone: string
  firstName: string
  lastName: string
  phone: string
}

export function CustomerVerificationPanel({
  customerTypeOptions,
  verificationMethodOptions,
}: CustomerVerificationPanelProps) {
  const router = useRouter()
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("card")
  const [cardStatus, setCardStatus] = useState<CardReadStatus>("idle")
  const [cardCustomer, setCardCustomer] = useState<CardCustomerData | null>(
    null,
  )

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<CustomerFormValues>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {customerType: "individual"},
    resolver: zodResolver(
      verificationMethod === "card" ? cardSchema : manualSchema,
    ) as unknown as Resolver<CustomerFormValues>,
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleCardTap() {
    if (cardStatus === "loading") return
    setCardStatus("loading")
    timeoutRef.current = setTimeout(() => {
      setCardCustomer(mockCardCustomer)
      setCardStatus("success")
    }, CARD_READ_DELAY_MS)
  }

  async function onSubmit(data: CustomerFormValues) {
    const normalized =
      verificationMethod === "card"
        ? (() => {
            const [firstName, ...rest] = (cardCustomer?.name ?? "").split(" ")
            return {
              firstName,
              lastName: rest.join(" "),
              phone: data.cardPhone,
              idCardNumber: cardCustomer?.idCardNumber ?? "",
              gender: cardCustomer?.gender ?? null,
              birthDate: cardCustomer?.birthDate ?? null,
            }
          })()
        : {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            idCardNumber: "",
            gender: null,
            birthDate: null,
          }

    const lead = await createCustomerLead({
      ...normalized,
      verificationMethod,
    })
    router.push(`/customer-lead-list?leadId=${lead.id}`)
  }

  const hasErrors = Object.keys(errors).length > 0
  const continueDisabled =
    hasErrors || (verificationMethod === "card" && cardStatus !== "success")

  return (
    <>
      <Card className="mx-auto flex w-[384px] flex-col rounded-xl border-2 border-[#ECF1F9] bg-white p-[20px] shadow-[0px_4px_12px_rgba(63,116,245,0.16)]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[16px]"
        >
          {/* Customer Type */}
          <div className="w-[160px]">
            <FormField label="ประเภทลูกค้า">
              <Select
                options={customerTypeOptions}
                {...register("customerType")}
              />
            </FormField>
          </div>

          {/* Customer Info Headers */}
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-medium leading-[160%] tracking-[0.01em] text-[#414243]">
              ข้อมูลลูกค้า
            </p>
            <p className="text-[12px] font-normal leading-[160%] tracking-[0.01em] text-[#828387]">
              กรณีไม่มีบัตร หรือต่างชาติ เลือกกรอกข้อมูลเอง
            </p>
          </div>

          {verificationMethod === "card" && cardStatus === "success" ? (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
              <Icon name="check" className="size-5" />
              อ่านข้อมูลบัตรสำเร็จ
            </div>
          ) : null}

          {/* Action Stack (Selector & Active Area) */}
          <div className="flex w-[340px] flex-col gap-[16px]">
            <SegmentedControl
              options={verificationMethodOptions}
              value={verificationMethod}
              onChange={setVerificationMethod}
            />

            {verificationMethod === "card" ? (
              cardStatus === "success" && cardCustomer ? (
                <div key="card-success" className="space-y-4">
                  <div className="relative box-border flex h-[81.29px] w-full items-center overflow-hidden rounded-xl border-[2.63px] border-white bg-[#EFF5FF] px-[12px] py-[10px] shadow-[0px_4px_12px_rgba(63,116,245,0.16)]">
                    {/* พื้นหลังตกแต่งรูปวงรี (Ellipse 1810) */}
                    <div
                      className="absolute bottom-[0.28px] right-[-72.21px] h-[67.19px] w-[138.33px] rounded-full"
                      style={{
                        background:
                          "linear-gradient(88.3deg, #FFFFFF 23.8%, #DBE7FE 93.86%)",
                        transform: "scaleX(-1)",
                      }}
                    />

                    {/* ข้อมูลลูกค้า (วางซ้อนทับภาพตกแต่ง) */}
                    <div className="relative z-10 flex w-full items-center gap-[5.27px]">
                      {/* ไอคอน user-circle ดึงมาจาก dipchip_avatar.svg */}
                      <Icon
                        name="user-circle"
                        className="size-[48px] shrink-0 text-[#828387]"
                      />
                      <div className="flex flex-col items-start gap-[1.32px]">
                        <p className="text-[18px] font-medium leading-[160%] tracking-[0.01em] text-[#334ED1]">
                          {cardCustomer.name}
                        </p>
                        <p className="text-[16px] font-medium leading-[160%] tracking-[0.01em] text-[#414243]">
                          {cardCustomer.idCardNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <FormField
                    label="เบอร์มือถือ"
                    error={errors.cardPhone?.message}
                  >
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={12}
                      placeholder="กรอกเบอร์มือถือ"
                      invalid={!!errors.cardPhone}
                      {...register("cardPhone", {
                        onChange: (e) => {
                          e.target.value = formatPhoneInput(e.target.value)
                        },
                      })}
                    />
                  </FormField>
                </div>
              ) : (
                <button
                  key="card-idle"
                  type="button"
                  onClick={handleCardTap}
                  disabled={cardStatus === "loading"}
                  className="relative box-border h-[155px] w-[340px] rounded-lg border-2 border-dashed border-[#E5E5E6] bg-gradient-to-t from-[#F7F7F7] to-[#FCFCFC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {/* Dipchip Image */}
                  <img
                    src="/assets/images/dipchip.png"
                    alt="Dipchip reader"
                    className="absolute left-[106px] top-[24px] h-[80px] w-[128px]"
                  />

                  {/* Status Indicator */}
                  <div className="absolute top-[116px] flex w-full items-center justify-center gap-[3px]">
                    <span className="text-[12px] font-medium leading-[160%] tracking-[0.01em] text-[#616166]">
                      เครื่องเสียบบัตร :
                    </span>
                    <div className="flex items-center gap-[4px] pl-[2px] pr-[6px]">
                      <div className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#03AA3C]">
                        <Icon name="check" className="size-[8px] text-white" />
                      </div>
                      <span className="text-[10px] font-normal leading-[160%] tracking-[0.01em] text-[#616166]">
                        พร้อมใช้งาน
                      </span>
                    </div>
                  </div>
                </button>
              )
            ) : (
              <div key="manual" className="flex flex-col gap-4">
                <FormField label="ชื่อ" error={errors.firstName?.message}>
                  <Input
                    placeholder="กรอกชื่อ"
                    invalid={!!errors.firstName}
                    {...register("firstName")}
                  />
                </FormField>
                <FormField label="นามสกุล" error={errors.lastName?.message}>
                  <Input
                    placeholder="กรอกนามสกุล"
                    invalid={!!errors.lastName}
                    {...register("lastName")}
                  />
                </FormField>
                <FormField label="เบอร์มือถือ" error={errors.phone?.message}>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="กรอกเบอร์มือถือ"
                    invalid={!!errors.phone}
                    {...register("phone", {
                      onChange: (e) => {
                        e.target.value = formatPhoneInput(e.target.value)
                      },
                    })}
                  />
                </FormField>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="mt-auto w-full"
            disabled={continueDisabled || isSubmitting}
          >
            ดำเนินการต่อ
          </Button>
        </form>
      </Card>

      <LoadingToast
        open={cardStatus === "loading" || isSubmitting}
        title={
          cardStatus === "loading" ? "กำลังอ่านข้อมูลบัตร" : "กำลังบันทึกข้อมูล"
        }
        description={
          cardStatus === "loading"
            ? "อย่าเพิ่งดึงบัตรออก จนกว่าจะเสร็จสิ้น"
            : "กรุณารอสักครู่..."
        }
      />
    </>
  )
}
