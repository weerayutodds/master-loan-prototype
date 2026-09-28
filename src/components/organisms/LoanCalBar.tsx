"use client"

import {Icon} from "@/components/atoms/Icon"
import {Select} from "@/components/atoms/Select"
import {LoanCalDetailPopover} from "@/components/molecules/LoanCalDetailPopover"
import {GenderAgePopover} from "@/components/organisms/GenderAgePopover"
import {updateOpportunityCustomerInfo} from "@/lib/actions/customer-lead-opportunity"
import {calculateAge} from "@/lib/format"
import {
  calculateAmountFromLtv,
  calculateFlatRateEquivalent,
  calculateLoanCalSummary,
  calculateLtvPercent,
  type InterestRateType,
} from "@/lib/loan-cal"
import {GENDER_LABELS} from "@/lib/mock"
import type {Gender} from "@/types/customer-lead"
import type {
  ProductCatalogData,
  ProductCatalogFilter,
} from "@/types/product-catalog"
import type {CustomerInfo, RefinanceStatus} from "@/types/ratebook"
import {useEffect, useMemo, useRef, useState} from "react"

type CalculatedInputs = {
  requestedAmount: number
  interestRatePercent: number
  rateType: InterestRateType
  installmentTerm: number
  isTLC: boolean
  hasPpi: boolean
}

const INSTALLMENT_TERM_OPTIONS = [36, 48, 60, 72, 84]
const TRANSFER_BOOK_STATUS = "โอนเล่ม"
const MAX_REDUCING_RATE_PERCENT = 24
const MAX_FLAT_RATE_PERCENT = 2

function FieldLabel({children}: {children: React.ReactNode}) {
  return (
    <span className="mb-1 block text-[10px] text-pale-blue">{children}</span>
  )
}

