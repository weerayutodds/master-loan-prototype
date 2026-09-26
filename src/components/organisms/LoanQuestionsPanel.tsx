"use client";

import { useState } from "react";
import { Card } from "@/components/molecules/Card";
import { OptionCard } from "@/components/molecules/OptionCard";
import type {
  CollateralType,
  LoanPurpose,
  OptionCardData,
  RefinanceStatus,
} from "@/types/ratebook";

type LoanQuestionsPanelProps = {
  loanPurposeOptions: OptionCardData<LoanPurpose>[];
  collateralTypeOptions: OptionCardData<CollateralType>[];
  refinanceStatusOptions: OptionCardData<RefinanceStatus>[];
};

export function LoanQuestionsPanel({
  loanPurposeOptions,
  collateralTypeOptions,
  refinanceStatusOptions,
}: LoanQuestionsPanelProps) {
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>("need-money");
  const [collateralType, setCollateralType] = useState<CollateralType | null>(null);
  const [refinanceStatus, setRefinanceStatus] = useState<RefinanceStatus | null>(null);

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground">ลูกค้าต้องการเงินหรืออยากซื้อรถ?</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loanPurposeOptions.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={loanPurpose === option.value}
              onSelect={() => setLoanPurpose(option.value)}
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
              selected={collateralType === option.value}
              onSelect={() => setCollateralType(option.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">รถผ่อนหมดหรือยัง?</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {refinanceStatusOptions.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={refinanceStatus === option.value}
              onSelect={() => setRefinanceStatus(option.value)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
