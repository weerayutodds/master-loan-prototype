"use client";

import { usePageTitleOverride } from "@/components/organisms/AppShell";
import { CarInfoForm } from "@/components/organisms/CarInfoForm";
import { CustomerCollateralPanel } from "@/components/organisms/CustomerCollateralPanel";
import { LeadContent } from "@/components/organisms/LeadContent";
import { LoanCalBar } from "@/components/organisms/LoanCalBar";
import { LoanQuestionsPanel } from "@/components/organisms/LoanQuestionsPanel";
import { ProductCatalog } from "@/components/organisms/ProductCatalog";
import { ProductGuide } from "@/components/organisms/ProductGuide";
import {
  updateOpportunityLoanInfo,
  updateOpportunityLoanQuestions,
  updateOpportunitySelectedProduct,
} from "@/lib/actions/customer-lead-opportunity";
import { getMaxApprovedAmount } from "@/lib/loan-cal";
import {
  collateralTypeOptions,
  existingFinanceOptions,
  findProductCatalogItemById,
  getProductCatalogData,
  getProductGuideData,
  getVehicleCarType,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";
import type { CustomerLead } from "@/types/customer-lead";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralType,
  CustomerInfo,
  LoanInfo,
  LoanPurpose,
  RefinanceStatus,
} from "@/types/ratebook";
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/types/product-catalog";
import { useState } from "react";

type RatebookFormProps = {
  initialOpportunity: CustomerLeadOpportunity | null;
  initialLead?: CustomerLead | null;
};

type LoanQuestionAnswers = {
  loanPurpose: LoanPurpose;
  collateralType: CollateralType;
  refinanceStatus: RefinanceStatus;
  existingFinanceCompany: string | null;
};

// The four loan questions as a complete set, or null while any of them is unanswered.
// Returning the answers rather than a boolean keeps them narrowed for the server action.
function toCompleteLoanQuestions(
  loanPurpose: LoanPurpose | null,
  collateralType: CollateralType | null,
  refinanceStatus: RefinanceStatus | null,
  existingFinance: string | null,
): LoanQuestionAnswers | null {
  // A รีไฟแนนซ์ isn't complete until we know which ไฟแนนซ์ currently holds the car.
  const financeAnswered =
    refinanceStatus === "still-paying" ? Boolean(existingFinance) : true;
  if (!loanPurpose || !collateralType || !refinanceStatus || !financeAnswered) {
    return null;
  }
  return {
    loanPurpose,
    collateralType,
    refinanceStatus,
    // "ผ่อนหมดแล้ว" means there is no existing ไฟแนนซ์ to carry over.
    existingFinanceCompany:
      refinanceStatus === "still-paying" ? existingFinance : null,
  };
}

