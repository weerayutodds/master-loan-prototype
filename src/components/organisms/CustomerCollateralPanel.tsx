"use client"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { Icon } from "@/components/atoms/Icon"
import { ProgressRing } from "@/components/atoms/ProgressRing"
import { Card } from "@/components/molecules/Card"
import { LeadProgressTooltip } from "@/components/molecules/LeadProgressTooltip"
import { Toast } from "@/components/molecules/Toast"
import { CollateralDetailModal } from "@/components/organisms/CollateralDetailModal"
import { CustomerInfoModal } from "@/components/organisms/CustomerInfoModal"
import {
  updateOpportunityCarInfo,
  updateOpportunityCarInsurance,
  updateOpportunityCollateralDetail,
  updateOpportunityCustomerInfo,
  updateOpportunityLoanInfo,
} from "@/lib/actions/customer-lead-opportunity"
import { maskIdCardNumber } from "@/lib/format"
import { carBrandOptions, carModelOptions, provinceOptions } from "@/lib/mock"
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity"
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralIdentifier,
  CollateralType,
  CustomerInfo,
  LoanInfo,
} from "@/types/ratebook"
import { useRouter } from "next/navigation"
import { useState } from "react"

const TOTAL_SECTIONS = 4

type CustomerCollateralPanelProps = {
  initialOpportunity?: CustomerLeadOpportunity | null
  opportunityId: string | null
  tags: string[]
  carInfo: CarInfo
  collateralType: CollateralType | null
  showCarInfo: boolean
  setShowCarInfo: (value: boolean) => void
  hasSelectedProduct?: boolean
  loanInfo?: LoanInfo
  carInsuranceInfo?: CarInsuranceInfo
}

function formatCollateralIdentifier(identifier: CollateralIdentifier): string {
  if (identifier.licensePlateNumber && identifier.licensePlateProvince) {
    const province = provinceOptions.find(
      (option) => option.value === identifier.licensePlateProvince,
    )
    return `${identifier.licensePlateNumber} · ${province?.label ?? ""}`
  }
  return identifier.chassisNumber ?? ""
}

function formatBrandModelYear(
  carInfo: CarInfo,
  opportunity: CustomerLeadOpportunity | null,
): string {
  const brandValue = carInfo.brand ?? opportunity?.carBrand ?? undefined
  const modelValue = carInfo.model ?? opportunity?.carModel ?? undefined
  const yearValue = carInfo.year ?? opportunity?.carYear ?? undefined

  const brandLabel = carBrandOptions.find(
    (option) => option.value === brandValue,
  )?.label
  const modelLabel = carModelOptions.find(
    (option) => option.value === modelValue,
  )?.label
  const parts = [brandLabel?.toUpperCase(), modelLabel?.toUpperCase()].filter(
    (part): part is string => Boolean(part),
  )
  if (yearValue) {
    const buddhistYear = Number(yearValue) + 543
    parts.push(`${yearValue} (${buddhistYear})`)
  }
  return parts.join(" • ")
}