function ToggleChip({
  label,
  checked,
  disabled = false,
  onChange,
}: {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-9 shrink-0 items-center gap-2 rounded-md border px-2 text-sm whitespace-nowrap bg-white disabled:cursor-not-allowed disabled:opacity-50 ${
        checked
          ? "border-primary text-foreground"
          : "border-gray-300 text-gray-500"
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded ${
          checked ? "bg-primary-to" : "border border-gray-300"
        }`}
      >
        {checked ? <Icon name="check" className="size-3.5 text-white" /> : null}
      </span>
      {label}
    </button>
  )
}

type LoanCalBarProps = {
  productCatalog: ProductCatalogData
  appraisalPrice: number
  customer: CustomerInfo | null
  opportunityId: string | null
  refinanceStatus: RefinanceStatus | null
  onCustomerChange: (value: CustomerInfo) => void
  onFilterChange: (filter: ProductCatalogFilter) => void
}

export function LoanCalBar({
  productCatalog,
  appraisalPrice,
  customer,
  opportunityId,
  refinanceStatus,
  onCustomerChange,
  onFilterChange,
}: LoanCalBarProps) {
  const bookStatusOptions = useMemo(
    () =>
      Array.from(
        new Set(productCatalog.items.map((item) => item.bookStatusLabel)),
      ).map((label) => ({label, value: label})),
    [productCatalog],
  )

  const [bookStatus, setBookStatus] = useState(
    bookStatusOptions[0]?.label ?? "",
  )
  const [requestedAmount, setRequestedAmount] = useState(0)
  const [requestedLtvPercent, setRequestedLtvPercent] = useState(0)
  const [payoffAmount, setPayoffAmount] = useState(0)
  const [cashBackAmount, setCashBackAmount] = useState(0)
  const [isTLC, setIsTLC] = useState(
    productCatalog.filterChips.includes("บัตรติดล้อ"),
  )
  const [installmentTerm, setInstallmentTerm] = useState(60)
  const [hasPpi, setHasPpi] = useState(false)
  const [interestRatePercent, setInterestRatePercent] = useState(24)
  const [flatRateInput, setFlatRateInput] = useState("1")
  const [calculated, setCalculated] = useState<CalculatedInputs | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [genderAgeOpen, setGenderAgeOpen] = useState(false)
  const [genderAgePosition, setGenderAgePosition] = useState<{
    left: number
    bottom: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const genderAgeAnchorRef = useRef<HTMLDivElement>(null)
  const genderAgePopoverRef = useRef<HTMLDivElement>(null)

  const isTransferBook = bookStatus === TRANSFER_BOOK_STATUS
  const isRefinance = refinanceStatus === "still-paying"

  function commitFilter(overrides: Partial<ProductCatalogFilter> = {}) {
    onFilterChange({
      bookStatus,
      requestedAmount,
      requestedLtvPercent,
      ...overrides,
    })
  }

  function handleRefinanceAmountChange(
    nextPayoffAmount: number,
    nextCashBackAmount: number,
  ) {
    const amount = nextPayoffAmount + nextCashBackAmount
    setRequestedAmount(amount)
    setRequestedLtvPercent(calculateLtvPercent(amount, appraisalPrice))
  }

  function handleBookStatusChange(value: string) {
    setBookStatus(value)
    if (value === TRANSFER_BOOK_STATUS) setIsTLC(false)
    commitFilter({bookStatus: value})
  }

  function handleFlatRateChange(raw: string) {
    const value = raw.replace(/[^\d.]/g, "")
    if (!/^\d*\.?\d{0,2}$/.test(value)) return
    if (Number(value) > MAX_FLAT_RATE_PERCENT) return
    setFlatRateInput(value)
  }

  function handleToggleTLC(nextChecked: boolean) {
    setIsTLC(nextChecked)
    if (nextChecked) setInstallmentTerm(60)
  }

  useEffect(() => {
    if (!showDetail) return
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowDetail(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showDetail])

  useEffect(() => {
    if (!genderAgeOpen) return
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        !genderAgeAnchorRef.current?.contains(target) &&
        !genderAgePopoverRef.current?.contains(target)
      ) {
        setGenderAgeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [genderAgeOpen])

  function openGenderAgePopover() {
    const rect = genderAgeAnchorRef.current?.getBoundingClientRect()
    if (rect) {
      setGenderAgePosition({
        left: rect.left,
        bottom: window.innerHeight - rect.top + 12,
      })
    }
    setGenderAgeOpen(true)
  }

  function handleTogglePpi(nextChecked: boolean) {
    if (!nextChecked) {
      setHasPpi(false)
      return
    }
    openGenderAgePopover()
  }

  const summary = useMemo(
    () => (calculated ? calculateLoanCalSummary(calculated) : null),
    [calculated],
  )
  const flatRatePercent = useMemo(() => {
    if (!calculated) return 0
    if (calculated.rateType === "flat") return calculated.interestRatePercent
    return calculateFlatRateEquivalent(
      calculated.interestRatePercent,
      calculated.installmentTerm,
    )
  }, [calculated])

  function handleCalculate() {
    setCalculated({
      requestedAmount,
      interestRatePercent: isTransferBook
        ? Number(flatRateInput) || 0
        : interestRatePercent,
      rateType: isTransferBook ? "flat" : "reducing",
      installmentTerm,
      isTLC: isTransferBook ? false : isTLC,
      hasPpi,
    })
    setShowDetail(true)
  }

  async function handleSaveGenderAge(value: {
    gender: Gender
    birthDate: string
  }) {
    const nextCustomer: CustomerInfo = {
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      phone: customer?.phone ?? "",
      ...value,
    }
    onCustomerChange(nextCustomer)
    setGenderAgeOpen(false)
    setHasPpi(true)
    if (opportunityId) {
      await updateOpportunityCustomerInfo(opportunityId, nextCustomer)
    }
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex justify-center">
      <div
        className={`loan-cal-bar flex w-full items-end justify-between gap-6 rounded-xl px-4 py-2.5 ${
          isRefinance ? "max-w-312.5" : "max-w-306.5"
        }`}
      >
        <div className="flex flex-1 min-w-0 overflow-x-auto overflow-y-visible items-end gap-2 pb-1">
          <div className="w-fit shrink-0">
            <FieldLabel>เล่มทะเบียน</FieldLabel>
            <Select
              options={bookStatusOptions}
              value={bookStatus}
              onChange={(e) => handleBookStatusChange(e.target.value)}
              className="bg-surface-muted shrink-0 py-1.5 pr-7 text-xs w-full"
            />
          </div>
          {isRefinance ? (
            <div className="flex shrink-0 items-end">
              <div className="w-28 shrink-0">
                <FieldLabel>ยอดปิดไฟแนนซ์เดิม</FieldLabel>
                <div className="relative flex h-9 items-center gap-1 rounded-l-md border border-secondary-border bg-surface px-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      payoffAmount ? payoffAmount.toLocaleString("th-TH") : ""
                    }
                    placeholder="0"
                    onChange={(e) => {
                      const amount =
                        Number(e.target.value.replace(/\D/g, "")) || 0
                      setPayoffAmount(amount)
                      handleRefinanceAmountChange(amount, cashBackAmount)
                    }}
                    onBlur={() => commitFilter()}
                    className="w-full text-sm text-foreground outline-none"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    บาท
                  </span>
                  <span className="absolute top-1/2 -right-2 z-10 flex size-4 -translate-y-1/2 items-center justify-center rounded-full border border-secondary-border bg-white text-[10px] leading-none text-muted-foreground">
                    +
                  </span>
                </div>
              </div>
              <div className="-ml-px w-28 shrink-0">
                <FieldLabel>เงินรับกลับบ้าน</FieldLabel>
                <div className="flex h-9 items-center gap-1 rounded-r-md border border-secondary-border bg-surface px-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      cashBackAmount
                        ? cashBackAmount.toLocaleString("th-TH")
                        : ""
                    }
                    placeholder="0"
                    onChange={(e) => {
                      const amount =
                        Number(e.target.value.replace(/\D/g, "")) || 0
                      setCashBackAmount(amount)
                      handleRefinanceAmountChange(payoffAmount, amount)
                    }}
                    onBlur={() => commitFilter()}
                    className="w-full text-sm text-foreground outline-none"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    บาท
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="w-52 shrink-0">
            <FieldLabel>วงเงินที่ขอ</FieldLabel>
            <div className="flex h-9 overflow-hidden rounded-md border border-secondary-border bg-surface">
              <div className="flex flex-1 items-center gap-1 px-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    requestedAmount
                      ? requestedAmount.toLocaleString("th-TH")
                      : ""
                  }
                  placeholder="0"
                  onChange={(e) => {
                    const amount =
                      Number(e.target.value.replace(/\D/g, "")) || 0
                    setRequestedAmount(amount)
                    setRequestedLtvPercent(
                      calculateLtvPercent(amount, appraisalPrice),
                    )
                    if (isRefinance) {
                      setPayoffAmount(Math.max(0, amount - cashBackAmount))
                    }
                  }}
                  onBlur={() => commitFilter()}
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
                  onChange={(e) => {
                    const ltvPercent =
                      Number(e.target.value.replace(/\D/g, "")) || 0
                    setRequestedLtvPercent(ltvPercent)
                    setRequestedAmount(
                      calculateAmountFromLtv(ltvPercent, appraisalPrice),
                    )
                  }}
                  onBlur={() => commitFilter()}
                  className="w-full text-sm text-foreground outline-none"
                />
                <span className="text-xs text-muted-foreground">%LTV</span>
              </div>
            </div>
          </div>

          <div className="h-9 w-px shrink-0 bg-primary/60" />

          <ToggleChip
            label="บัตรติดล้อ"
            checked={isTLC}
            disabled={isTransferBook}
            onChange={handleToggleTLC}
          />

          <div className="w-fit shrink-0">
            <FieldLabel>งวดผ่อน</FieldLabel>
            <Select
              options={INSTALLMENT_TERM_OPTIONS.map((term) => ({
                label: `${term} งวด`,
                value: String(term),
              }))}
              disabled={isTLC}
              value={String(installmentTerm)}
              onChange={(e) => setInstallmentTerm(Number(e.target.value))}
              className="bg-surface-muted shrink-0 py-1.5 pr-7 text-xs w-full"
            />
          </div>
          <div ref={genderAgeAnchorRef} className="w-20 shrink-0">
            {customer?.gender && customer?.birthDate ? (
              <span className="mb-1 block shrink-0 self-center text-[10px] text-pale-blue w-full">
                {`เพศ ${GENDER_LABELS[customer.gender]} | ${calculateAge(customer.birthDate)} ปี`}
              </span>
            ) : null}

            <ToggleChip
              label="PPI"
              checked={hasPpi}
              onChange={handleTogglePpi}
            />
          </div>

          {genderAgeOpen && genderAgePosition ? (
            <div
              ref={genderAgePopoverRef}
              style={{
                position: "fixed",
                left: genderAgePosition.left,
                bottom: genderAgePosition.bottom,
              }}
              className="z-1000"
            >
              <GenderAgePopover
                initialGender={customer?.gender ?? null}
                initialBirthDate={customer?.birthDate ?? null}
                onSave={handleSaveGenderAge}
                onCancel={() => setGenderAgeOpen(false)}
              />
            </div>
          ) : null}
          <div className="w-28 shrink-0">
            <FieldLabel>
              {isTransferBook
                ? "อัตราดอกเบี้ยคงที่"
                : "อัตราดอกเบี้ยลดต้นลดดอก"}
            </FieldLabel>
            <div className="flex h-9 items-center gap-1 rounded-md border border-secondary-border bg-surface px-2">
              {isTransferBook ? (
                <input
                  type="text"
                  inputMode="decimal"
                  value={flatRateInput}
                  placeholder="0"
                  onChange={(e) => handleFlatRateChange(e.target.value)}
                  className="w-full text-sm text-foreground outline-none"
                />
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  value={interestRatePercent}
                  onChange={(e) =>
                    setInterestRatePercent(
                      Math.min(
                        MAX_REDUCING_RATE_PERCENT,
                        Number(e.target.value.replace(/\D/g, "")) || 0,
                      ),
                    )
                  }
                  className="w-full text-sm text-foreground outline-none"
                />
              )}
              <span className="text-xs  text-muted-foreground shrink-0">
                {isTransferBook ? "% ต่อเดือน" : "% ต่อปี"}
              </span>
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

        <div
          ref={containerRef}
          className="loan-cal-result-box relative flex shrink-0 flex-col justify-center gap-1 rounded-md border border-primary-to px-3 py-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium text-foreground">
              ยอดผ่อนต่อเดือน
            </span>
            {summary !== null && summary.totalPayment > 0 ? (
              <button
                type="button"
                onClick={() => setShowDetail((value) => !value)}
                aria-label="แสดงรายละเอียดยอดจัดสินเชื่อ"
                className="flex size-4 shrink-0 items-center justify-center rounded border border-secondary-border bg-secondary-bg"
              >
                <Icon
                  name={showDetail ? "chevron-down" : "chevron-up"}
                  className="size-3 text-foreground"
                />
              </button>
            ) : null}
          </div>
          <p className="text-xl font-semibold text-primary-to">
            {summary !== null
              ? summary.totalPayment.toLocaleString("th-TH")
              : 0}
            &nbsp;
            <span className="text-xs font-normal text-price-label">บาท</span>
          </p>

          {showDetail && summary !== null && calculated !== null ? (
            <div className="absolute bottom-full right-0 z-1000 mb-2">
              <LoanCalDetailPopover
                requestedAmount={calculated.requestedAmount}
                interestRatePercent={calculated.interestRatePercent}
                rateType={calculated.rateType}
                flatRatePercent={flatRatePercent}
                installmentTerm={calculated.installmentTerm}
                isTLC={calculated.isTLC}
                hasPpi={calculated.hasPpi}
                onClose={() => setShowDetail(false)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
