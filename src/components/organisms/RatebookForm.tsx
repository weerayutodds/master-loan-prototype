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
  updateOpportunityLoanQuestions,
  updateOpportunitySelectedProduct,
} from "@/lib/actions/customer-lead-opportunity";
import {
  collateralTypeOptions,
  existingFinanceOptions,
  findProductCatalogItemById,
  getProductCatalogData,
  getProductGuideData,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";
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
};

export function RatebookForm({ initialOpportunity }: RatebookFormProps) {
  const opportunityId = initialOpportunity?.id ?? null;

  const [customer, setCustomer] = useState<CustomerInfo | null>(
    initialOpportunity
      ? {
          firstName: initialOpportunity.firstName,
          lastName: initialOpportunity.lastName,
          phone: initialOpportunity.phone,
          gender: initialOpportunity.gender ?? undefined,
          birthDate: initialOpportunity.birthDate ?? undefined,
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
          carType: initialOpportunity.carType ?? undefined,
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
  const [showCarInfo, setShowCarInfo] = useState(hasSavedProduct);
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

  function commitLoanQuestionsIfComplete(
    nextLoanPurpose: LoanPurpose | null,
    nextCollateralType: CollateralType | null,
    nextRefinanceStatus: RefinanceStatus | null,
    nextExistingFinance: string | null,
  ) {
    // A รีไฟแนนซ์ can't move on until we know which ไฟแนนซ์ currently holds the car.
    const financeAnswered =
      nextRefinanceStatus === "still-paying" ? Boolean(nextExistingFinance) : true;
    if (
      nextLoanPurpose &&
      nextCollateralType &&
      nextRefinanceStatus &&
      financeAnswered
    ) {
      setShowCarInfo(true);
      if (opportunityId) {
        void updateOpportunityLoanQuestions(opportunityId, {
          loanPurpose: nextLoanPurpose,
          collateralType: nextCollateralType,
          refinanceStatus: nextRefinanceStatus,
          existingFinanceCompany:
            nextRefinanceStatus === "still-paying" ? nextExistingFinance : null,
        });
      }
    }
  }

  usePageTitleOverride(selectedProduct ? "สรุปรายการ Lead" : null);

  function handleSelectedProductConfirmed(item: ProductCatalogItem) {
    setSelectedProduct(item);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (opportunityId) {
      void updateOpportunitySelectedProduct(opportunityId, item.id);
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
    // A different หลักประกัน swaps the whole vehicle catalog, so any shown appraisal is void.
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
    <div className="grid grid-cols-1 items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_2fr]">
      <CustomerCollateralPanel
        initialOpportunity={initialOpportunity}
        opportunityId={opportunityId}
        tags={tags}
        carInfo={carInfo}
        collateralType={collateralType}
        showCarInfo={showCarInfo}
        setShowCarInfo={(value: boolean) => {
          setShowCarInfo(value);
          // Reopening the collateral questions is an intent to edit — drop the
          // appraisal shown against the old answers, same as any car-info edit.
          if (!value) setShowProductGuide(false);
        }}
        hasSelectedProduct={selectedProduct !== null}
        loanInfo={loanInfo}
        carInsuranceInfo={carInsuranceInfo}
        customer={customer}
        onCustomerChange={setCustomer}
      />
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
          {showCarInfo ? (
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
              existingFinanceOptions={existingFinanceOptions}
              existingFinance={existingFinance}
              onExistingFinanceChange={handleExistingFinanceChange}
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
                customer={customer}
                opportunityId={opportunityId}
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
