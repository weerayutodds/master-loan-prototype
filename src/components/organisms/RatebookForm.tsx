"use client";

import { useState } from "react";
import { CarInfoForm } from "@/components/organisms/CarInfoForm";
import { CustomerCollateralPanel } from "@/components/organisms/CustomerCollateralPanel";
import { LoanQuestionsPanel } from "@/components/organisms/LoanQuestionsPanel";
import { updateOpportunityLoanQuestions } from "@/lib/actions/customer-lead-opportunity";
import {
  collateralTypeOptions,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type { CarInfo, CollateralType, LoanPurpose, RefinanceStatus } from "@/types/ratebook";

type RatebookFormProps = {
  initialOpportunity: CustomerLeadOpportunity | null;
};

export function RatebookForm({ initialOpportunity }: RatebookFormProps) {
  const opportunityId = initialOpportunity?.id ?? null;

  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose | null>(
    initialOpportunity?.loanPurpose ?? null,
  );
  const [collateralType, setCollateralType] = useState<CollateralType | null>(
    initialOpportunity?.collateralType ?? null,
  );
  const [refinanceStatus, setRefinanceStatus] = useState<RefinanceStatus | null>(
    initialOpportunity?.refinanceStatus ?? null,
  );
  const [carInfo, setCarInfo] = useState<CarInfo>(
    initialOpportunity
      ? {
          brand: initialOpportunity.carBrand ?? undefined,
          model: initialOpportunity.carModel ?? undefined,
          year: initialOpportunity.carYear ?? undefined,
          condition: initialOpportunity.carCondition ?? undefined,
          doors: initialOpportunity.carDoors ?? undefined,
          carType: initialOpportunity.carType ?? undefined,
          engineCc: initialOpportunity.carEngineCc ?? undefined,
          transmission: initialOpportunity.carTransmission ?? undefined,
          bodyType: initialOpportunity.carBodyType ?? undefined,
          subModel: initialOpportunity.carSubModel ?? undefined,
        }
      : {},
  );

  function commitLoanQuestionsIfComplete(
    nextLoanPurpose: LoanPurpose | null,
    nextCollateralType: CollateralType | null,
    nextRefinanceStatus: RefinanceStatus | null,
  ) {
    if (opportunityId && nextLoanPurpose && nextCollateralType && nextRefinanceStatus) {
      void updateOpportunityLoanQuestions(opportunityId, {
        loanPurpose: nextLoanPurpose,
        collateralType: nextCollateralType,
        refinanceStatus: nextRefinanceStatus,
      });
    }
  }

  function handleLoanPurposeChange(value: LoanPurpose) {
    setLoanPurpose(value);
    commitLoanQuestionsIfComplete(value, collateralType, refinanceStatus);
  }

  function handleCollateralTypeChange(value: CollateralType) {
    setCollateralType(value);
    commitLoanQuestionsIfComplete(loanPurpose, value, refinanceStatus);
  }

  function handleRefinanceStatusChange(value: RefinanceStatus) {
    setRefinanceStatus(value);
    commitLoanQuestionsIfComplete(loanPurpose, collateralType, value);
  }

  const tags = [
    loanPurposeOptions.find((option) => option.value === loanPurpose)?.description,
    collateralTypeOptions
      .find((option) => option.value === collateralType)
      ?.label.replace(/ /g, "-"),
    refinanceStatusOptions.find((option) => option.value === refinanceStatus)?.description,
  ].filter((tag): tag is string => Boolean(tag));

  const allQuestionsAnswered =
    loanPurpose !== null && collateralType !== null && refinanceStatus !== null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
      <CustomerCollateralPanel
        initialOpportunity={initialOpportunity}
        opportunityId={opportunityId}
        collateralType={collateralType}
        tags={tags}
        carInfo={carInfo}
      />
      {allQuestionsAnswered ? (
        <CarInfoForm
          opportunityId={opportunityId}
          carInfo={carInfo}
          onCarInfoChange={setCarInfo}
        />
      ) : (
        <LoanQuestionsPanel
          loanPurposeOptions={loanPurposeOptions}
          collateralTypeOptions={collateralTypeOptions}
          refinanceStatusOptions={refinanceStatusOptions}
          loanPurpose={loanPurpose}
          onLoanPurposeChange={handleLoanPurposeChange}
          collateralType={collateralType}
          onCollateralTypeChange={handleCollateralTypeChange}
          refinanceStatus={refinanceStatus}
          onRefinanceStatusChange={handleRefinanceStatusChange}
        />
      )}
    </div>
  );
}
