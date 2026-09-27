"use client"

import {usePageTitleOverride} from "@/components/organisms/AppShell"
import {CarInfoForm} from "@/components/organisms/CarInfoForm"
import {CustomerCollateralPanel} from "@/components/organisms/CustomerCollateralPanel"
import {LeadContent} from "@/components/organisms/LeadContent"
import {LoanCalBar} from "@/components/organisms/LoanCalBar"
import {LoanQuestionsPanel} from "@/components/organisms/LoanQuestionsPanel"
import {ProductCatalog} from "@/components/organisms/ProductCatalog"
import {ProductGuide} from "@/components/organisms/ProductGuide"
import {
  updateOpportunityLoanQuestions,
  updateOpportunitySelectedProduct,
} from "@/lib/actions/customer-lead-opportunity"
import {
  collateralTypeOptions,
  loanPurposeOptions,
  productCatalogMock,
  productGuideMock,
  refinanceStatusOptions,
} from "@/lib/mock"
import type {CustomerLeadOpportunity} from "@/types/customer-lead-opportunity"
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralType,
  LoanInfo,
  LoanPurpose,
  RefinanceStatus,
} from "@/types/ratebook"
import type {ProductCatalogItem} from "@/types/product-catalog"
import {useState} from "react"

type RatebookFormProps = {
  initialOpportunity: CustomerLeadOpportunity | null
}

export function RatebookForm({initialOpportunity}: RatebookFormProps) {
  const opportunityId = initialOpportunity?.id ?? null

  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose | null>(
    initialOpportunity?.loanPurpose ?? null,
  )
  const [collateralType, setCollateralType] = useState<CollateralType | null>(
    initialOpportunity?.collateralType ?? null,
  )
  const [refinanceStatus, setRefinanceStatus] =
    useState<RefinanceStatus | null>(
      initialOpportunity?.refinanceStatus ?? null,
    )
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
  )
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
  )
  const [carInsuranceInfo, setCarInsuranceInfo] = useState<CarInsuranceInfo>(
    initialOpportunity
      ? {
          possessionDate: initialOpportunity.possessionDate ?? undefined,
          carInsuranceExpiry: initialOpportunity.carInsuranceExpiry ?? undefined,
          carInsuranceCompany: initialOpportunity.carInsuranceCompany ?? undefined,
          compulsoryExpiry: initialOpportunity.compulsoryExpiry ?? undefined,
          compulsoryBundledWithCarInsurance:
            initialOpportunity.compulsoryBundledWithCarInsurance,
          compulsoryCompany: initialOpportunity.compulsoryCompany ?? undefined,
        }
      : {},
  )
  const hasSavedProduct = Boolean(initialOpportunity?.selectedProductId)
  const [showCarInfo, setShowCarInfo] = useState(hasSavedProduct)
  const [showProductGuide, setShowProductGuide] = useState(hasSavedProduct)
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(
    initialOpportunity?.selectedProductId
      ? productCatalogMock.items.find(
          (item) => item.id === initialOpportunity.selectedProductId,
        ) ?? null
      : null,
  )

  function commitLoanQuestionsIfComplete(
    nextLoanPurpose: LoanPurpose | null,
    nextCollateralType: CollateralType | null,
    nextRefinanceStatus: RefinanceStatus | null,
  ) {
    if (nextLoanPurpose && nextCollateralType && nextRefinanceStatus) {
      setShowCarInfo(true)
      if (opportunityId) {
        void updateOpportunityLoanQuestions(opportunityId, {
          loanPurpose: nextLoanPurpose,
          collateralType: nextCollateralType,
          refinanceStatus: nextRefinanceStatus,
        })
      }
    }
  }

  usePageTitleOverride(selectedProduct ? "สรุปรายการ Lead" : null)

  function handleSelectedProductConfirmed(item: ProductCatalogItem) {
    setSelectedProduct(item)
    window.scrollTo({top: 0, behavior: "instant"})
    if (opportunityId) {
      void updateOpportunitySelectedProduct(opportunityId, item.id)
    }
  }

  function handleLoanPurposeChange(value: LoanPurpose) {
    setLoanPurpose(value)
    commitLoanQuestionsIfComplete(value, collateralType, refinanceStatus)
  }

  function handleCollateralTypeChange(value: CollateralType) {
    setCollateralType(value)
    commitLoanQuestionsIfComplete(loanPurpose, value, refinanceStatus)
  }

  function handleRefinanceStatusChange(value: RefinanceStatus) {
    setRefinanceStatus(value)
    commitLoanQuestionsIfComplete(loanPurpose, collateralType, value)
  }

  const tags = [
    loanPurposeOptions.find((option) => option.value === loanPurpose)
      ?.description,
    collateralTypeOptions
      .find((option) => option.value === collateralType)
      ?.label.replace(/ /g, "-"),
    refinanceStatusOptions.find((option) => option.value === refinanceStatus)
      ?.description,
  ].filter((tag): tag is string => Boolean(tag))

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
          setShowCarInfo(value)
        }}
        hasSelectedProduct={selectedProduct !== null}
        loanInfo={loanInfo}
        carInsuranceInfo={carInsuranceInfo}
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
              onCarInfoChange={setCarInfo}
              onViewAppraisal={() => setShowProductGuide(true)}
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

          {showProductGuide && (
            <>
              <ProductGuide data={productGuideMock} />
              <ProductCatalog
                data={productCatalogMock}
                onSelectConfirmed={handleSelectedProductConfirmed}
              />
              <LoanCalBar
                productCatalog={productCatalogMock}
                appraisalPrice={productGuideMock.appraisalPrice}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
