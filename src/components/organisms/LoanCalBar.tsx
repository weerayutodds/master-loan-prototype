"use client"

import {Icon} from "@/components/atoms/Icon"
import {Select} from "@/components/atoms/Select"
import {LoadingToast} from "@/components/molecules/LoadingToast"
import {LoanCalDetailPopover} from "@/components/molecules/LoanCalDetailPopover"
import {GenderAgePopover} from "@/components/organisms/GenderAgePopover"
import {updateOpportunityCustomerInfo} from "@/lib/actions/customer-lead-opportunity"
import {calculateAge, formatRatePercent} from "@/lib/format"
import {
  calculateAmountFromLtv,
  calculateFlatRateEquivalent,
  calculateLoanCalSummary,
  calculateLtvPercent,
  DEFAULT_INSTALLMENT_TERM,
  getBookStatusOptions,
  INSTALLMENT_TERM_OPTIONS,
  MOTORCYCLE_INSTALLMENT_TERM,
  TRANSFER_BOOK_STATUS,
  type InterestRateType,
} from "@/lib/loan-cal"
import {GENDER_LABELS} from "@/lib/mock"
import type {Gender} from "@/types/customer-lead"
import type {
  ProductCatalogData,
  ProductCatalogFilter,
} from "@/types/product-catalog"
import type {
  CollateralType,
  CustomerInfo,
  LoanInfo,
  RefinanceStatus,
} from "@/types/ratebook"
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {createPortal} from "react-dom"

type CalculatedInputs = {
  requestedAmount: number
  interestRatePercent: number
  rateType: InterestRateType
  installmentTerm: number
  isTLC: boolean
  hasPpi: boolean
}

const MAX_REDUCING_RATE_PERCENT = 24
const MAX_FLAT_RATE_PERCENT = 2.05
const DEFAULT_REDUCING_RATE_PERCENT = "24"
const DEFAULT_FLAT_RATE_PERCENT = "2.05"

function sanitizeRateInput(raw: string, max: number): string | null {
  const value = raw.replace(/[^\d.]/g, "")

  if (!/^\d*\.?\d{0,2}$/.test(value)) return null

  if (Number(value) > max) return null
  return value
}

function parseRate(value: string): number {
  return Number.parseFloat(value) || 0
}

function formatRate(value: string): string {
  return value === "" ? "" : formatRatePercent(parseRate(value))
}

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
  collateralType: CollateralType | null
  customer: CustomerInfo | null
  opportunityId: string | null
  refinanceStatus: RefinanceStatus | null
  /** Dipchip already verified — PPI can skip the gender/age popover. */
  cardAlreadyRead?: boolean
  /** Lives on `RatebookForm`'s `loanInfo` so the Lead Form's วงเงินที่ต้องการ can't drift from it. */
  requestedAmount: number
  onRequestedAmountChange: (amount: number) => void
  /** Seeds the Lead Form's ผลิตภัณฑ์เสริม / เงื่อนไขการผ่อนชำระ defaults. Must be referentially stable. */
  onLoanTermsChange: (terms: Omit<LoanInfo, "requestedAmount">) => void
  onCustomerChange: (value: CustomerInfo) => void
  onFilterChange: (filter: ProductCatalogFilter) => void
  /** The bar is `fixed`, so it copies this element's left edge and width. */
  anchorRef: React.RefObject<HTMLElement | null>
}