export function RatebookForm({
  initialOpportunity,
  initialLead = null,
}: RatebookFormProps) {
  const opportunityId = initialOpportunity?.id ?? null;
  const leadId = initialOpportunity?.leadId ?? initialLead?.id ?? null;

  const [customer, setCustomer] = useState<CustomerInfo | null>(
    initialOpportunity
      ? {
          firstName: initialOpportunity.firstName,
          lastName: initialOpportunity.lastName,
          phone: initialOpportunity.phone,
          gender: initialOpportunity.gender ?? undefined,
          birthDate: initialOpportunity.birthDate ?? undefined,
        }
      : initialLead
        ? {
            firstName: initialLead.firstName,
            lastName: initialLead.lastName,
            phone: initialLead.phone,
            gender: initialLead.gender ?? undefined,
            birthDate: initialLead.birthDate ?? undefined,
          }
        : null,
  );
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose | null>(
    initialOpportunity?.loanPurpose ?? null,
  );
  const [collateralType, setCollateralType] = useState<CollateralType | null>(
    initialOpportunity?.collateralType ?? null,
  );
  const [refinanceStatus, setRefinanceStatus] =
    useState<RefinanceStatus | null>(
      initialOpportunity?.refinanceStatus ?? null,
    );
  const [existingFinance, setExistingFinance] = useState<string | null>(
    initialOpportunity?.existingFinanceCompany ?? null,
  );
  const [carInfo, setCarInfo] = useState<CarInfo>(
    initialOpportunity
      ? {
          brand: initialOpportunity.carBrand ?? undefined,
          model: initialOpportunity.carModel ?? undefined,
          year: initialOpportunity.carYear ?? undefined,
          condition: initialOpportunity.carCondition ?? undefined,
          doors: initialOpportunity.carDoors ?? undefined,
          // ประเภทรถ is system-derived — CarInfoForm never lets it be answered — so it is re-derived
          // from the saved รุ่น/ประตู rather than trusting a value stored before that rule existed.
          carType: getVehicleCarType(
            initialOpportunity.collateralType,
            initialOpportunity.carBrand ?? undefined,
            initialOpportunity.carModel ?? undefined,
            initialOpportunity.carDoors ?? undefined,
          ),
          engineCc: initialOpportunity.carEngineCc ?? undefined,
          transmission: initialOpportunity.carTransmission ?? undefined,
          bodyType: initialOpportunity.carBodyType ?? undefined,
          subModel: initialOpportunity.carSubModel ?? undefined,
        }
      : {},
  );
  const [loanInfo, setLoanInfo] = useState<LoanInfo>(
    initialOpportunity
      ? {
          requestedAmount:
            initialOpportunity.requestedAmount != null
              ? Number(initialOpportunity.requestedAmount)
              : undefined,
          wantsWheelCard: initialOpportunity.wantsWheelCard ?? undefined,
          hasPpi: initialOpportunity.hasPpi ?? undefined,
          installmentTerm:
            initialOpportunity.installmentTerm != null
              ? Number(initialOpportunity.installmentTerm)
              : undefined,
        }
      : {},
  );
  const [carInsuranceInfo, setCarInsuranceInfo] = useState<CarInsuranceInfo>(
    initialOpportunity
      ? {
          possessionDate: initialOpportunity.possessionDate ?? undefined,
          carInsuranceExpiry:
            initialOpportunity.carInsuranceExpiry ?? undefined,
          carInsuranceCompany:
            initialOpportunity.carInsuranceCompany ?? undefined,
          compulsoryExpiry: initialOpportunity.compulsoryExpiry ?? undefined,
          compulsoryBundledWithCarInsurance:
            initialOpportunity.compulsoryBundledWithCarInsurance,
          compulsoryCompany: initialOpportunity.compulsoryCompany ?? undefined,
        }
      : {},
  );
  const hasSavedProduct = Boolean(initialOpportunity?.selectedProductId);
  const [showCarInfo, setShowCarInfo] = useState(
    () =>
      hasSavedProduct ||
      toCompleteLoanQuestions(
        loanPurpose,
        collateralType,
        refinanceStatus,
        existingFinance,
      ) !== null,
  );
  const [showProductGuide, setShowProductGuide] = useState(hasSavedProduct);
  const productGuideData = getProductGuideData(carInfo, collateralType);
  const productCatalogContext = {
    carInfo,
    collateralType,
    loanPurpose,
    refinanceStatus,
    appraisalPrice: productGuideData.appraisalPrice,
  };
  const productCatalogData = getProductCatalogData(productCatalogContext);
  const [productFilter, setProductFilter] =
    useState<ProductCatalogFilter | null>(null);

  // Runs once, against the first render's persisted car info — so a saved product
  // rehydrates from the same catalog the customer picked it out of.
  const [selectedProduct, setSelectedProduct] =
    useState<ProductCatalogItem | null>(
      initialOpportunity?.selectedProductId
        ? findProductCatalogItemById(
            initialOpportunity.selectedProductId,
            productCatalogContext,
          )
        : null,
    );

  // The questions stay on screen and editable, so this runs on every answer change and
  // has to take the car form away again when an answer is undone, not just reveal it.
  function commitLoanQuestionsIfComplete(
    nextLoanPurpose: LoanPurpose | null,
    nextCollateralType: CollateralType | null,
    nextRefinanceStatus: RefinanceStatus | null,
    nextExistingFinance: string | null,
  ) {
    const answers = toCompleteLoanQuestions(
      nextLoanPurpose,
      nextCollateralType,
      nextRefinanceStatus,
      nextExistingFinance,
    );
    setShowCarInfo(answers !== null);
    if (!answers) {
      // No car form means no car to have appraised.
      setShowProductGuide(false);
      return;
    }
    if (opportunityId) {
      void updateOpportunityLoanQuestions(opportunityId, answers);
    }
  }

  usePageTitleOverride(selectedProduct ? "สรุปรายการ Lead" : null);

  function handleSelectedProductConfirmed(item: ProductCatalogItem) {
    setSelectedProduct(item);
    window.scrollTo({ top: 0, behavior: "instant" });
    const nextLoanInfo: LoanInfo = {
      ...loanInfo,
      requestedAmount: loanInfo.requestedAmount ?? getMaxApprovedAmount(item),
    };
    setLoanInfo(nextLoanInfo);
    if (opportunityId) {
      void updateOpportunitySelectedProduct(opportunityId, item.id);
      void updateOpportunityLoanInfo(opportunityId, nextLoanInfo);
    }
  }

  function handleLoanPurposeChange(value: LoanPurpose) {
    setLoanPurpose(value);
    commitLoanQuestionsIfComplete(
      value,
      collateralType,
      refinanceStatus,
      existingFinance,
    );
  }

  function handleCollateralTypeChange(value: CollateralType) {
    setCollateralType(value);
    // A different หลักประกัน swaps the whole vehicle catalog — brands, models, ประเภทรถ,
    // ตัวถัง and cc are all keyed off it — so the car answered for the old type no longer
    // exists in these dropdowns, and any appraisal computed from it is void.
    setCarInfo({});
    setShowProductGuide(false);
    commitLoanQuestionsIfComplete(
      loanPurpose,
      value,
      refinanceStatus,
      existingFinance,
    );
  }

  function handleRefinanceStatusChange(value: RefinanceStatus) {
    setRefinanceStatus(value);
    // "ผ่อนหมดแล้ว" means there is no existing ไฟแนนซ์ to carry over.
    const nextExistingFinance = value === "still-paying" ? existingFinance : null;
    setExistingFinance(nextExistingFinance);
    commitLoanQuestionsIfComplete(
      loanPurpose,
      collateralType,
      value,
      nextExistingFinance,
    );
  }

  function handleExistingFinanceChange(value: string) {
    setExistingFinance(value);
    commitLoanQuestionsIfComplete(
      loanPurpose,
      collateralType,
      refinanceStatus,
      value,
    );
  }

  // The product guide is only ever revealed by "ดูราคาประเมิน", so editing the car
  // info takes it away again — it can never show numbers for a car that changed since.
  function handleCarInfoChange(nextCarInfo: CarInfo) {
    setCarInfo(nextCarInfo);
    setShowProductGuide(false);
  }

  const tags = [
    loanPurposeOptions.find((option) => option.value === loanPurpose)
      ?.description,
    collateralTypeOptions
      .find((option) => option.value === collateralType)
      ?.label.replace(/ /g, "-"),
    refinanceStatusOptions.find((option) => option.value === refinanceStatus)
      ?.description,
    // ไฟแนนซ์เดิม — only ever set while refinanceStatus is "still-paying"
    existingFinanceOptions.find((option) => option.value === existingFinance)
      ?.label,
  ].filter((tag): tag is string => Boolean(tag));

  return (
    <div className="grid grid-cols-1 items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="lg:sticky lg:top-19">
        <CustomerCollateralPanel
          initialOpportunity={initialOpportunity}
          initialLead={initialLead}
          opportunityId={opportunityId}
          leadId={leadId}
          tags={tags}
          carInfo={carInfo}
          collateralType={collateralType}
          loanPurpose={loanPurpose}
          refinanceStatus={refinanceStatus}
          existingFinance={existingFinance}
          selectedProductId={selectedProduct?.id ?? null}
          hasSelectedProduct={selectedProduct !== null}
          loanInfo={loanInfo}
          carInsuranceInfo={carInsuranceInfo}
          customer={customer}
          onCustomerChange={setCustomer}
        />
      </div>
      {selectedProduct && initialOpportunity ? (
        <LeadContent
          initialOpportunity={initialOpportunity}
          carInfo={carInfo}
          selectedProduct={selectedProduct}
          loanInfo={loanInfo}
          onLoanInfoChange={setLoanInfo}
          carInsuranceInfo={carInsuranceInfo}
          onCarInsuranceInfoChange={setCarInsuranceInfo}
        />
      ) : (
        <div className="space-y-6">
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
            existingFinanceOptions={existingFinanceOptions}
            existingFinance={existingFinance}
            onExistingFinanceChange={handleExistingFinanceChange}
          />

          {showCarInfo && (
            <CarInfoForm
              opportunityId={opportunityId}
              carInfo={carInfo}
              collateralType={collateralType}
              onCarInfoChange={handleCarInfoChange}
              onViewAppraisal={() => {
                // LoanCalBar remounts with empty inputs, so start unfiltered too.
                setProductFilter(null);
                setShowProductGuide(true);
              }}
            />
          )}

          {showProductGuide && (
            <>
              <ProductGuide data={productGuideData} />
              <ProductCatalog
                data={productCatalogData}
                filter={productFilter}
                onSelectConfirmed={handleSelectedProductConfirmed}
              />
              <LoanCalBar
                productCatalog={productCatalogData}
                appraisalPrice={productGuideData.appraisalPrice}
                collateralType={collateralType}
                customer={customer}
                opportunityId={opportunityId}
                refinanceStatus={refinanceStatus}
                onCustomerChange={setCustomer}
                onFilterChange={setProductFilter}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
