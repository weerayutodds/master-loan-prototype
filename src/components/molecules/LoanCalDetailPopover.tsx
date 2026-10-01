"use client"

import {Icon} from "@/components/atoms/Icon"
import {formatRatePercent} from "@/lib/format"
import {
  PPI_ANNUAL_PREMIUM,
  calculateLoanCalSummary,
  type InterestRateType,
} from "@/lib/loan-cal"

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between border-b border-divider px-3 py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

type LoanCalDetailPopoverProps = {
  requestedAmount: number
  interestRatePercent: number
  rateType: InterestRateType
  flatRatePercent: number
  installmentTerm: number
  isTLC: boolean
  hasPpi: boolean
  /** New loan (ผ่อนหมดแล้ว) — not refinance. */
  isRefinance?: boolean
  existingInstallment?: number
  onExistingInstallmentChange?: (amount: number) => void
  onClose: () => void
}

export function LoanCalDetailPopover({
  requestedAmount,
  interestRatePercent,
  rateType,
  flatRatePercent,
  installmentTerm,
  isTLC,
  hasPpi,
  isRefinance = false,
  existingInstallment = 0,
  onExistingInstallmentChange,
  onClose,
}: LoanCalDetailPopoverProps) {
  const summary = calculateLoanCalSummary({
    requestedAmount,
    interestRatePercent,
    rateType,
    installmentTerm,
    isTLC,
    hasPpi,
  })

  const rateLabelPrefix = isTLC ? "แบบ" : "อัตราดอกเบี้ย "
  // TLC swaps the งวดผ่อน row for a continuous-payment footnote (the PPI variant has its own).
  const showTlcRemark = isTLC && !hasPpi
  // Empty input shows 0; otherwise negative when the new installment is higher than the old one.
  const installmentDifference = existingInstallment
    ? existingInstallment - summary.totalPayment
    : 0

  return (
    <div className="w-66.25 overflow-hidden rounded-lg border border-secondary-border bg-surface shadow-secondary-m">
      <div className="flex items-center justify-between border-b border-secondary-border px-3 py-2">
        <span className="text-xs font-semibold text-primary-to">
          รายละเอียดยอดจัดสินเชื่อ
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex size-6 items-center justify-center rounded border border-secondary-border bg-secondary-bg"
          aria-label="ปิดรายละเอียด"
        >
          <Icon name="chevron-down" className="size-3 text-muted-foreground" />
        </button>
      </div>

      {!isTLC && hasPpi ? (
        <div className="flex items-center justify-between border-b border-divider px-3 py-2 text-xs">
          <span className="text-muted-foreground">เบี้ย PPI (ตลอดสัญญา)</span>
          <p className="font-semibold text-primary-to">
            {summary.ppiTotal.toLocaleString("th-TH")}{" "}
            <span className="font-normal text-price-label">บาท</span>
          </p>
        </div>
      ) : null}
      <DetailRow
        label="ยอดจัดรวม"
        value={
          summary.ppiTotal > 0
            ? `${requestedAmount.toLocaleString("th-TH")}+${summary.ppiTotal.toLocaleString("th-TH")}=${summary.financedAmount.toLocaleString("th-TH")} บาท`
            : `${requestedAmount.toLocaleString("th-TH")} บาท`
        }
      />
      {rateType === "flat" ? (
        <DetailRow
          label="อัตราดอกเบี้ยคงที่"
          value={`${formatRatePercent(flatRatePercent)} % ต่อเดือน`}
        />
      ) : (
        <>
          <DetailRow
            label={`${rateLabelPrefix}ลดต้นลดดอก`}
            value={`${formatRatePercent(interestRatePercent)} % ต่อปี`}
          />
          <DetailRow
            label={`${rateLabelPrefix}คงที่เทียบเคียง`}
            value={`${formatRatePercent(flatRatePercent)} % ต่อเดือน`}
          />
        </>
      )}
      {!isTLC ? (
        <DetailRow label="งวดผ่อน" value={`${installmentTerm} งวด`} />
      ) : null}

      {isTLC && hasPpi ? (
        <>
          <div className="flex items-center justify-between bg-pale-blue px-3 py-2">
            <span className="text-xs text-foreground">ยอดผ่อนต่อเดือน</span>
            <p className="text-base font-semibold text-primary-to">
              {summary.basePayment.toLocaleString("th-TH")}{" "}
              <span className="text-xs font-normal text-price-label">บาท</span>
            </p>
          </div>
          <DetailRow
            label={`เพิ่ม เบี้ย PPI (${PPI_ANNUAL_PREMIUM.toLocaleString("th-TH")} บาท/ปี)`}
            value={`${summary.ppiMonthly.toLocaleString("th-TH")} บาท/เดือน`}
          />
          <div className="flex items-center justify-between gap-1 border-t border-primary-to bg-pale-blue px-3 py-2">
            <div className="min-w-0">
              <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                <Icon name="star" className="size-3 text-tag-amber" />
                แนะนำผ่อนต่อเดือน
              </span>
              <p className="text-[10px] text-primary-to">
                ยอดผ่อนต่อเดือน + PPI ต่อเดือน
              </p>
            </div>
            <p className="shrink-0 text-base font-semibold text-primary-to">
              {summary.totalPayment.toLocaleString("th-TH")}{" "}
              <span className="text-xs font-normal text-price-label">บาท</span>
            </p>
          </div>
          <div className="loan-cal-result-box px-3 py-2 text-[10px] text-muted-foreground">
            *กรณีลูกค้าผ่อนยอดแนะนำต่อเนื่องโดยไม่มีการถอนเงินเพิ่มจะหมดภายใน {installmentTerm} งวด
          </div>
        </>
      ) : (
        <div
          className={`px-3 py-2 ${
            isRefinance
              ? "border-t border-primary-to bg-pale-blue"
              : "loan-cal-result-box"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground">ยอดผ่อนต่อเดือน</span>
            <p className="text-lg font-semibold text-primary-to">
              {summary.totalPayment.toLocaleString("th-TH")}{" "}
              <span className="text-xs font-normal text-price-label">บาท</span>
            </p>
          </div>
          {showTlcRemark ? (
            <p className="mt-1 text-[10px] text-muted-foreground">
              *กรณีลูกค้าผ่อนต่อเนื่องโดยไม่มีการถอนเงินเพิ่มจะหมดภายใน{" "}
              {installmentTerm} งวด
            </p>
          ) : null}
        </div>
      )}

      {isRefinance ? (
        <div className="flex flex-col gap-3 bg-linear-to-br from-primary to-primary-to px-3 py-3">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-secondary-border bg-surface px-3">
            <input
              type="text"
              inputMode="numeric"
              value={
                existingInstallment
                  ? existingInstallment.toLocaleString("th-TH")
                  : ""
              }
              placeholder="ยอดผ่อนไฟแนนซ์เดิม"
              onChange={(e) =>
                onExistingInstallmentChange?.(
                  Number(e.target.value.replace(/\D/g, "")) || 0,
                )
              }
              aria-label="ยอดผ่อนไฟแนนซ์เดิม"
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <span className="shrink-0 text-sm font-medium text-foreground">
              บาท
            </span>
          </div>
          <div className="flex items-center justify-between text-primary-foreground">
            <span className="text-xs">ส่วนต่างจากไฟแนนซ์เดิม</span>
            <p className="text-lg font-semibold">
              {installmentDifference.toLocaleString("th-TH")}{" "}
              <span className="text-xs font-normal">บาท</span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
