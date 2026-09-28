"use client";

import { Badge } from "@/components/atoms/Badge";
import { Card } from "@/components/molecules/Card";
import { Select } from "@/components/atoms/Select";
import {
  PPI_ANNUAL_PREMIUM,
  calculateMonthlyPayment,
  getMaxApprovedAmount,
} from "@/lib/loan-cal";
import type { ProductCatalogItem } from "@/types/product-catalog";
import type { LoanInfo } from "@/types/ratebook";
import { useMemo } from "react";

const INSTALLMENT_TERM_OPTIONS = [36, 48, 60, 72, 84];
const MIN_REQUESTED_AMOUNT = 20000;

function parseMonthlyRatePercent(label: string): number {
  const match = label.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 1.43;
}

function RadioPair({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; caption?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex min-w-36 items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
              selected ? "border-primary bg-secondary-bg" : "border-secondary-border bg-surface"
            }`}
          >
            <span
              className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? "border-primary-to" : "border-radio-border"
              }`}
            >
              {selected ? <span className="size-1.5 rounded-full bg-primary-to" /> : null}
            </span>
            <span className="flex flex-col items-start">
              <span className="font-medium text-foreground">{option.label}</span>
              {option.caption && selected ? (
                <span className="text-xs text-muted-foreground">{option.caption}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type LeadLoanInfoCardProps = {
  product: ProductCatalogItem;
  value: LoanInfo;
  onChange: (value: LoanInfo) => void;
};

export function LeadLoanInfoCard({ product, value, onChange }: LeadLoanInfoCardProps) {
  const maxApprovedAmount = useMemo(() => getMaxApprovedAmount(product), [product]);
  const monthlyRatePercent = useMemo(
    () => parseMonthlyRatePercent(product.interestRateLabel),
    [product],
  );

  const requestedAmount = value.requestedAmount ?? maxApprovedAmount;
  const wantsWheelCard = value.wantsWheelCard ?? "yes";
  const hasPpi = value.hasPpi ?? "yes";
  const installmentTerm = value.installmentTerm ?? 60;

  const monthlyPayment = calculateMonthlyPayment(
    requestedAmount,
    monthlyRatePercent * 12,
    installmentTerm,
  );
  const totalInterest = Math.max(monthlyPayment * installmentTerm - requestedAmount, 0);
  const ppiTotal = hasPpi === "yes" ? Math.round((PPI_ANNUAL_PREMIUM * installmentTerm) / 12) : 0;
  const totalFinanced = requestedAmount + totalInterest + ppiTotal;

  return (
    <Card>
      <h3 className="mb-4 border-b border-divider pb-3 text-lg font-semibold text-primary-to">
        ข้อมูลสินเชื่อ
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">ผลิตภัณฑ์ที่เลือก :</span>
          <span className="font-medium text-foreground">{product.title}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">วงเงินอนุมัติสูงสุด :</span>
          <div className="text-right">
            <p className="text-2xl font-semibold text-primary-to">
              {maxApprovedAmount.toLocaleString("th-TH")}{" "}
              <span className="text-sm font-normal text-price-label">บาท</span>
            </p>
            <Badge tone="info">{product.ltvLabel}</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">วงเงินที่ต้องการ :</p>
            <p className="text-xs text-muted-foreground">
              วงเงินเริ่มต้น {MIN_REQUESTED_AMOUNT.toLocaleString("th-TH")} บาท
            </p>
          </div>
          <div className="flex h-10 w-48 items-center gap-1 rounded-lg border border-secondary-border bg-surface px-3">
            <input
              type="text"
              inputMode="numeric"
              value={requestedAmount.toLocaleString("th-TH")}
              onChange={(e) =>
                onChange({
                  ...value,
                  requestedAmount: Number(e.target.value.replace(/\D/g, "")) || 0,
                })
              }
              className="w-full text-right text-sm text-foreground outline-none"
            />
            <span className="text-sm text-muted-foreground">บาท</span>
          </div>
        </div>

        <div className="border-t border-divider" />

        <p className="font-semibold text-foreground">ผลิตภัณฑ์เสริม</p>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">ต้องการรับบัตรติดล้อหรือไม่?</span>
          <RadioPair
            value={wantsWheelCard}
            onChange={(next) =>
              onChange({
                ...value,
                wantsWheelCard: next as "yes" | "no",
                ...(next === "yes" ? { installmentTerm: 60 } : {}),
              })
            }
            options={[
              { value: "yes", label: "รับบัตร" },
              { value: "no", label: "ไม่รับบัตร" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">เพิ่มประกันคุ้มครองสินเชื่อ (PPI) หรือไม่?</p>
            <p className="text-xs text-muted-foreground">เพศ ชาย อายุ 36 ปี</p>
          </div>
          <RadioPair
            value={hasPpi}
            onChange={(next) => onChange({ ...value, hasPpi: next as "yes" | "no" })}
            options={[
              {
                value: "yes",
                label: "เพิ่ม PPI",
                caption: `${PPI_ANNUAL_PREMIUM.toLocaleString("th-TH")} บาทต่อปี`,
              },
              { value: "no", label: "ไม่เพิ่ม PPI" },
            ]}
          />
        </div>

        <p className="font-semibold text-foreground">เงื่อนไขการผ่อนชำระ</p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">จำนวนงวด :</span>
          <div className="w-64">
            <Select
              options={INSTALLMENT_TERM_OPTIONS.map((term) => ({
                value: String(term),
                label: `${term} งวด (ดอกเบี้ย ${monthlyRatePercent}% ต่อเดือน)`,
              }))}
              value={String(installmentTerm)}
              disabled={wantsWheelCard === "yes"}
              onChange={(e) =>
                onChange({ ...value, installmentTerm: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">งวดละ :</span>
          <span className="text-lg font-semibold text-success">
            {monthlyPayment.toLocaleString("th-TH")} บาท
          </span>
        </div>

        <div className="rounded-lg bg-pale-blue/40 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary-to">ยอดจัดสินเชื่อรวม:</p>
              <p className="text-xs text-muted-foreground">วงเงิน + ดอกเบี้ย + เบี้ยประกัน</p>
            </div>
            <p className="text-2xl font-semibold text-primary-to">
              {totalFinanced.toLocaleString("th-TH")} <span className="text-sm">บาท</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
