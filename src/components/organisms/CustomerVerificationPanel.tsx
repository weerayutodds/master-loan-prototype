"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { Select } from "@/components/atoms/Select";
import { Card } from "@/components/molecules/Card";
import { FormField } from "@/components/molecules/FormField";
import { SegmentedControl } from "@/components/molecules/SegmentedControl";
import { createCustomerLead } from "@/lib/actions/customer-lead";
import { formatPhoneInput } from "@/lib/format";
import { mockCardCustomer } from "@/lib/mock";
import { isValidThaiPhone } from "@/lib/validation";
import type {
  CardCustomerData,
  CardReadStatus,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form";

const CARD_READ_DELAY_MS = 1500;

const phoneSchema = z
  .string()
  .min(1, "กรุณากรอกเบอร์มือถือ")
  .refine((value) => isValidThaiPhone(value), "รูปแบบเบอร์มือถือไม่ถูกต้อง");

const cardSchema = z.object({ cardPhone: phoneSchema });
const manualSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  phone: phoneSchema,
});

type CustomerVerificationPanelProps = {
  customerTypeOptions: { value: CustomerType; label: string }[];
  verificationMethodOptions: { value: VerificationMethod; label: string }[];
};

type CustomerFormValues = {
  customerType: CustomerType;
  cardPhone: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export function CustomerVerificationPanel({
  customerTypeOptions,
  verificationMethodOptions,
}: CustomerVerificationPanelProps) {
  const router = useRouter();
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("card");
  const [cardStatus, setCardStatus] = useState<CardReadStatus>("idle");
  const [cardCustomer, setCardCustomer] = useState<CardCustomerData | null>(
    null,
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: { customerType: "individual" },
    resolver: zodResolver(
      verificationMethod === "card" ? cardSchema : manualSchema,
    ) as unknown as Resolver<CustomerFormValues>,
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleCardTap() {
    if (cardStatus === "loading") return;
    setCardStatus("loading");
    timeoutRef.current = setTimeout(() => {
      setCardCustomer(mockCardCustomer);
      setCardStatus("success");
    }, CARD_READ_DELAY_MS);
  }

  async function onSubmit(data: CustomerFormValues) {
    const normalized =
      verificationMethod === "card"
        ? (() => {
            const [firstName, ...rest] = (cardCustomer?.name ?? "").split(" ");
            return {
              firstName,
              lastName: rest.join(" "),
              phone: data.cardPhone,
              idCardNumber: cardCustomer?.idCardNumber ?? "",
              gender: cardCustomer?.gender ?? null,
              birthDate: cardCustomer?.birthDate ?? null,
            };
          })()
        : {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            idCardNumber: "",
            gender: null,
            birthDate: null,
          };

    const lead = await createCustomerLead({ ...normalized, verificationMethod });
    router.push(`/customer-lead-list?leadId=${lead.id}`);
  }

  const continueDisabled =
    verificationMethod === "card" ? cardStatus !== "success" : false;

  return (
    <Card className="mx-auto max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="ประเภทลูกค้า">
          <Select options={customerTypeOptions} {...register("customerType")} />
        </FormField>

        <div>
          <p className="text-sm font-medium text-foreground">ข้อมูลลูกค้า</p>
          <p className="mt-1 text-xs text-muted-foreground">
            กรณีไม่มีบัตร หรือต่างชาติ เลือกกรอกข้อมูลเอง
          </p>
        </div>

        {verificationMethod === "card" && cardStatus === "success" ? (
          <div className="flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success">
            <Icon name="check" className="size-5" />
            อ่านข้อมูลบัตรสำเร็จ
          </div>
        ) : null}

        <SegmentedControl
          options={verificationMethodOptions}
          value={verificationMethod}
          onChange={setVerificationMethod}
        />

        {verificationMethod === "card" ? (
          cardStatus === "success" && cardCustomer ? (
            <div key="card-success" className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
                  <Icon name="user" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-primary">{cardCustomer.name}</p>
                  <p className="text-sm text-foreground">{cardCustomer.idCardNumber}</p>
                </div>
              </div>
              <FormField label="เบอร์มือถือ" error={errors.cardPhone?.message}>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="081-123-5678"
                  invalid={!!errors.cardPhone}
                  {...register("cardPhone", {
                    onChange: (e) => {
                      e.target.value = formatPhoneInput(e.target.value);
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
              className="relative flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center disabled:cursor-not-allowed"
            >
              <Icon name="card-reader" className="size-10 text-muted-foreground" />
              <p className="flex items-center gap-1.5 text-sm text-foreground">
                เครื่องเสียบบัตร :
                <Icon name="check" className="size-4 text-success" />
                พร้อมใช้งาน
              </p>

              {cardStatus === "loading" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-foreground/80 p-6 text-center text-primary-foreground">
                  <span className="size-8 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  <p className="text-sm font-medium">กำลังอ่านข้อมูลบัตร...</p>
                  <p className="text-xs">อย่าเพิ่งดึงบัตรออก จนกว่าจะเสร็จสิ้น</p>
                </div>
              ) : null}
            </button>
          )
        ) : (
          <div key="manual" className="space-y-4">
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
                placeholder="081-123-5678"
                invalid={!!errors.phone}
                {...register("phone", {
                  onChange: (e) => {
                    e.target.value = formatPhoneInput(e.target.value);
                  },
                })}
              />
            </FormField>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={continueDisabled || isSubmitting}
        >
          ดำเนินการต่อ
        </Button>
      </form>
    </Card>
  );
}
