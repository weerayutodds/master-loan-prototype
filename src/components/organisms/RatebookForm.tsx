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
  updateCustomerLeadCardVerified,
  updateCustomerLeadNcbGrade,
} from "@/lib/actions/customer-lead"
import {
  createCustomerLeadOpportunity,
  updateOpportunityCardVerified,
  updateOpportunityLoanInfo,
  updateOpportunityLoanQuestions,
  updateOpportunityNcbGrade,
  updateOpportunitySelectedProduct,
} from "@/lib/actions/customer-lead-opportunity"
import {getDefaultProductCatalogFilter} from "@/lib/loan-cal"
import {
  collateralTypeOptions,
  existingFinanceOptions,
  findProductCatalogItemById,
  getProductCatalogData,
  getProductGuideData,
  loanPurposeOptions,
  mockKeyInCardCustomer,
  refinanceStatusOptions,
} from "@/lib/mock"
import type {VerificationMethod} from "@/types/customer-form"
import type {CustomerLead, NcbGrade} from "@/types/customer-lead"
import type {CustomerLeadOpportunity} from "@/types/customer-lead-opportunity"
import type {
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/types/product-catalog"
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralType,
  CustomerInfo,
  LoanInfo,
  LoanPurpose,
  RefinanceStatus,
} from "@/types/ratebook"
import {useRouter} from "next/navigation"
import {useCallback, useState} from "react"

type RatebookFormProps = {
  initialOpportunity: CustomerLeadOpportunity | null
  initialLead?: CustomerLead | null
}

type LoanQuestionAnswers = {
  loanPurpose: LoanPurpose
  collateralType: CollateralType
  refinanceStatus: RefinanceStatus
  existingFinanceCompany: string | null
}

function toCompleteLoanQuestions(
  loanPurpose: LoanPurpose | null,
  collateralType: CollateralType | null,
  refinanceStatus: RefinanceStatus | null,
  existingFinance: string | null,
): LoanQuestionAnswers | null {
  const financeAnswered =
    refinanceStatus === "still-paying" ? Boolean(existingFinance) : true
  if (!loanPurpose || !collateralType || !refinanceStatus || !financeAnswered) {
    return null
  }
  return {
    loanPurpose,
    collateralType,
    refinanceStatus,

    existingFinanceCompany:
      refinanceStatus === "still-paying" ? existingFinance : null,
  }
}

