"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CustomerCollateralPanel } from "@/components/organisms/CustomerCollateralPanel";
import { LoanQuestionsPanel } from "@/components/organisms/LoanQuestionsPanel";
import {
  collateralTypeOptions,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";
import type { CollateralType, LoanPurpose, RefinanceStatus } from "@/types/ratebook";

export default function RatebookPage() {
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
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← หน้าแรก
        </Link>
        <h1 className="text-xl font-semibold text-foreground">ทำรายการสินเชื่อ</h1>
        <Icon name="menu" className="size-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
        <CustomerCollateralPanel collateralType={collateralType} tags={tags} />
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
    </>
  );
}
