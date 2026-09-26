"use client";

import { useState } from "react";
import { CustomerCollateralPanel } from "@/components/organisms/CustomerCollateralPanel";
import { LoanQuestionsPanel } from "@/components/organisms/LoanQuestionsPanel";
import {
  collateralTypeOptions,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";
import type { CustomerLead } from "@/types/customer-lead";
import type { CollateralType, LoanPurpose, RefinanceStatus } from "@/types/ratebook";

type RatebookFormProps = {
  initialLead: CustomerLead | null;
};

export function RatebookForm({ initialLead }: RatebookFormProps) {
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose | null>(null);
  const [collateralType, setCollateralType] = useState<CollateralType | null>(null);
  const [refinanceStatus, setRefinanceStatus] = useState<RefinanceStatus | null>(null);

  const tags = [
    loanPurposeOptions.find((option) => option.value === loanPurpose)?.description,
    collateralTypeOptions
      .find((option) => option.value === collateralType)
      ?.label.replace(/ /g, "-"),
    refinanceStatusOptions.find((option) => option.value === refinanceStatus)?.description,
  ].filter((tag): tag is string => Boolean(tag));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
      <CustomerCollateralPanel initialLead={initialLead} tags={tags} />
      <LoanQuestionsPanel
        loanPurposeOptions={loanPurposeOptions}
        collateralTypeOptions={collateralTypeOptions}
        refinanceStatusOptions={refinanceStatusOptions}
        loanPurpose={loanPurpose}
        onLoanPurposeChange={setLoanPurpose}
        collateralType={collateralType}
        onCollateralTypeChange={setCollateralType}
        refinanceStatus={refinanceStatus}
        onRefinanceStatusChange={setRefinanceStatus}
      />
    </div>
  );
}
