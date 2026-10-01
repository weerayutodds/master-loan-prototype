"use client"

import {Card} from "@/components/molecules/Card"
import {OptionCard} from "@/components/molecules/OptionCard"
import {SearchableSelect} from "@/components/molecules/SearchableSelect"
import type {
  CollateralType,
  LoanPurpose,
  OptionCardData,
  RefinanceStatus,
} from "@/types/ratebook"

type LoanQuestionsPanelProps = {
  loanPurposeOptions: OptionCardData<LoanPurpose>[]
  collateralTypeOptions: OptionCardData<CollateralType>[]
  refinanceStatusOptions: OptionCardData<RefinanceStatus>[]
  loanPurpose: LoanPurpose | null
  onLoanPurposeChange: (value: LoanPurpose) => void
  collateralType: CollateralType | null
  onCollateralTypeChange: (value: CollateralType) => void
  refinanceStatus: RefinanceStatus | null
  onRefinanceStatusChange: (value: RefinanceStatus) => void
  existingFinanceOptions: {value: string; label: string}[]
  existingFinance: string | null
  onExistingFinanceChange: (value: string) => void
}

export function LoanQuestionsPanel({
  loanPurposeOptions,
  collateralTypeOptions,
  refinanceStatusOptions,
  loanPurpose,
  onLoanPurposeChange,
  collateralType,
  onCollateralTypeChange,
  refinanceStatus,
  onRefinanceStatusChange,
  existingFinanceOptions,
  existingFinance,
  onExistingFinanceChange,
}: LoanQuestionsPanelProps) {
  return (
    <Card className="relative z-10 space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground">
          ลูกค้าต้องการเงินหรืออยากซื้อรถ?
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {loanPurposeOptions.map((option) => (
            <OptionCard
              textCenter
              key={option.value}
              label={option.label}
              description={option.description}
              selected={loanPurpose === option.value}
              onSelect={() => onLoanPurposeChange(option.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">ประเภทหลักประกัน</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {collateralTypeOptions.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              icon={option.icon}
              image={option.image}
              imageClassName={option.imageClassName}
              selected={collateralType === option.value}
              onSelect={() => onCollateralTypeChange(option.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">รถผ่อนหมดหรือยัง?</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {refinanceStatusOptions.map((option) => (
            <OptionCard
              textCenter
              key={option.value}
              label={option.label}
              description={option.description}
              selected={refinanceStatus === option.value}
              onSelect={() => onRefinanceStatusChange(option.value)}
            />
          ))}
        </div>

        {refinanceStatus === "still-paying" ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <SearchableSelect
              options={existingFinanceOptions}
              value={existingFinance}
              onChange={onExistingFinanceChange}
              placeholder="เลือกไฟแนนซ์เดิม"
              emptyMessage="ไม่พบไฟแนนซ์ที่ค้นหา"
              className="sm:w-[50%]"
            />
            <p className="text-sm text-muted-foreground">
              รับเฉพาะไฟแนนซ์ที่มีในรายการเท่านั้น
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
