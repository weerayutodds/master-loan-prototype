"use client"

import {Badge} from "@/components/atoms/Badge"
import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {Card} from "@/components/molecules/Card"
import {LoadingToast} from "@/components/molecules/LoadingToast"
import {Toast} from "@/components/molecules/Toast"
import {CollateralDetailModal} from "@/components/organisms/CollateralDetailModal"
import {CustomerInfoModal} from "@/components/organisms/CustomerInfoModal"
import {ErrorModal} from "@/components/organisms/ErrorModal"
import {NcbCheckControl} from "@/components/organisms/NcbCheckControl"
import {NcbCheckModal} from "@/components/organisms/NcbCheckModal"
import {PhoneNumberModal} from "@/components/organisms/PhoneNumberModal"
import {
  createCustomerLeadOpportunity,
  updateOpportunityCarInfo,
  updateOpportunityCarInsurance,
  updateOpportunityCollateralDetail,
  updateOpportunityCustomerInfo,
  updateOpportunityLoanInfo,
  updateOpportunityLoanQuestions,
  updateOpportunitySelectedProduct,
} from "@/lib/actions/customer-lead-opportunity"
import {calculateAge, maskIdCardNumber} from "@/lib/format"
import {provinceOptions} from "@/lib/mock"
import type {VerificationMethod} from "@/types/customer-form"
import type {NcbGrade} from "@/types/customer-lead"
import type {CustomerLeadOpportunity} from "@/types/customer-lead-opportunity"
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralIdentifier,
  CollateralType,
  CustomerInfo,
  LoanInfo,
  LoanPurpose,
  RefinanceStatus,
} from "@/types/ratebook"
import {useRouter} from "next/navigation"
import {setTimeout} from "node:timers"
import {useState} from "react"
import {ProgressRing} from "../atoms/ProgressRing"
import {LeadProgressTooltip} from "../molecules/LeadProgressTooltip"

const TOTAL_SECTIONS = 4

type CustomerCollateralPanelProps = {
  initialOpportunity?: CustomerLeadOpportunity | null
  opportunityId: string | null
  leadId: string | null
  tags: string[]
  carInfo: CarInfo
  collateralType: CollateralType | null
  loanPurpose: LoanPurpose | null
  refinanceStatus: RefinanceStatus | null
  existingFinance: string | null
  selectedProductId: string | null
  hasSelectedProduct?: boolean
  loanInfo?: LoanInfo
  carInsuranceInfo?: CarInsuranceInfo
  customer: CustomerInfo | null
  onCustomerChange: (value: CustomerInfo) => void
  ncbGrade: NcbGrade | null
  idCardNumber: string
  verificationMethod: VerificationMethod | null
  onNcbChecked: (value: NcbGrade) => unknown
  onDipchipRead: () => unknown
}

function formatCollateralIdentifier(identifier: CollateralIdentifier): string {
  const province = provinceOptions.find(
    (option) => option.value === identifier.licensePlateProvince,
  )
  const licensePlate =
    identifier.licensePlateNumber && province
      ? `${identifier.licensePlateNumber} ${province.label}`
      : undefined
  return [licensePlate, identifier.chassisNumber].filter(Boolean).join(" · ")
}

function formatBrandModelYear(
  carInfo: CarInfo,
  opportunity: CustomerLeadOpportunity | null,
): string {
  const brandValue = carInfo.brand ?? opportunity?.carBrand ?? undefined
  const modelValue = carInfo.model ?? opportunity?.carModel ?? undefined
  const yearValue = carInfo.year ?? opportunity?.carYear ?? undefined

  const parts = [brandValue, modelValue]
    .filter((part): part is string => Boolean(part))
    .map((part) => part.toUpperCase())
  if (yearValue) {
    const buddhistYear = Number(yearValue) + 543
    parts.push(`${yearValue} (${buddhistYear})`)
  }
  return parts.join(" • ")
}

