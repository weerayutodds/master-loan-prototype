"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Select } from "@/components/atoms/Select";
import { FormField } from "@/components/molecules/FormField";
import { updateOpportunityCarInfo } from "@/lib/actions/customer-lead-opportunity";
import {
  carBodyTypeOptionsByCollateralType,
  carConditionOptions,
  carDoorsOptions,
  carEngineCcOptionsByCollateralType,
  carTransmissionOptions,
  carTypeOptionsByCollateralType,
  carYearOptions,
  getVehicleBrands,
  getVehicleModels,
  getVehicleSubModels,
  toVehicleCollateralType,
} from "@/lib/mock";
import type { CarInfo, CollateralType } from "@/types/ratebook";

const PLACEHOLDER = { value: "", label: "เลือกข้อมูล" };

// engineCc, transmission, bodyType, and subModel are optional; only the first two rows are required.
const REQUIRED_FIELDS: (keyof CarInfo)[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
  "carType",
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
  function update<K extends keyof CarInfo>(key: K, value: string) {
    if (key === "brand") {
      onCarInfoChange({ brand: value });
      return;
    }
    if (key === "model") {
      onCarInfoChange({ brand: carInfo.brand, model: value });
      return;
    }
    onCarInfoChange({ ...carInfo, [key]: value });
  }

  const isMotorcycle = collateralType === "motorcycle";
  const requiredFields = isMotorcycle
    ? REQUIRED_FIELDS.filter((field) => field !== "doors")
    : REQUIRED_FIELDS;
  const isComplete = requiredFields.every((field) => Boolean(carInfo[field]));
  const missingFieldLabels = requiredFields
    .filter((field) => !carInfo[field])
    .map((field) => FIELD_LABELS[field]);

  const vehicleCollateralType = toVehicleCollateralType(collateralType);
  const brandOptions = getVehicleBrands(collateralType);
  const modelOptions = getVehicleModels(collateralType, carInfo.brand);
  const subModelOptions = getVehicleSubModels(collateralType, carInfo.brand, carInfo.model);
  const carTypeOptions = carTypeOptionsByCollateralType[vehicleCollateralType];
  const carBodyTypeOptions = carBodyTypeOptionsByCollateralType[vehicleCollateralType];
  const carEngineCcOptions = carEngineCcOptionsByCollateralType[vehicleCollateralType];

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
              disabled={!carInfo.brand}
              onChange={(e) => update("model", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField label={<InfoLabel>รุ่นปี ค.ศ.</InfoLabel>}>
            <Select
              options={[PLACEHOLDER, ...carYearOptions]}
              value={carInfo.year ?? ""}
              onChange={(e) => update("year", e.target.value)}
            />
          </FormField>
          <FormField label="สภาพรถ">
            <Select
              options={[PLACEHOLDER, ...carConditionOptions]}
              value={carInfo.condition ?? ""}
              onChange={(e) => update("condition", e.target.value)}
            />
          </FormField>
          <FormField label="จำนวนประตู">
            <Select
              options={[PLACEHOLDER, ...carDoorsOptions]}
              value={carInfo.doors ?? ""}
              disabled={isMotorcycle}
              onChange={(e) => update("doors", e.target.value)}
            />
          </FormField>
          <FormField label="ประเภทรถ">
            <Select
              options={[PLACEHOLDER, ...carTypeOptions]}
              value={carInfo.carType ?? ""}
              onChange={(e) => update("carType", e.target.value)}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField label="ขนาดเครื่องยนต์ (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...carEngineCcOptions]}
              value={carInfo.engineCc ?? ""}
              onChange={(e) => update("engineCc", e.target.value)}
            />
          </FormField>
          <FormField label="ระบบเกียร์ (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...carTransmissionOptions]}
              value={carInfo.transmission ?? ""}
              onChange={(e) => update("transmission", e.target.value)}
            />
          </FormField>
          <FormField label="ประเภทตัวถัง (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...carBodyTypeOptions]}
              value={carInfo.bodyType ?? ""}
              onChange={(e) => update("bodyType", e.target.value)}
            />
          </FormField>
          <FormField label="รุ่นย่อย (ไม่บังคับ)">
            <Select
              options={[PLACEHOLDER, ...subModelOptions]}
              value={carInfo.subModel ?? ""}
              disabled={!carInfo.model}
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