export function LoanCalBar({
  productCatalog,
  appraisalPrice,
  collateralType,
  customer,
  opportunityId,
  refinanceStatus,
  cardAlreadyRead = false,
  requestedAmount,
  onRequestedAmountChange,
  onLoanTermsChange,
  onCustomerChange,
  onFilterChange,
  anchorRef,
}: LoanCalBarProps) {
  const [anchor, setAnchor] = useState<{left: number; width: number} | null>(
    null,
  )

  useLayoutEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const measure = () => {
      const {left, width} = el.getBoundingClientRect()
      setAnchor({left, width})
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [anchorRef])

  const isMotorcycle = collateralType === "motorcycle"
  const installmentTermOptions = isMotorcycle
    ? [MOTORCYCLE_INSTALLMENT_TERM]
    : INSTALLMENT_TERM_OPTIONS
  const defaultInstallmentTerm = isMotorcycle
    ? MOTORCYCLE_INSTALLMENT_TERM
    : DEFAULT_INSTALLMENT_TERM

  const bookStatusOptions = useMemo(
    () =>
      getBookStatusOptions(productCatalog).map((label) => ({
        label,
        value: label,
      })),
    [productCatalog],
  )

  const [bookStatus, setBookStatus] = useState(
    bookStatusOptions[0]?.label ?? "",
  )
  const [requestedLtvPercent, setRequestedLtvPercent] = useState(() =>
    calculateLtvPercent(requestedAmount, appraisalPrice),
  )
  // What the %LTV box shows, so "12." and "12.5" survive while typing.
  const [ltvInput, setLtvInput] = useState(() =>
    requestedLtvPercent ? String(requestedLtvPercent) : "",
  )
  const [payoffAmount, setPayoffAmount] = useState(0)
  const [cashBackAmount, setCashBackAmount] = useState(0)
  const [existingInstallment, setExistingInstallment] = useState(0)
  const [isTLC, setIsTLC] = useState(bookStatus !== TRANSFER_BOOK_STATUS)
  const [installmentTerm, setInstallmentTerm] = useState(defaultInstallmentTerm)
  const [hasPpi, setHasPpi] = useState(false)
  const [reducingRateInput, setReducingRateInput] = useState(
    DEFAULT_REDUCING_RATE_PERCENT,
  )
  const [flatRateInput, setFlatRateInput] = useState(DEFAULT_FLAT_RATE_PERCENT)
  const [calculated, setCalculated] = useState<CalculatedInputs | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [allowOverMaxRate, setAllowOverMaxRate] = useState(false)
  const [genderAgeOpen, setGenderAgeOpen] = useState(false)
  const [genderAgePoint, setGenderAgePoint] = useState<{
    left: number
    top: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const genderAgeAnchorRef = useRef<HTMLDivElement>(null)
  const genderAgePopoverRef = useRef<HTMLDivElement>(null)

  const isTransferBook = bookStatus === TRANSFER_BOOK_STATUS
  const isRefinance = refinanceStatus === "still-paying"
  const effectiveIsTLC = !isTransferBook && isTLC
  const rateType: InterestRateType = isTransferBook ? "flat" : "reducing"
  const interestRatePercent = parseRate(
    isTransferBook ? flatRateInput : reducingRateInput,
  )

  useEffect(() => {
    onLoanTermsChange({
      wantsWheelCard: effectiveIsTLC ? "yes" : "no",
      hasPpi: hasPpi ? "yes" : "no",
      installmentTerm,
      interestRatePercent,
      rateType,
    })
  }, [
    onLoanTermsChange,
    effectiveIsTLC,
    hasPpi,
    installmentTerm,
    interestRatePercent,
    rateType,
  ])

  function commitFilter(overrides: Partial<ProductCatalogFilter> = {}) {
    onFilterChange({
      bookStatus,
      requestedAmount,
      requestedLtvPercent,
      wantsWheelCard: effectiveIsTLC,
      ...overrides,
    })
  }

  function syncCashBack(amount: number, payoff: number) {
    if (isRefinance) setCashBackAmount(Math.max(0, amount - payoff))
  }

  function applyLtv(percent: number) {
    setRequestedLtvPercent(percent)
    setLtvInput(percent ? String(percent) : "")
  }

  function handleRequestedAmountChange(amount: number) {
    onRequestedAmountChange(amount)
    applyLtv(calculateLtvPercent(amount, appraisalPrice))
    syncCashBack(amount, payoffAmount)
  }

  function handleRequestedLtvChange(raw: string) {
    const value = raw.replace(/[^\d.]/g, "")
    if (!/^\d{0,3}(\.\d{0,2})?$/.test(value)) return
    const ltvPercent = Number(value) || 0
    setLtvInput(value)
    setRequestedLtvPercent(ltvPercent)
    // Over the max: keep what was typed (shown in red) but don't push it on.
    if (ltvPercent > maxLtvPercent) return
    const amount = calculateAmountFromLtv(ltvPercent, appraisalPrice)
    onRequestedAmountChange(amount)
    syncCashBack(amount, payoffAmount)
  }

  function handlePayoffChange(payoff: number) {
    setPayoffAmount(payoff)
    if (requestedAmount > 0 && payoff <= requestedAmount) {
      syncCashBack(requestedAmount, payoff)
    } else {
      setCashBackAmount(0)
      onRequestedAmountChange(payoff)
      applyLtv(calculateLtvPercent(payoff, appraisalPrice))
    }
  }

  function handleCashBackChange(cashBack: number) {
    const amount = payoffAmount + cashBack
    setCashBackAmount(cashBack)
    onRequestedAmountChange(amount)
    applyLtv(calculateLtvPercent(amount, appraisalPrice))
  }

  function handleBookStatusChange(value: string) {
    const nextIsTLC = value !== TRANSFER_BOOK_STATUS
    setBookStatus(value)
    setIsTLC(nextIsTLC)
    if (nextIsTLC) setInstallmentTerm(defaultInstallmentTerm)
    commitFilter({bookStatus: value, wantsWheelCard: nextIsTLC})
  }

  function handleToggleTLC(nextChecked: boolean) {
    setIsTLC(nextChecked)
    if (nextChecked) setInstallmentTerm(defaultInstallmentTerm)
    commitFilter({wantsWheelCard: nextChecked})
  }

  const ALLOW_OVER_MAX_RATE = true

  const maxRate = isTransferBook
    ? MAX_FLAT_RATE_PERCENT
    : MAX_REDUCING_RATE_PERCENT
  const currentRateInput = isTransferBook ? flatRateInput : reducingRateInput

  const maxLtvPercent = isMotorcycle ? 130 : 160
  const isLtvError = requestedLtvPercent > maxLtvPercent

  const isRateError = ALLOW_OVER_MAX_RATE && Number(currentRateInput) > maxRate

  function handleRateChange(raw: string) {
    const allowedMax = ALLOW_OVER_MAX_RATE ? 100 : maxRate
    const value = sanitizeRateInput(raw, allowedMax)

    if (value === null) return

    if (isTransferBook) setFlatRateInput(value)
    else setReducingRateInput(value)
  }
  function handleRateBlur() {
    if (isTransferBook) setFlatRateInput(formatRate)
    else setReducingRateInput(formatRate)
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
        genderAgeAnchorRef.current?.contains(target) ||
        genderAgePopoverRef.current?.contains(target)
      ) {
        return
      }
      setGenderAgeOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [genderAgeOpen])

  useLayoutEffect(() => {
    if (!genderAgeOpen) return

    function place() {
      const anchor = genderAgeAnchorRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      setGenderAgePoint({
        left: rect.left + rect.width / 2,
        top: rect.top,
      })
    }

    place()
    window.addEventListener("resize", place)
    window.addEventListener("scroll", place, true)
    return () => {
      window.removeEventListener("resize", place)
      window.removeEventListener("scroll", place, true)
    }
  }, [genderAgeOpen])

  function openGenderAgePopover() {
    setGenderAgeOpen(true)
  }

  function handleTogglePpi(nextChecked: boolean) {
    if (!nextChecked) {
      setHasPpi(false)
      return
    }
    // Dipchip already verified — gender/DOB come from the card; skip the popover.
    if (cardAlreadyRead) {
      setHasPpi(true)
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
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setCalculated({
        requestedAmount,
        interestRatePercent,
        rateType,
        installmentTerm,
        isTLC: effectiveIsTLC,
        hasPpi,
      })
      setShowDetail(true)
    }, 1000)
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
    <>
      {/* Escape the page's stacking context; above ProductDetailDrawer (110), below modals (1000). */}
      {anchor !== null
        ? createPortal(
            <div className="fixed bottom-4 z-[120]" style={anchor}>
              <div className="loan-cal-bar flex w-full items-end justify-between gap-6 rounded-xl px-4 py-2.5">
                <div className="flex min-w-0 flex-1 items-end gap-2 overflow-x-auto pb-1">
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
                              payoffAmount
                                ? payoffAmount.toLocaleString("th-TH")
                                : ""
                            }
                            placeholder="0"
                            onChange={(e) =>
                              handlePayoffChange(
                                Number(e.target.value.replace(/\D/g, "")) || 0,
                              )
                            }
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
                            onChange={(e) =>
                              handleCashBackChange(
                                Number(e.target.value.replace(/\D/g, "")) || 0,
                              )
                            }
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
                    <FieldLabel>
                      วงเงินที่ขอ
                      {isLtvError && (
                        <span className="ml-1 text-red-500 whitespace-nowrap">
                          *%LTV ไม่เกิน {maxLtvPercent}%
                        </span>
                      )}
                    </FieldLabel>
                    <div
                      className={`flex h-9 overflow-hidden rounded-md border bg-surface transition-colors ${
                        isLtvError
                          ? "border-red-500"
                          : "border-secondary-border"
                      }`}
                    >
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
                          onChange={(e) =>
                            handleRequestedAmountChange(
                              Number(e.target.value.replace(/\D/g, "")) || 0,
                            )
                          }
                          onBlur={() => commitFilter()}
                          className="w-full text-sm text-foreground outline-none"
                        />
                        <span className="text-xs text-muted-foreground">
                          บาท
                        </span>
                      </div>
                      <div className="flex w-24 shrink-0 items-center gap-1 border-l border-divider px-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={ltvInput}
                          placeholder="0"
                          onChange={(e) =>
                            handleRequestedLtvChange(e.target.value)
                          }
                          onBlur={() => commitFilter()}
                          className={`w-full text-sm outline-none ${
                            isLtvError ? "text-red-500" : "text-foreground"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            isLtvError
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          %LTV
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-9 w-px shrink-0 bg-primary/60" />

                  <ToggleChip
                    label="บัตรติดล้อ"
                    checked={effectiveIsTLC}
                    disabled={isTransferBook}
                    onChange={handleToggleTLC}
                  />

                  <div className="w-fit shrink-0">
                    <FieldLabel>งวดผ่อน</FieldLabel>
                    <Select
                      options={installmentTermOptions.map((term) => ({
                        label: `${term} งวด`,
                        value: String(term),
                      }))}
                      disabled={effectiveIsTLC || isMotorcycle}
                      value={String(installmentTerm)}
                      onChange={(e) =>
                        setInstallmentTerm(Number(e.target.value))
                      }
                      className="bg-surface-muted shrink-0 py-1.5 pr-7 text-xs w-full"
                    />
                  </div>
                  <div className="w-20 shrink-0">
                    {customer?.gender && customer?.birthDate ? (
                      <span className="mb-1 block shrink-0 self-center text-[10px] text-pale-blue w-full">
                        {`เพศ ${GENDER_LABELS[customer.gender]} | ${calculateAge(customer.birthDate)} ปี`}
                      </span>
                    ) : null}

                    <div ref={genderAgeAnchorRef}>
                      <ToggleChip
                        label="PPI"
                        checked={hasPpi}
                        onChange={handleTogglePpi}
                      />
                    </div>
                  </div>
                  <div className="w-fit shrink-0">
                    <FieldLabel>
                      {isTransferBook
                        ? "อัตราดอกเบี้ยคงที่"
                        : "อัตราดอกเบี้ยลดต้นลดดอก"}
                      {isRateError && (
                        <span className="ml-1 text-red-500 whitespace-nowrap">
                          *ไม่เกิน {maxRate}%
                        </span>
                      )}
                    </FieldLabel>
                    <div
                      className={`flex h-9 items-center gap-1 rounded-md border bg-surface px-2 transition-colors ${
                        isRateError
                          ? "border-red-500"
                          : "border-secondary-border"
                      }`}
                    >
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentRateInput}
                        placeholder="0"
                        onChange={(e) => handleRateChange(e.target.value)}
                        onBlur={handleRateBlur}
                        className={`w-full text-sm outline-none bg-transparent ${
                          isRateError ? "text-red-500" : "text-foreground"
                        }`}
                      />
                      <span
                        className={`text-xs shrink-0 ${
                          isRateError ? "text-red-500" : "text-muted-foreground"
                        }`}
                      >
                        {isTransferBook ? "% ต่อเดือน" : "% ต่อปี"}
                      </span>
                    </div>
                  </div>

                  <div className="h-9 w-px shrink-0 bg-primary/60" />

                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={isCalculating || isRateError || isLtvError}
                    className="h-9 shrink-0 rounded-lg bg-success px-4 text-sm font-medium text-white hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    <span className="text-xs font-normal text-price-label">
                      บาท
                    </span>
                  </p>

                  {showDetail && summary !== null && calculated !== null ? (
                    <div className="absolute bottom-0 right-0 z-1000">
                      <LoanCalDetailPopover
                        requestedAmount={calculated.requestedAmount}
                        interestRatePercent={calculated.interestRatePercent}
                        rateType={calculated.rateType}
                        flatRatePercent={flatRatePercent}
                        installmentTerm={calculated.installmentTerm}
                        isTLC={calculated.isTLC}
                        hasPpi={calculated.hasPpi}
                        isRefinance={isRefinance}
                        existingInstallment={existingInstallment}
                        onExistingInstallmentChange={setExistingInstallment}
                        onClose={() => setShowDetail(false)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      <LoadingToast
        open={isCalculating}
        title="กำลังคำนวณ"
        description="กรุณารอสักครู่..."
      />

      {genderAgeOpen && genderAgePoint
        ? createPortal(
            <div
              ref={genderAgePopoverRef}
              className="fixed z-1000 -translate-x-1/2 -translate-y-full pb-3"
              style={{left: genderAgePoint.left, top: genderAgePoint.top}}
            >
              <GenderAgePopover
                initialGender={customer?.gender ?? null}
                initialBirthDate={customer?.birthDate ?? null}
                onSave={handleSaveGenderAge}
                onCancel={() => setGenderAgeOpen(false)}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
