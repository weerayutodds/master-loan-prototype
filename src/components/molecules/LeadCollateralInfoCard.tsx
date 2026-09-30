import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import {
  carConditionOptions,
  carDoorsOptions,
  carTransmissionOptions,
  carTypeOptionsByCollateralType,
  toVehicleCollateralType,
} from "@/lib/mock";
import { isRatebookCollateralType } from "@/lib/ratebook";
import { getCarTypeLabel } from "@/lib/car-type";
import type { CarInfo, CollateralType } from "@/types/ratebook";

function optionLabel(options: { value: string; label: string }[], value?: string): string {
  return options.find((option) => option.value === value)?.label ?? "-";
}

type LeadCollateralInfoCardProps = {
  carInfo: CarInfo;
  collateralType: CollateralType | null;
  onEdit?: () => void;
};

export function LeadCollateralInfoCard({ carInfo, collateralType, onEdit }: LeadCollateralInfoCardProps) {
  const vehicleCollateralType = toVehicleCollateralType(collateralType);
  // ยี่ห้อ/รุ่น/รุ่นย่อย are stored as the ratebook's own wording, so they are
  // shown as they are rather than looked up in a catalog this card cannot reach.
  const brandLabel = carInfo.brand?.toUpperCase() ?? "-";
  const modelLabel = carInfo.model?.toUpperCase() ?? "-";
  const yearLabel = carInfo.year ? `${carInfo.year} (${Number(carInfo.year) + 543})` : "-";
  const doorsLabel = optionLabel(carDoorsOptions, carInfo.doors);
  const typeLabel = carInfo.carType
    ? isRatebookCollateralType(collateralType)
      ? getCarTypeLabel(carInfo.carType) ?? "-"
      : `${optionLabel(carTypeOptionsByCollateralType[vehicleCollateralType], carInfo.carType)} ${doorsLabel}`
    : "-";

  const isMotorcycle = collateralType === "motorcycle";

  // มอเตอร์ไซค์ only ever asks ยี่ห้อ/รุ่น/ปี/รุ่นย่อย -- the rest of these
  // fields don't apply (no สภาพรถ/ประตู/เครื่องยนต์/เกียร์/ตัวถัง for it).
  const fields: { label: string; value: string; bold?: boolean }[] = isMotorcycle
    ? [
        { label: "ยี่ห้อรถ", value: brandLabel },
        { label: "รุ่นรถ", value: modelLabel },
        { label: "ปีรถ", value: yearLabel },
        { label: "รุ่นย่อย", value: carInfo.subModel ?? "-" },
      ]
    : [
        { label: "ยี่ห้อรถ", value: brandLabel },
        { label: "รุ่นรถ", value: modelLabel },
        { label: "ปีรถ", value: yearLabel },
        { label: "ประเภทรถ", value: typeLabel },
        { label: "สภาพรถ", value: optionLabel(carConditionOptions, carInfo.condition), bold: true },
        { label: "จำนวนประตู", value: doorsLabel },
        {
          label: "ขนาดเครื่องยนต์ (ไม่บังคับ)",
          value: carInfo.engineCc ? `${carInfo.engineCc} ซีซี` : "-",
        },
        { label: "ระบบเกียร์", value: optionLabel(carTransmissionOptions, carInfo.transmission) },
        { label: "ประเภทตัวถัง", value: carInfo.bodyType || "-" },
        { label: "รุ่นย่อย", value: carInfo.subModel ?? "-" },
      ];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between border-b border-divider pb-3">
        <h3 className="text-lg font-semibold text-primary-to">ข้อมูลหลักประกัน</h3>
        <Button variant="outline" size="xs" onClick={onEdit}>
          แก้ไข
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-3 text-sm">
            <span className="shrink-0 text-muted-foreground">{field.label} :</span>
            <span className={`min-w-0 text-right ${field.bold ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
