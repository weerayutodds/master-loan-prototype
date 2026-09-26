"use client";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Select } from "@/components/atoms/Select";
import { Card } from "@/components/molecules/Card";
import { FormField } from "@/components/molecules/FormField";
import { updateOpportunityCarInfo } from "@/lib/actions/customer-lead-opportunity";
import {
  carBodyTypeOptions,
  carBrandOptions,
  carConditionOptions,
  carDoorsOptions,
  carEngineCcOptions,
  carModelOptions,
  carSubModelOptions,
  carTransmissionOptions,
  carTypeOptions,
  carYearOptions,
} from "@/lib/mock";
import type { CarInfo } from "@/types/ratebook";

const PLACEHOLDER = { value: "", label: "เลือกข้อมูล" };

// engineCc is optional ("ไม่บังคับ" in the field label); every other field is required.
const REQUIRED_FIELDS: (keyof CarInfo)[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
  "carType",
  "transmission",
  "bodyType",
  "subModel",
];

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
  onCarInfoChange: (carInfo: CarInfo) => void;
};

export function CarInfoForm({ opportunityId, carInfo, onCarInfoChange }: CarInfoFormProps) {
  function update<K extends keyof CarInfo>(key: K, value: string) {
    onCarInfoChange({ ...carInfo, [key]: value });
  }

  const isComplete = REQUIRED_FIELDS.every((field) => Boolean(carInfo[field]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">กรอกข้อมูลรถ</p>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Icon name="scan" className="size-4" />
          สแกนเล่มทะเบียน
        </Button>
      </div>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="ยี่ห้อรถ">
            <Select
              options={[PLACEHOLDER, ...carBrandOptions]}
              value={carInfo.brand ?? ""}
              onChange={(e) => update("brand", e.target.value)}
            />
          </FormField>
          <FormField label={<InfoLabel>รุ่นรถ</InfoLabel>}>
            <Select
              options={[PLACEHOLDER, ...carModelOptions]}
              value={carInfo.model ?? ""}
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
          <FormField label="ขนาดเครื่องยนต์ ไม่บังคับ">
            <Select
              options={[PLACEHOLDER, ...carEngineCcOptions]}
              value={carInfo.engineCc ?? ""}
              onChange={(e) => update("engineCc", e.target.value)}
            />
          </FormField>
          <FormField label="ระบบเกียร์">
            <Select
              options={[PLACEHOLDER, ...carTransmissionOptions]}
              value={carInfo.transmission ?? ""}
              onChange={(e) => update("transmission", e.target.value)}
            />
          </FormField>
          <FormField label="ประเภทตัวถัง">
            <Select
              options={[PLACEHOLDER, ...carBodyTypeOptions]}
              value={carInfo.bodyType ?? ""}
              onChange={(e) => update("bodyType", e.target.value)}
            />
          </FormField>
          <FormField label="รุ่นย่อย">
            <Select
              options={[PLACEHOLDER, ...carSubModelOptions]}
              value={carInfo.subModel ?? ""}
              onChange={(e) => update("subModel", e.target.value)}
            />
          </FormField>
        </div>

        <div className="border-t border-border" />

        <div className="flex justify-end">
          <Button
            variant="primary"
            disabled={!isComplete}
            onClick={() => {
              if (opportunityId) void updateOpportunityCarInfo(opportunityId, carInfo);
            }}
          >
            ดูราคาประเมิน
          </Button>
        </div>
      </Card>
    </div>
  );
}
