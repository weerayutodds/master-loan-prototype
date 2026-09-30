"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {ReadOnlyValue} from "@/components/atoms/ReadOnlyValue"
import {Select} from "@/components/atoms/Select"
import {FormField} from "@/components/molecules/FormField"
import {CarModelInfoModal} from "@/components/organisms/CarModelInfoModal"
import {CarYearInfoModal} from "@/components/organisms/CarYearInfoModal"
import {ErrorModal} from "@/components/organisms/ErrorModal" // Adjust import path if needed
import {updateOpportunityCarInfo} from "@/lib/actions/customer-lead-opportunity"
import {
  carTypeOptionsByCollateralType,
  toVehicleCollateralType,
} from "@/lib/mock"
import {
  clearAfter,
  useVehicleOptions,
  type VehicleFieldKey,
} from "@/lib/vehicle-options"
import type {CarInfo, CollateralType, LoanPurpose} from "@/types/ratebook"
import {useState} from "react"

const PLACEHOLDER = {value: "", label: "เลือกข้อมูล"}

const FIELD_LABELS: Record<VehicleFieldKey, string> = {
  brand: "ยี่ห้อรถ",
  model: "รุ่นรถ",
  year: "รุ่นปี ค.ศ.",
  condition: "สภาพรถ",
  doors: "จำนวนประตู",
  engineCc: "ขนาดเครื่องยนต์",
  transmission: "ระบบเกียร์",
  bodyType: "ประเภทตัวถัง",
  ratebookCode: "รุ่นย่อย",
}

function InfoLabel({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <span className="flex items-center gap-1">
      {children}
      {onClick ? (
        <button type="button" onClick={onClick} aria-label="ข้อมูลเพิ่มเติม">
          <Icon name="info" className="size-4 text-muted-foreground" />
        </button>
      ) : (
        <Icon name="info" className="size-4 text-muted-foreground" />
      )}
    </span>
  )
}

type CarInfoFormProps = {
  opportunityId: string | null
  carInfo: CarInfo
  collateralType: CollateralType | null
  /** Picks the LOANTYPE the ratebook is read at: อยากได้เงิน = จำนำทะเบียน, อยากซื้อรถ = ดีลเลอร์. */
  loanPurpose: LoanPurpose | null
  onCarInfoChange: (carInfo: CarInfo) => void
  onViewAppraisal: () => void
}

