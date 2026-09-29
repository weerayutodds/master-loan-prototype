import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import {
  carConditionOptions,
  carDoorsOptions,
  carTransmissionOptions,
  carTypeOptionsByCollateralType,
  toVehicleCollateralType,
} from "@/lib/mock";
import { bodyTypeLabel } from "@/lib/ratebook";
import type { CarInfo, CollateralType } from "@/types/ratebook";

function optionLabel(options: { value: string; label: string }[], value?: string): string {
  return options.find((option) => option.value === value)?.label ?? "-";
}

type LeadCollateralInfoCardProps = {
  carInfo: CarInfo;
  collateralType: CollateralType | null;
};

export function LeadCollateralInfoCard({ carInfo, collateralType }: LeadCollateralInfoCardProps) {
  const vehicleCollateralType = toVehicleCollateralType(collateralType);
  // ยี่ห้อ/รุ่น/รุ่นย่อย are stored as the ratebook's own wording, so they are
  // shown as they are rather than looked up in a catalog this card cannot reach.
  const brandLabel = carInfo.brand?.toUpperCase() ?? "-";
  const modelLabel = carInfo.model?.toUpperCase() ?? "-";
  const yearLabel = carInfo.year ? `${carInfo.year} (${Number(carInfo.year) + 543})` : "-";
  const doorsLabel = optionLabel(carDoorsOptions, carInfo.doors);
  const typeLabel = carInfo.carType
    ? `${optionLabel(carTypeOptionsByCollateralType[vehicleCollateralType], carInfo.carType)} ${doorsLabel}`
    : "-";

  const fields: { label: string; value: string; bold?: boolean }[] = [
    { label: "ยี่ห้อรถ", value: brandLabel },
    { label: "รุ่นรถ", value: modelLabel },
    { label: "ปีรถ", value: yearLabel },
    { label: "ประเภทรถ", value: typeLabel },
    { label: "สภาพรถ", value: optionLabel(carConditionOptions, carInfo.condition), bold: true },
    { label: "จำนวนประตู", value: doorsLabel },
    {
      label: "ขนาดเครื่องยนต์",
      value: carInfo.engineCc ? `${carInfo.engineCc} ซีซี` : "-",
    },
    { label: "ระบบเกียร์", value: optionLabel(carTransmissionOptions, carInfo.transmission) },
    { label: "ประเภทตัวถัง", value: carInfo.bodyType ? bodyTypeLabel(carInfo.bodyType) : "-" },
    { label: "รุ่นย่อย", value: carInfo.subModel ?? "-" },
  ];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between border-b border-divider pb-3">
        <h3 className="text-lg font-semibold text-primary-to">ข้อมูลหลักประกัน</h3>
        <Button variant="outline" size="xs">
          แก้ไข
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{field.label} :</span>
            <span className={field.bold ? "font-semibold text-foreground" : "font-medium text-foreground"}>
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