export function CustomerCollateralPanel({
  initialOpportunity = null,
  opportunityId,
  tags,
  carInfo,
  collateralType,
  showCarInfo,
  setShowCarInfo,
  hasSelectedProduct = false,
  loanInfo,
  carInsuranceInfo,
}: CustomerCollateralPanelProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerInfo | null>(
    initialOpportunity
      ? {
          firstName: initialOpportunity.firstName,
          lastName: initialOpportunity.lastName,
          phone: initialOpportunity.phone,
        }
      : null,
  )
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
  const [brandModel, setBrandModel] = useState(
    initialOpportunity?.brandModel ?? "",
  )
  const [editingBrandModel, setEditingBrandModel] = useState(false)
  const [savedToastOpen, setSavedToastOpen] = useState(false)

  const idCardNumber = initialOpportunity?.idCardNumber ?? ""

  async function handleSaveLead() {
    if (!opportunityId) return
    try {
      await Promise.all([
        customer
          ? updateOpportunityCustomerInfo(opportunityId, customer)
          : null,
        updateOpportunityCollateralDetail(opportunityId, {
          collateralIdentifier,
          brandModel,
        }),
        updateOpportunityCarInfo(opportunityId, carInfo),
        loanInfo ? updateOpportunityLoanInfo(opportunityId, loanInfo) : null,
        carInsuranceInfo
          ? updateOpportunityCarInsurance(opportunityId, carInsuranceInfo)
          : null,
      ])
      setSavedToastOpen(true)
    } catch (error) {
      console.error("Failed to save lead", error)
    }
  }

  const brandModelDisplay = formatBrandModelYear(carInfo, initialOpportunity)

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
    <Card className="space-y-4 border-2">
      {customer ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-start justify-between text-left"
        >
          <div>
            <p className="text-base font-medium text-foreground">
              {customer.firstName} {customer.lastName}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon name="phone" className="size-4" />
              {customer.phone}
              <span>| 36 ปี</span>
              <Icon name="info" className="size-4 text-primary-to" />
            </div>
          </div>
          <div className="group/progress relative shrink-0">
            <ProgressRing value={filledSectionCount} total={TOTAL_SECTIONS} />
            <LeadProgressTooltip
              filledCount={filledSectionCount}
              total={TOTAL_SECTIONS}
              items={progressItems}
            />
          </div>
        </button>
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
          {initialOpportunity?.verificationMethod !== "card" ? (
            <Button
              variant="outline"
              size="xs"
              onClick={() => router.push("/customer-form")}
            >
              Dipchip
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">NCB เกรด</span>
        {initialOpportunity?.ncbGrade ? (
          <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
            เกรด {initialOpportunity.ncbGrade}
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="xs"
            onClick={() => router.push("/customer-form")}
          >
            ตรวจ eNCB
          </Button>
        )}
      </div>

      <div className="border-t border-dashed border-secondary-border" />

      <div className="flex items-center justify-between h-6">
        <span className="text-sm text-foreground">ข้อมูลหลักประกัน</span>
        {showCarInfo ? (
          <Button
            variant="outline"
            size="xs"
            onClick={() => setShowCarInfo(false)}
          >
            เพิ่ม/แก้ไข
          </Button>
        ) : null}
      </div>

      {collateralType && collateralType !== "land" ? (
        <>
          <div
            className={`flex rounded-lg bg-surface-muted min-h-11 px-3 py-2.5 ${
              collateralIdentifier
                ? "flex-col items-start gap-1"
                : "items-center justify-between"
            }`}
          >
            <div className="flex flex-row justify-between w-full">
              <span className="text-sm text-muted-foreground">
                เลขทะเบียน / เลขตัวถัง
              </span>
              <button
                type="button"
                onClick={() => setCollateralModalOpen(true)}
                className="flex items-center gap-1 text-xs font-semibold text-primary-to"
              >
                <Icon name="edit" className="size-3" />
                {collateralIdentifier ? "แก้ไข" : "เพิ่ม"}
              </button>
            </div>
            {collateralIdentifier && (
              <span className="text-sm font-medium text-foreground text-left">
                {formatCollateralIdentifier(collateralIdentifier)}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start gap-1 rounded-lg bg-surface-muted min-h-11 px-3 py-2.5">
            <div className="flex flex-row justify-between w-full">
              <span className="text-sm text-muted-foreground">
                ยี่ห้อ / รุ่น
              </span>
              {!showCarInfo && (
                <button
                  type="button"
                  onClick={() => setShowCarInfo(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary-to"
                >
                  <Icon name="edit" className="size-3" />
                  {brandModelDisplay ? "แก้ไข" : "เพิ่ม"}
                </button>
              )}
            </div>
            <span className="text-sm font-medium text-foreground text-left">
              {brandModelDisplay}
            </span>
          </div>
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
          <Button variant="primary" className="flex-1">
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
        open={savedToastOpen}
        message="บันทึก Lead เรียบร้อยแล้ว"
        onClose={() => setSavedToastOpen(false)}
      />

      <CustomerInfoModal
        open={modalOpen}
        initialValue={customer ?? undefined}
        onClose={() => setModalOpen(false)}
        onSave={(info) => {
          setCustomer(info)
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
    </Card>
  )
}