export function CarInfoForm({
  opportunityId,
  carInfo,
  collateralType,
  loanPurpose,
  onCarInfoChange,
  onViewAppraisal,
}: CarInfoFormProps) {
  const isMotorcycle = collateralType === "motorcycle"
  const [yearInfoOpen, setYearInfoOpen] = useState(false)
  const [modelInfoOpen, setModelInfoOpen] = useState(false)
  const [scanErrorOpen, setScanErrorOpen] = useState(false)

  const vehicle = useVehicleOptions(collateralType, carInfo, loanPurpose)
  const carTypeOptions =
    carTypeOptionsByCollateralType[toVehicleCollateralType(collateralType)]

  // Locked fields are answers the vehicle only has one of, so they count as filled.
  function valueOf(field: VehicleFieldKey): string {
    return carInfo[field] ?? vehicle.locked[field] ?? ""
  }

  function update(field: VehicleFieldKey, value: string) {
    // Later answers were narrowed by this one, so they cannot survive the change.
    const next = clearAfter(
      vehicle.resetOrder,
      {...carInfo, [field]: value},
      field,
    )
    onCarInfoChange(vehicle.resolve(next))
  }

  // Open one field at a time: everything before it that the form actually asks
  // for has an answer. Fields outside `sequence` (ขนาดเครื่องยนต์ on รถบรรทุก)
  // do not gate the ones after them.
  //
  // ขนาดเครื่องยนต์/ระบบเกียร์/ประเภทตัวถัง/รุ่นย่อย open together as soon as
  // ประเภทรถ is known (i.e. จำนวนประตู is answered) rather than one at a time.
  const CAR_GROUP_FIELDS: VehicleFieldKey[] = [
    "engineCc",
    "transmission",
    "bodyType",
    "ratebookCode",
  ];

  function isUnlocked(field: VehicleFieldKey) {
    const gateField =
      !isMotorcycle && CAR_GROUP_FIELDS.includes(field) ? "doors" : field;
    return vehicle.resetOrder
      .slice(0, vehicle.resetOrder.indexOf(gateField) + (gateField === field ? 0 : 1))
      .filter((earlier) => vehicle.sequence.includes(earlier))
      .every((earlier) => Boolean(valueOf(earlier)))
  }

  function selectProps(field: VehicleFieldKey) {
    return {
      options: [PLACEHOLDER, ...vehicle.options[field]],
      value: valueOf(field),
      disabled: !isUnlocked(field) || vehicle.isLoading,
      onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
        update(field, event.target.value),
    }
  }

  function lockedLabel(field: VehicleFieldKey): string | undefined {
    const value = vehicle.locked[field]
    if (!value) return undefined
    return vehicle.options[field].find((option) => option.value === value)
      ?.label
  }

  // The vehicle only has one answer for this field -- show it filled in
  // instead of making the user pick the only option.
  function fieldControl(field: VehicleFieldKey) {
    return vehicle.locked[field] ? (
      <ReadOnlyValue value={lockedLabel(field)} />
    ) : (
      <Select {...selectProps(field)} />
    );
  }

  const missingFields = vehicle.sequence.filter((field) => !valueOf(field));
  const isComplete =
    missingFields.length === 0 && carInfo.appraisalPrice != null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">กรอกข้อมูลรถ</p>
        {!isMotorcycle && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setScanErrorOpen(true)}
          >
            <Icon name="camera-scan" className="size-4" />
            สแกนเล่มทะเบียน
          </Button>
        )}
      </div>

      <div className="space-y-4 rounded-xl border-2 border-card-border bg-surface p-5 shadow-primary-s">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={FIELD_LABELS.brand}>
            <Select {...selectProps("brand")} disabled={false} />
          </FormField>
          <FormField
            label={
              <InfoLabel onClick={() => setModelInfoOpen(true)}>
                {FIELD_LABELS.model}
              </InfoLabel>
            }
          >
            {fieldControl("model")}
          </FormField>
        </div>

        {isMotorcycle ? (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={
                <InfoLabel onClick={() => setYearInfoOpen(true)}>
                  {FIELD_LABELS.year}
                </InfoLabel>
              }
            >
              {fieldControl("year")}
            </FormField>
            <FormField label={FIELD_LABELS.ratebookCode}>
              {fieldControl("ratebookCode")}
            </FormField>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <FormField
                label={
                  <InfoLabel onClick={() => setYearInfoOpen(true)}>
                    {FIELD_LABELS.year}
                  </InfoLabel>
                }
              >
                {fieldControl("year")}
              </FormField>
              <FormField label={FIELD_LABELS.condition}>
                {fieldControl("condition")}
              </FormField>
              <FormField label={FIELD_LABELS.doors}>
                {fieldControl("doors")}
              </FormField>
              <FormField label="ประเภทรถ">
                <ReadOnlyValue
                  value={
                    carTypeOptions.find(
                      (option) => option.value === carInfo.carType,
                    )?.label
                  }
                  borderless
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <FormField
                label={
                  vehicle.options.engineCc.length > 0
                    ? `${FIELD_LABELS.engineCc} (ไม่บังคับ)`
                    : FIELD_LABELS.engineCc
                }
              >
                {vehicle.options.engineCc.length > 0 ? (
                  <Select {...selectProps("engineCc")} />
                ) : (
                  // Read off the chosen ratebook row -- the รุ่นย่อย already names it.
                  <ReadOnlyValue
                    value={
                      carInfo.engineCc ? `${carInfo.engineCc} ซีซี` : undefined
                    }
                  />
                )}
              </FormField>
              <FormField label={FIELD_LABELS.transmission}>
                {fieldControl("transmission")}
              </FormField>
              <FormField label={FIELD_LABELS.bodyType}>
                {fieldControl("bodyType")}
              </FormField>
              <FormField label={FIELD_LABELS.ratebookCode}>
                {fieldControl("ratebookCode")}
              </FormField>
            </div>
          </>
        )}

        <div className="border-t border-border" />

        <div className="flex items-center justify-end gap-3">
          {!isComplete && missingFields.length > 0 && (
            <p className="text-xs text-muted-foreground">
              กรุณากรอก:{" "}
              {missingFields.map((field) => FIELD_LABELS[field]).join(", ")}
            </p>
          )}
          <Button
            variant="primary"
            disabled={!isComplete}
            onClick={() => {
              if (opportunityId)
                void updateOpportunityCarInfo(opportunityId, carInfo)
              onViewAppraisal()
            }}
          >
            ดูราคาประเมิน
          </Button>
        </div>
      </div>

      <CarYearInfoModal
        open={yearInfoOpen}
        onClose={() => setYearInfoOpen(false)}
      />
      <CarModelInfoModal
        open={modelInfoOpen}
        onClose={() => setModelInfoOpen(false)}
      />

      <ErrorModal
        open={scanErrorOpen}
        onClose={() => setScanErrorOpen(false)}
        title="ระบบกำลังพัฒนา"
        description="ฟังก์ชันสแกนเล่มทะเบียนกำลังอยู่ในช่วงการพัฒนา"
        buttonText="ตกลง"
      />
    </div>
  )
}
