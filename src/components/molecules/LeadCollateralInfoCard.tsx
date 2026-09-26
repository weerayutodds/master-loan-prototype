import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import {
  carBodyTypeOptions,
  carBrandOptions,
  carConditionOptions,
  carDoorsOptions,
  carEngineCcOptions,
  carModelOptions,
  carSubModelOptions,
  carTypeOptions,
} from "@/lib/mock";
import type { CarInfo } from "@/types/ratebook";

function optionLabel(options: { value: string; label: string }[], value?: string): string {
  return options.find((option) => option.value === value)?.label ?? "-";
}

type LeadCollateralInfoCardProps = {
  carInfo: CarInfo;
};

export function LeadCollateralInfoCard({ carInfo }: LeadCollateralInfoCardProps) {
  const brandLabel = optionLabel(carBrandOptions, carInfo.brand).toUpperCase();
  const modelLabel = optionLabel(carModelOptions, carInfo.model).toUpperCase();
  const yearLabel = carInfo.year ? `${carInfo.year} (${Number(carInfo.year) + 543})` : "-";
  const doorsLabel = optionLabel(carDoorsOptions, carInfo.doors);
  const typeLabel = carInfo.carType
    ? `${optionLabel(carTypeOptions, carInfo.carType)} ${doorsLabel}`
    : "-";

  const fields: { label: string; value: string; bold?: boolean }[] = [
    { label: "ยี่ห้อรถ", value: brandLabel },
    { label: "รุ่นรถ", value: modelLabel },
    { label: "ปีรถ", value: yearLabel },
    { label: "ประเภทรถ", value: typeLabel },
    { label: "สภาพรถ", value: optionLabel(carConditionOptions, carInfo.condition), bold: true },
    { label: "จำนวนประตู", value: doorsLabel },
    { label: "ขนาดเครื่องยนต์", value: optionLabel(carEngineCcOptions, carInfo.engineCc) },
    { label: "ระบบเกียร์", value: carInfo.transmission?.toUpperCase() ?? "-" },
    { label: "ประเภทตัวถัง", value: carInfo.bodyType?.toUpperCase() ?? "-" },
    { label: "รุ่นย่อย", value: optionLabel(carSubModelOptions, carInfo.subModel) },
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
