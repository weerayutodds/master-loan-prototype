"use client";

import { Icon } from "@/components/atoms/Icon";
import { Select } from "@/components/atoms/Select";
import { calculateMonthlyPayment } from "@/lib/loan-cal";
import type { ProductCatalogData } from "@/types/product-catalog";
import { useMemo, useState } from "react";

const INSTALLMENT_TERM_OPTIONS = [36, 48, 60, 72, 84];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-[10px] text-pale-blue">{children}</span>;
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex h-9 shrink-0 items-center gap-2 rounded-md border px-2 text-sm whitespace-nowrap ${
        checked
          ? "border-primary bg-secondary-bg text-foreground"
          : "border-white/30 bg-white/5 text-pale-blue"
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded ${
          checked ? "bg-primary-to" : "border border-white/60"
        }`}
      >
        {checked ? <Icon name="check" className="size-3.5 text-white" /> : null}
      </span>
      {label}
    </button>
  );
}

type LoanCalBarProps = {
  productCatalog: ProductCatalogData;
};

export function LoanCalBar({ productCatalog }: LoanCalBarProps) {
  const bookStatusOptions = useMemo(
    () =>
      Array.from(new Set(productCatalog.items.map((item) => item.bookStatusLabel))).map(
        (label) => ({ label, value: label }),
      ),
    [productCatalog],
  );

  const [bookStatus, setBookStatus] = useState(bookStatusOptions[0]?.label ?? "");
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [requestedLtvPercent, setRequestedLtvPercent] = useState(0);
  const [isBlacklisted, setIsBlacklisted] = useState(
    productCatalog.filterChips.includes("บัตรติดลบ"),
  );
  const [installmentTerm, setInstallmentTerm] = useState(60);
  const [hasPpi, setHasPpi] = useState(false);
  const [interestRatePercent, setInterestRatePercent] = useState(24);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  function handleCalculate() {
    setMonthlyPayment(
      calculateMonthlyPayment(requestedAmount, interestRatePercent, installmentTerm),
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex justify-center">
      <div className="loan-cal-bar flex w-full max-w-6xl items-end justify-between gap-6 overflow-x-auto rounded-xl px-4 py-2.5">
        <div className="flex items-end gap-2">
          <div className="w-24 shrink-0">
            <FieldLabel>เล่มทะเบียน</FieldLabel>
            <Select
              options={bookStatusOptions}
              value={bookStatus}
              onChange={(e) => setBookStatus(e.target.value)}
              className="py-1.5 pr-7 text-xs"
            />
          </div>

          <div className="w-52 shrink-0">
            <FieldLabel>วงเงินที่ขอ</FieldLabel>
            <div className="flex h-9 overflow-hidden rounded-md border border-secondary-border bg-surface">
              <div className="flex flex-1 items-center gap-1 px-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={requestedAmount || ""}
                  placeholder="0"
                  onChange={(e) => setRequestedAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
                  className="w-full text-sm text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">บาท</span>
              </div>
              <div className="flex w-24 shrink-0 items-center gap-1 border-l border-divider px-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={requestedLtvPercent || ""}
                  placeholder="0"
                  onChange={(e) => setRequestedLtvPercent(Number(e.target.value.replace(/\D/g, "")) || 0)}
                  className="w-full text-sm text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">%LTV</span>
              </div>
            </div>
          </div>

          <div className="h-9 w-px shrink-0 bg-primary/60" />

          <ToggleChip label="บัตรติดลบ" checked={isBlacklisted} onChange={setIsBlacklisted} />

          <div className="w-20 shrink-0">
            <FieldLabel>งวดผ่อน</FieldLabel>
            <Select
              options={INSTALLMENT_TERM_OPTIONS.map((term) => ({
                label: `${term} งวด`,
                value: String(term),
              }))}
              value={String(installmentTerm)}
              onChange={(e) => setInstallmentTerm(Number(e.target.value))}
              className="bg-surface-muted py-1.5 pr-7 text-xs"
            />
          </div>

          <span className="mb-2 shrink-0 self-center text-xs text-pale-blue">เพศ ชาย | 36 ปี</span>

          <ToggleChip label="PPI" checked={hasPpi} onChange={setHasPpi} />

          <div className="w-28 shrink-0">
            <FieldLabel>อัตราดอกเบี้ยลดต้นลดดอก</FieldLabel>
            <div className="flex h-9 items-center gap-1 rounded-md border border-secondary-border bg-surface px-2">
              <input
                type="text"
                inputMode="numeric"
                value={interestRatePercent}
                onChange={(e) => setInterestRatePercent(Number(e.target.value.replace(/\D/g, "")) || 0)}
                className="w-full text-sm text-foreground outline-none"
              />
              <span className="text-xs text-muted-foreground">% ต่อปี</span>
            </div>
          </div>

          <div className="h-9 w-px shrink-0 bg-primary/60" />

          <button
            type="button"
            onClick={handleCalculate}
            className="h-9 shrink-0 rounded-lg bg-success px-4 text-sm font-medium text-white hover:brightness-95"
          >
            คำนวณ
          </button>
        </div>

        <div className="loan-cal-result-box flex shrink-0 flex-col justify-center rounded-md border border-primary-to px-3 py-1.5">
          <span className="text-[10px] font-medium text-foreground">ยอดผ่อนต่อเดือน</span>
          <p className="text-xl font-semibold text-primary-to">
            {monthlyPayment !== null ? monthlyPayment.toLocaleString("th-TH") : 0}{" "}
            <span className="text-xs font-normal text-price-label">บาท</span>
          </p>
        </div>
      </div>
    </div>
  );
}
