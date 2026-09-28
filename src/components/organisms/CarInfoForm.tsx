"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { ReadOnlyValue } from "@/components/atoms/ReadOnlyValue";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { updateOpportunityCarInfo } from "@/lib/actions/customer-lead-opportunity";
import {
  carBodyTypeOptionsByCollateralType,
  carConditionOptions,
  carEngineCcOptionsByCollateralType,
  carTransmissionOptions,
  carTypeOptionsByCollateralType,
  carYearOptions,
  getVehicleBrands,
  getVehicleCarType,
  getVehicleDoorsOptions,
  getVehicleModels,
  getVehicleModelSpec,
  getVehicleSubModels,
  toVehicleCollateralType,
} from "@/lib/mock";
import type { CarInfo, CollateralType } from "@/types/ratebook";

const PLACEHOLDER = { value: "", label: "เลือกข้อมูล" };

// The form opens one field at a time in this order: each stays on screen but disabled until every
// field before it has a value. มอเตอร์ไซค์ has no doors, so จำนวนประตู drops out of the chain.
// ประเภทรถ is not in here — the system derives it from รุ่นรถ + จำนวนประตู once the chain is done.
const FIELD_SEQUENCE: (keyof CarInfo)[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
];

const FIELD_LABELS: Record<keyof CarInfo, string> = {
  brand: "ยี่ห้อรถ",
  model: "รุ่นรถ",
  year: "รุ่นปี ค.ศ.",
  condition: "สภาพรถ",
  doors: "จำนวนประตู",
  carType: "ประเภทรถ",
  engineCc: "ขนาดเครื่องยนต์",
  transmission: "ระบบเกียร์",
  bodyType: "ประเภทตัวถัง",
  subModel: "รุ่นย่อย",
};

function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      {children}
      <Icon name="info" className="size-4 text-muted-foreground" />
    </span>
  );
}

function optionLabel(
  options: { value: string; label: string }[],
  value?: string,
): string | undefined {
  return options.find((option) => option.value === value)?.label;
}

type CarInfoFormProps = {
  opportunityId: string | null;
  carInfo: CarInfo;
  collateralType: CollateralType | null;
  onCarInfoChange: (carInfo: CarInfo) => void;
  onViewAppraisal: () => void;
};

