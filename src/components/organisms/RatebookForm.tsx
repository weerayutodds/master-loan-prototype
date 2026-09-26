"use client"

import {CarInfoForm} from "@/components/organisms/CarInfoForm"
import {CustomerCollateralPanel} from "@/components/organisms/CustomerCollateralPanel"
import {LeadContent} from "@/components/organisms/LeadContent"
import {LoanCalBar} from "@/components/organisms/LoanCalBar"
import {LoanQuestionsPanel} from "@/components/organisms/LoanQuestionsPanel"
import {ProductCatalog} from "@/components/organisms/ProductCatalog"
import {ProductGuide} from "@/components/organisms/ProductGuide"
import {updateOpportunityLoanQuestions} from "@/lib/actions/customer-lead-opportunity"
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
  CollateralType,
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
  const [showCarInfo, setShowCarInfo] = useState(false)
  const [showProductGuide, setShowProductGuide] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(null)

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
      />
      {selectedProduct && initialOpportunity ? (
        <LeadContent
          initialOpportunity={initialOpportunity}
          carInfo={carInfo}
          selectedProduct={selectedProduct}
        />
      ) : (
        <div className="space-y-6">
          {showCarInfo ? (
            <CarInfoForm
              opportunityId={opportunityId}
              carInfo={carInfo}
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
                onSelectConfirmed={setSelectedProduct}
              />
            </>
          )}

          <LoanCalBar productCatalog={productCatalogMock} />
        </div>
      )}
    </div>
  )
}