export function CustomerCollateralPanel({
  initialOpportunity = null,
  opportunityId,
  leadId,
  tags,
  carInfo,
  collateralType,
  loanPurpose,
  refinanceStatus,
  existingFinance,
  selectedProductId,
  hasSelectedProduct = false,
  loanInfo,
  carInsuranceInfo,
  customer,
  onCustomerChange,
  ncbGrade,
  idCardNumber,
  verificationMethod,
  onNcbChecked,
  onDipchipRead,
}: CustomerCollateralPanelProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [collateralIdentifier, setCollateralIdentifier] =
    useState<CollateralIdentifier | null>(
      initialOpportunity &&
        (initialOpportunity.licensePlateNumber ||
          initialOpportunity.chassisNumber)
        ? {
            licensePlateNumber:
              initialOpportunity.licensePlateNumber ?? undefined,
            licensePlateProvince:
              initialOpportunity.licensePlateProvince ?? undefined,
            chassisNumber: initialOpportunity.chassisNumber ?? undefined,
          }
        : null,
    )
  const [collateralModalOpen, setCollateralModalOpen] = useState(false)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false)
  const [dipchipChecking, setDipchipChecking] = useState(false)
  const [brandModel, setBrandModel] = useState(
    initialOpportunity?.brandModel ?? "",
  )
  const [savedToastOpen, setSavedToastOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [createApplicationErrorOpen, setCreateApplicationErrorOpen] = useState(false)

  async function handleSaveLead() {
    if (!customer) return
    try {
      setIsSaving(true)

      let currentOpportunityId = opportunityId
      if (!currentOpportunityId) {
        if (!leadId) return
        const created = await createCustomerLeadOpportunity(leadId)
        currentOpportunityId = created.id
      }

      const financeAnswered =
        refinanceStatus === "still-paying" ? Boolean(existingFinance) : true
      const loanQuestionsAnswered =
        loanPurpose && collateralType && refinanceStatus && financeAnswered

      await Promise.all([
        updateOpportunityCustomerInfo(currentOpportunityId, customer),
        updateOpportunityCollateralDetail(currentOpportunityId, {
          collateralIdentifier,
          brandModel,
        }),
        updateOpportunityCarInfo(currentOpportunityId, carInfo),
        loanInfo
          ? updateOpportunityLoanInfo(currentOpportunityId, loanInfo)
          : null,
        carInsuranceInfo
          ? updateOpportunityCarInsurance(
              currentOpportunityId,
              carInsuranceInfo,
            )
          : null,

        loanQuestionsAnswered
          ? updateOpportunityLoanQuestions(currentOpportunityId, {
              loanPurpose,
              collateralType,
              refinanceStatus,
              existingFinanceCompany:
                refinanceStatus === "still-paying" ? existingFinance : null,
            })
          : null,
        selectedProductId
          ? updateOpportunitySelectedProduct(
              currentOpportunityId,
              selectedProductId,
            )
          : null,
      ])

      if (currentOpportunityId !== opportunityId) {
        router.replace(`/ratebook?opportunityId=${currentOpportunityId}`)
      }
      setTimeout(() => {
        setSavedToastOpen(true)
      }, 100)
    } catch (error) {
      console.error("Failed to save lead", error)
    } finally {
      setIsSaving(false)
    }
  }

  const brandModelDisplay = formatBrandModelYear(carInfo, initialOpportunity)
  const filledSections = [
    Boolean(customer?.firstName && customer?.lastName),
    Boolean(customer?.phone),
    collateralIdentifier !== null,
    brandModelDisplay !== "",
  ]
  // const filledSectionCount = filledSections.filter(Boolean).length

  const progressItems = [
    {
      label: "ชื่อ นามสกุล",
      filled: Boolean(customer?.firstName && customer?.lastName),
    },
    {label: "เบอร์มือถือ", filled: Boolean(customer?.phone)},
    {label: "เลขทะเบียน / เลขตัวถัง", filled: collateralIdentifier !== null},
    {label: "ยี่ห้อ / รุ่น", filled: brandModelDisplay !== ""},
  ]
  const filledSectionCount = progressItems.filter((item) => item.filled).length

  return (
    <Card className="relative z-50 space-y-4 border-2">
      {customer ? (
        <div className="flex w-full items-start justify-between">
          <div className="text-left">
            <button type="button" onClick={() => setModalOpen(true)}>
              <p className="text-base font-medium text-foreground">
                {customer.firstName} {customer.lastName}
              </p>
            </button>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon name="phone" className="size-4" />
              {customer.phone ? (
                <span>{customer.phone}</span>
              ) : (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPhoneModalOpen(true)}
                >
                  เพิ่มเบอร์มือถือ
                </Button>
              )}
              {customer.birthDate ? (
                <span>{`| ${calculateAge(customer.birthDate)} ปี`}</span>
              ) : null}
            </div>
          </div>
          <div className="group/progress relative">
            <ProgressRing value={filledSectionCount} total={TOTAL_SECTIONS} />
            <LeadProgressTooltip
              filledCount={filledSectionCount}
              total={TOTAL_SECTIONS}
              items={progressItems}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">ข้อมูลลูกค้า</span>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setModalOpen(true)}
          >
            เพิ่ม/แก้ไข
          </Button>
        </div>
      )}

      <div className="border-t border-dashed border-secondary-border" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">เลขบัตรประชาชน</span>
        <div className="flex items-center gap-2">
          {idCardNumber ? (
            <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
              {maskIdCardNumber(idCardNumber)}
            </Badge>
          ) : null}
          {verificationMethod !== "card" ? (
            <Button
              variant="outline"
              size="xs"
              onClick={() => setDipchipChecking(true)}
            >
              Dipchip
            </Button>
          ) : null}
          <NcbCheckModal
            open={dipchipChecking}
            onComplete={async () => {
              await onDipchipRead()
              setDipchipChecking(false)
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">NCB เกรด</span>
        <NcbCheckControl
          ncbGrade={ncbGrade}
          onChecked={onNcbChecked}
          customerName={
            customer ? `${customer.firstName} ${customer.lastName}` : ""
          }
          idCardNumber={idCardNumber}
        />
      </div>

      <div className="border-t border-dashed border-secondary-border" />

      <div className="flex items-center justify-between h-6">
        <span className="text-sm text-foreground">ข้อมูลหลักประกัน</span>
      </div>

      {collateralType !== "land" ? (
        <>
          <div
            className={`flex rounded-lg bg-surface-muted min-h-11 px-3 py-2.5 ${
              collateralType && collateralIdentifier
                ? "flex-col items-start gap-1"
                : "items-center justify-between"
            }`}
          >
            {collateralType ? (
              <>
                <div className="flex flex-row justify-between w-full">
                  <span className="text-sm text-muted-foreground">
                    เลขทะเบียน / เลขตัวถัง
                  </span>
                  {collateralIdentifier ? (
                    <button
                      type="button"
                      onClick={() => setCollateralModalOpen(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary-to"
                    >
                      <Icon name="edit" className="size-3" />
                      แก้ไข
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      size="xs"
                      className="min-w-14"
                      onClick={() => setCollateralModalOpen(true)}
                    >
                      เพิ่ม
                    </Button>
                  )}
                </div>
                {collateralIdentifier && (
                  <span className="text-sm font-medium text-foreground text-left">
                    {formatCollateralIdentifier(collateralIdentifier)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                กรุณาเลือกประเภทหลักประกัน
              </span>
            )}
          </div>
          {collateralType && (
            <div className="flex flex-col items-start gap-1 rounded-lg bg-surface-muted min-h-11 px-3 py-2.5">
              {brandModelDisplay ? (
                <>
                  <div className="flex flex-row justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      ยี่ห้อ / รุ่น
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground text-left">
                    {brandModelDisplay}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  กรุณาเลือกยี่ห้อ / รุ่น
                </span>
              )}
            </div>
          )}
        </>
      ) : null}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-catalog-card-bg px-2 py-0.5 text-[10px] font-semibold text-primary-to"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="border-t border-secondary-border" />

      {hasSelectedProduct ? (
        <div className="flex w-full gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={!customer}
            onClick={handleSaveLead}
          >
            บันทึก Lead
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => setCreateApplicationErrorOpen(true)}
          >
            สร้างใบคำขอ
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          className="w-full"
          disabled={!customer}
          onClick={handleSaveLead}
        >
          บันทึก Lead
        </Button>
      )}

      <Toast
        open={savedToastOpen && !isSaving}
        message="บันทึก Lead เรียบร้อยแล้ว"
        onClose={() => setSavedToastOpen(false)}
      />

      <CustomerInfoModal
        open={modalOpen}
        initialValue={customer ?? undefined}
        onClose={() => setModalOpen(false)}
        onSave={(info) => {
          onCustomerChange({...customer, ...info})
          setModalOpen(false)
        }}
      />

      <CollateralDetailModal
        open={collateralModalOpen}
        initialValue={collateralIdentifier ?? undefined}
        onClose={() => setCollateralModalOpen(false)}
        onSave={(value) => {
          setCollateralIdentifier(value)
          setCollateralModalOpen(false)
        }}
      />

      <PhoneNumberModal
        open={phoneModalOpen}
        initialValue={customer?.phone}
        onClose={() => setPhoneModalOpen(false)}
        onSave={(phone) => {
          if (customer) onCustomerChange({...customer, phone})
          setPhoneModalOpen(false)
        }}
      />

      <LoadingToast
        open={isSaving}
        title="กำลังบันทึกข้อมูล"
        description="กรุณารอสักครู่..."
      />

      <ErrorModal
        open={createApplicationErrorOpen}
        onClose={() => setCreateApplicationErrorOpen(false)}
        title="ระบบกำลังพัฒนา"
        description={`ฟังก์ชัน "สร้างใบคำขอ" กำลังอยู่ในช่วงการพัฒนา`}
        buttonText="ตกลง"
      />
    </Card>
  )
}