export function CarInfoForm({
  opportunityId,
  carInfo,
  collateralType,
  onCarInfoChange,
  onViewAppraisal,
}: CarInfoFormProps) {
  const isMotorcycle = collateralType === "motorcycle";
  const sequence = isMotorcycle
    ? FIELD_SEQUENCE.filter((field) => field !== "doors")
    : FIELD_SEQUENCE;

  const vehicleCollateralType = toVehicleCollateralType(collateralType);
  const brandOptions = getVehicleBrands(collateralType);
  const modelOptions = getVehicleModels(collateralType, carInfo.brand);
  const subModelOptions = getVehicleSubModels(collateralType, carInfo.brand, carInfo.model);
  const doorsOptions = getVehicleDoorsOptions(collateralType, carInfo.brand, carInfo.model);
  const carTypeOptions = carTypeOptionsByCollateralType[vehicleCollateralType];
  const carBodyTypeOptions = carBodyTypeOptionsByCollateralType[vehicleCollateralType];
  const carEngineCcOptions = carEngineCcOptionsByCollateralType[vehicleCollateralType];

  // A รุ่น that comes in exactly one ระบบเกียร์ / ประเภทตัวถัง has nothing to ask the user, so those
  // two fields are filled in and locked instead of offered as dropdowns.
  const modelSpec = getVehicleModelSpec(collateralType, carInfo.brand, carInfo.model);
  const fixedTransmission =
    modelSpec?.transmissions.length === 1 ? modelSpec.transmissions[0] : undefined;
  const fixedBodyType =
    modelSpec?.bodyTypes.length === 1 ? modelSpec.bodyTypes[0] : undefined;

  // ยี่ห้อ/รุ่น reset the rest of the form, so that is where the auto-filled values belong: any value
  // carried over from the previous รุ่น no longer applies.
  function withAutoFilled(next: CarInfo): CarInfo {
    const spec = getVehicleModelSpec(collateralType, next.brand, next.model);
    return {
      ...next,
      transmission: spec?.transmissions.length === 1 ? spec.transmissions[0] : undefined,
      bodyType: spec?.bodyTypes.length === 1 ? spec.bodyTypes[0] : undefined,
    };
  }

  function update<K extends keyof CarInfo>(key: K, value: string) {
    let next: CarInfo;
    if (key === "brand") {
      next = withAutoFilled({ brand: value });
    } else if (key === "model") {
      next = withAutoFilled({ brand: carInfo.brand, model: value });
    } else {
      next = { ...carInfo, [key]: value };
    }
    // ประเภทรถ is system-chosen, so it is re-derived on every edit rather than ever read back from
    // an answer — it can never disagree with the รุ่น and จำนวนประตู on screen.
    onCarInfoChange({
      ...next,
      carType: getVehicleCarType(collateralType, next.brand, next.model, next.doors),
    });
  }

  // Every field before this one in the chain has an answer.
  function isUnlocked(field: keyof CarInfo) {
    return sequence
      .slice(0, sequence.indexOf(field))
      .every((earlier) => Boolean(carInfo[earlier]));
  }

  // The required chain is done: ประเภทรถ can resolve, and the optional row opens as a group so a
  // skipped optional field can never block the ones after it.
  const inputsComplete = sequence.every((field) => Boolean(carInfo[field]));
  const derivedCarType = inputsComplete
    ? getVehicleCarType(collateralType, carInfo.brand, carInfo.model, carInfo.doors)
    : undefined;
  const isComplete = inputsComplete && Boolean(derivedCarType);
  // ประเภทรถ is deliberately absent — the user has no way to fill it in.
  const missingFieldLabels = sequence
    .filter((field) => !carInfo[field])
    .map((field) => FIELD_LABELS[field]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">กรอกข้อมูลรถ</p>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Icon name="scan" className="size-4" />
          สแกนเล่มทะเบียน
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border-2 border-card-border bg-surface p-5 shadow-primary-s">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="ยี่ห้อรถ">
            <Select
              options={[PLACEHOLDER, ...brandOptions]}
              value={carInfo.brand ?? ""}
              onChange={(e) => update("brand", e.target.value)}
            />
          </FormField>
          <FormField label={<InfoLabel>รุ่นรถ</InfoLabel>}>
            <Select
              options={[PLACEHOLDER, ...modelOptions]}
              value={carInfo.model ?? ""}
              disabled={!isUnlocked("model")}
              onChange={(e) => update("model", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField label={<InfoLabel>รุ่นปี ค.ศ.</InfoLabel>}>
            <Select
              options={[PLACEHOLDER, ...carYearOptions]}
              value={carInfo.year ?? ""}
              disabled={!isUnlocked("year")}
              onChange={(e) => update("year", e.target.value)}
            />
          </FormField>
          <FormField label="สภาพรถ">
            <Select
              options={[PLACEHOLDER, ...carConditionOptions]}
              value={carInfo.condition ?? ""}
              disabled={!isUnlocked("condition")}
              onChange={(e) => update("condition", e.target.value)}
            />
          </FormField>
          <FormField label="จำนวนประตู">
            <Select
              options={[PLACEHOLDER, ...doorsOptions]}
              value={carInfo.doors ?? ""}
              disabled={isMotorcycle || !isUnlocked("doors")}
              onChange={(e) => update("doors", e.target.value)}
            />
          </FormField>
          <FormField label="ประเภทรถ (ระบบเลือกให้)">
            <ReadOnlyValue value={optionLabel(carTypeOptions, derivedCarType)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField label="ขนาดเครื่องยนต์ (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...carEngineCcOptions]}
              value={carInfo.engineCc ?? ""}
              disabled={!inputsComplete}
              onChange={(e) => update("engineCc", e.target.value)}
            />
          </FormField>
          <FormField label="ระบบเกียร์ (ไม่บังคับ)">
            {fixedTransmission ? (
              <ReadOnlyValue
                value={optionLabel(carTransmissionOptions, fixedTransmission)}
              />
            ) : (
              <Select
                options={[PLACEHOLDER, ...carTransmissionOptions]}
                value={carInfo.transmission ?? ""}
                disabled={!inputsComplete}
                onChange={(e) => update("transmission", e.target.value)}
              />
            )}
          </FormField>
          <FormField label="ประเภทตัวถัง (ไม่บังคับ)">
            {fixedBodyType ? (
              <ReadOnlyValue value={optionLabel(carBodyTypeOptions, fixedBodyType)} />
            ) : (
              <Select
                options={[PLACEHOLDER, ...carBodyTypeOptions]}
                value={carInfo.bodyType ?? ""}
                disabled={!inputsComplete}
                onChange={(e) => update("bodyType", e.target.value)}
              />
            )}
          </FormField>
          <FormField label="รุ่นย่อย (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...subModelOptions]}
              value={carInfo.subModel ?? ""}
              disabled={!inputsComplete}
              onChange={(e) => update("subModel", e.target.value)}
            />
          </FormField>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-center justify-end gap-3">
          {!isComplete && missingFieldLabels.length > 0 && (
            <p className="text-xs text-muted-foreground">
              กรุณากรอก: {missingFieldLabels.join(", ")}
            </p>
          )}
          <Button
            variant="primary"
            disabled={!isComplete}
            onClick={() => {
              if (opportunityId) void updateOpportunityCarInfo(opportunityId, carInfo);
              onViewAppraisal();
            }}
          >
            ดูราคาประเมิน
          </Button>
        </div>
      </div>
    </div>
  );
}
