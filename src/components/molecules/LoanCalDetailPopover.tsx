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
          <Icon name="arrow-down" className="size-3 text-muted-foreground" />
        </button>
      </div>

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
      <DetailRow label="งวดผ่อน" value={`${installmentTerm} งวด`} />

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
            <span className="flex items-center gap-1 text-xs font-medium text-foreground">
              <Icon name="star" className="size-3 text-tag-amber" />
              แนะนำผ่อนต่อเดือน
            </span>
            <p className="text-base font-semibold text-primary-to">
              {summary.totalPayment.toLocaleString("th-TH")}{" "}
              <span className="text-xs font-normal text-price-label">บาท</span>
            </p>
          </div>
          <div className="loan-cal-result-box px-3 py-2 text-[10px] text-muted-foreground">
            *กรณีลูกค้าผ่อนยอดแนะนำต่อเนื่องโดยไม่มีการถอนเงินเพิ่มจะหมดภายใน {installmentTerm} งวด
          </div>
        </>
      ) : (
        <div className="loan-cal-result-box flex items-center justify-between px-3 py-2">
          <span className="text-xs text-foreground">ยอดผ่อนต่อเดือน</span>
          <p className="text-lg font-semibold text-primary-to">
            {summary.totalPayment.toLocaleString("th-TH")}{" "}
            <span className="text-xs font-normal text-price-label">บาท</span>
          </p>
        </div>
      )}
    </div>
  )
}