export function RatebookForm({
  initialOpportunity,
  initialLead = null,
}: RatebookFormProps) {
  const router = useRouter()
  const opportunityId = initialOpportunity?.id ?? null
  const leadId = initialOpportunity?.leadId ?? initialLead?.id ?? null

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
  )

  const [ncbAwaitingRefresh, setNcbAwaitingRefresh] = useState(false)
  const [ncbGrade, setNcbGrade] = useState<NcbGrade | null>(
    initialLead?.ncbGrade ?? initialOpportunity?.ncbGrade ?? null,
  )
  const [idCardNumber, setIdCardNumber] = useState(
    initialOpportunity?.idCardNumber ?? initialLead?.idCardNumber ?? "",
  )
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod | null>(
      initialOpportunity?.verificationMethod ??
        initialLead?.verificationMethod ??
        null,
    )
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
  const [existingFinance, setExistingFinance] = useState<string | null>(
    initialOpportunity?.existingFinanceCompany ?? null,
  )
  const [carInfo, setCarInfo] = useState<CarInfo>(
    initialOpportunity
      ? {
          brand: initialOpportunity.carBrand ?? undefined,
          model: initialOpportunity.carModel ?? undefined,
          year: initialOpportunity.carYear ?? undefined,
          condition: initialOpportunity.carCondition ?? undefined,
          doors: initialOpportunity.carDoors ?? undefined,

          // Read back rather than re-derived: the ratebook row that decided it
          // is not in memory until the brand file loads.
          carType: initialOpportunity.carType ?? undefined,
          engineCc: initialOpportunity.carEngineCc ?? undefined,
          transmission: initialOpportunity.carTransmission ?? undefined,
          bodyType: initialOpportunity.carBodyType ?? undefined,
          subModel: initialOpportunity.carSubModel ?? undefined,
          ratebookCode: initialOpportunity.carRatebookCode ?? undefined,
          appraisalPrice: initialOpportunity.carAppraisalPrice ?? undefined,
          ratebookPrice: initialOpportunity.carRatebookPrice ?? undefined,
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
  const handleLoanTermsChange = useCallback(
    (terms: Omit<LoanInfo, "requestedAmount">) =>
      setLoanInfo((current) => ({...current, ...terms})),
    [],
  )
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
  )
  const hasSavedProduct = Boolean(initialOpportunity?.selectedProductId)
  const [showCarInfo, setShowCarInfo] = useState(
    () =>
      hasSavedProduct ||
      toCompleteLoanQuestions(
        loanPurpose,
        collateralType,
        refinanceStatus,
        existingFinance,
      ) !== null,
  )
  const [showProductGuide, setShowProductGuide] = useState(hasSavedProduct)
  const productGuideData = getProductGuideData(carInfo.appraisalPrice)
  const productCatalogContext = {
    carInfo,
    collateralType,
    loanPurpose,
    refinanceStatus,
    appraisalPrice: productGuideData.appraisalPrice,
  }
  const productCatalogData = getProductCatalogData(productCatalogContext)
  const [productFilter, setProductFilter] =
    useState<ProductCatalogFilter | null>(null)

  const [selectedProduct, setSelectedProduct] =
    useState<ProductCatalogItem | null>(
      initialOpportunity?.selectedProductId
        ? findProductCatalogItemById(
            initialOpportunity.selectedProductId,
            productCatalogContext,
          )
        : null,
    )

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
    )
    setShowCarInfo(answers !== null)
    if (!answers) {
      setShowProductGuide(false)
      return
    }
    if (opportunityId) {
      void updateOpportunityLoanQuestions(opportunityId, answers)
    }
  }

  usePageTitleOverride(selectedProduct ? "สรุปรายการ Lead" : null)

  // The first card read (Dipchip or eNCB) fills the customer's own info from the card too.
  function applyCardRead(): string {
    const cardIdNumber = idCardNumber || mockKeyInCardCustomer.idCardNumber
    if (verificationMethod !== "card") {
      const [firstName, ...rest] = mockKeyInCardCustomer.name.split(" ")
      setCustomer((current) => ({
        firstName,
        lastName: rest.join(" "),
        phone: current?.phone ?? "",
        gender: mockKeyInCardCustomer.gender,
        birthDate: mockKeyInCardCustomer.birthDate,
      }))
    }
    setIdCardNumber(cardIdNumber)
    setVerificationMethod("card")
    return cardIdNumber
  }

  // Dipchip only verifies identity; NCB เกรด stays pending until "รีเฟรช" runs the eNCB check.
  async function handleDipchipRead() {
    const cardIdNumber = applyCardRead()
    if (leadId) {
      await updateCustomerLeadCardVerified(leadId, cardIdNumber)
    }
    if (opportunityId) {
      await updateOpportunityCardVerified(opportunityId, cardIdNumber)
    }
  }

  // "ตรวจ eNCB" card read: the sidebar's NCB เกรด row then waits on "รีเฟรช" for the grade.
  async function handleNcbCardRead() {
    if (verificationMethod !== "card") await handleDipchipRead()
    setNcbAwaitingRefresh(true)
  }

  // Shared by the sidebar's "รีเฟรช" and the product cards' "ตรวจ eNCB" buttons.
  async function handleNcbChecked(nextGrade: NcbGrade) {
    setNcbGrade(nextGrade)
    setNcbAwaitingRefresh(false)
    // The eNCB check reads the ID card, which counts as a Dipchip.
    const cardIdNumber = applyCardRead()
    // customer_lead.ncb_grade is the single source of truth for the
    // customer, so it's written there regardless of opportunity state;
    // the opportunity's own copy is also kept in sync when one exists.
    if (leadId) {
      await updateCustomerLeadNcbGrade(leadId, nextGrade, cardIdNumber)
    }
    if (opportunityId) {
      await updateOpportunityNcbGrade(opportunityId, nextGrade, cardIdNumber)
    }
  }

  async function handleSelectedProductConfirmed(item: ProductCatalogItem) {
    setSelectedProduct(item)
    window.scrollTo({top: 0, behavior: "instant"})
    const nextLoanInfo: LoanInfo = {
      ...loanInfo,
      requestedAmount: loanInfo.requestedAmount ?? 0,
    }
    setLoanInfo(nextLoanInfo)

    let currentOpportunityId = opportunityId
    if (!currentOpportunityId) {
      if (!leadId) return
      const created = await createCustomerLeadOpportunity(leadId)
      currentOpportunityId = created.id
    }
    void updateOpportunitySelectedProduct(currentOpportunityId, item.id)
    void updateOpportunityLoanInfo(currentOpportunityId, nextLoanInfo)
    if (currentOpportunityId !== opportunityId) {
      router.replace(`/ratebook?opportunityId=${currentOpportunityId}`)
    }
  }

  function handleLoanPurposeChange(value: LoanPurpose) {
    setLoanPurpose(value)

    // วัตถุประสงค์ selects the LOANTYPE the ratebook is read at (จำนำทะเบียน vs
    // ดีลเลอร์), which is a different set of rows and prices, so the vehicle
    // answers cannot carry over.
    setCarInfo({})
    setShowProductGuide(false)
    commitLoanQuestionsIfComplete(
      value,
      collateralType,
      refinanceStatus,
      existingFinance,
    )
  }

  function handleCollateralTypeChange(value: CollateralType) {
    setCollateralType(value)

    setCarInfo({})
    setShowProductGuide(false)
    commitLoanQuestionsIfComplete(
      loanPurpose,
      value,
      refinanceStatus,
      existingFinance,
    )
  }

  function handleRefinanceStatusChange(value: RefinanceStatus) {
    setRefinanceStatus(value)

    const nextExistingFinance =
      value === "still-paying" ? existingFinance : null
    setExistingFinance(nextExistingFinance)
    commitLoanQuestionsIfComplete(
      loanPurpose,
      collateralType,
      value,
      nextExistingFinance,
    )
  }

  function handleExistingFinanceChange(value: string) {
    setExistingFinance(value)
    commitLoanQuestionsIfComplete(
      loanPurpose,
      collateralType,
      refinanceStatus,
      value,
    )
  }

  function handleCarInfoChange(nextCarInfo: CarInfo) {
    setCarInfo(nextCarInfo)
    setShowProductGuide(false)
  }

  const tags = [
    loanPurposeOptions.find((option) => option.value === loanPurpose)
      ?.description,
    collateralTypeOptions
      .find((option) => option.value === collateralType)
      ?.label.replace(/ /g, "-"),
    refinanceStatusOptions.find((option) => option.value === refinanceStatus)
      ?.description,

    existingFinanceOptions.find((option) => option.value === existingFinance)
      ?.label,
  ].filter((tag): tag is string => Boolean(tag))

  return (
    <div className="grid grid-cols-1 items-start gap-6 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="lg:sticky lg:top-19">
        <CustomerCollateralPanel
          initialOpportunity={initialOpportunity}
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
          ncbGrade={ncbGrade}
          idCardNumber={idCardNumber}
          verificationMethod={verificationMethod}
          onNcbChecked={handleNcbChecked}
          onDipchipRead={handleDipchipRead}
          ncbAwaitingRefresh={ncbAwaitingRefresh}
          onNcbCardRead={handleNcbCardRead}
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
              loanPurpose={loanPurpose}
              onCarInfoChange={handleCarInfoChange}
              onViewAppraisal={() => {
                setProductFilter(null)
                setShowProductGuide(true)
              }}
            />
          )}

          {showProductGuide && (
            <>
              <ProductGuide data={productGuideData} />
              <ProductCatalog
                data={productCatalogData}
                filter={
                  productFilter ??
                  getDefaultProductCatalogFilter(productCatalogData)
                }
                ncbGrade={ncbGrade}
                cardAlreadyRead={verificationMethod === "card"}
                onNcbCardRead={handleNcbCardRead}
                onSelectConfirmed={handleSelectedProductConfirmed}
              />
              <LoanCalBar
                productCatalog={productCatalogData}
                appraisalPrice={productGuideData.appraisalPrice}
                collateralType={collateralType}
                customer={customer}
                opportunityId={opportunityId}
                refinanceStatus={refinanceStatus}
                requestedAmount={loanInfo.requestedAmount ?? 0}
                onRequestedAmountChange={(amount) =>
                  setLoanInfo((current) => ({
                    ...current,
                    requestedAmount: amount,
                  }))
                }
                onLoanTermsChange={handleLoanTermsChange}
                onCustomerChange={setCustomer}
                onFilterChange={setProductFilter}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
