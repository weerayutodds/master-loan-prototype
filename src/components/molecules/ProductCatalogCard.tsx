import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { ProductCatalogItem, ProductCatalogTagTone } from "@/types/product-catalog";

const TAG_TONE_CLASSNAMES: Record<ProductCatalogTagTone, string> = {
  green: "bg-success",
  red: "bg-tag-red",
  purple: "bg-tag-purple",
  amber: "bg-tag-amber",
  pink: "bg-tag-pink",
};

const NCB_GRADE_TONE_CLASSNAMES: Record<ProductCatalogItem["ncbGradeTone"], string> = {
  blue: "text-primary-to",
  green: "text-success",
};

type ProductCatalogCardProps = {
  item: ProductCatalogItem;
  onSelect?: () => void;
  onViewDetail?: () => void;
};

export function ProductCatalogCard({ item, onSelect, onViewDetail }: ProductCatalogCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-catalog-card-bg shadow-primary-xs">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">{item.title}</span>
        {item.tags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${TAG_TONE_CLASSNAMES[tag.tone]}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-t-lg bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-catalog-card-bg text-primary">
            <Icon name="coin" className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">วงเงินอนุมัติ</span>
              <Badge tone="info">{item.ltvLabel}</Badge>
            </div>
            <p className="text-xl font-semibold text-primary-to">
              {item.approvedAmount} <span className="text-xs font-normal text-unit-label">บาท</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs sm:flex sm:gap-8">
          <div>
            <p className="text-muted-foreground">เล่มทะเบียน</p>
            <p className="font-medium text-foreground">{item.bookStatusLabel}</p>
          </div>
          <div>
            <p className="text-muted-foreground">อัตราดอกเบี้ย</p>
            <p className="font-medium text-foreground">{item.interestRateLabel}</p>
            <p className="text-primary-to">{item.interestReductionLabel}</p>
          </div>
          <div>
            <p className="text-muted-foreground">เฉพาะ NCB</p>
            <p className={`font-medium ${NCB_GRADE_TONE_CLASSNAMES[item.ncbGradeTone]}`}>
              {item.ncbGradeLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-36">
          <Button
            variant={item.primaryActionVariant === "filled" ? "primary" : "outline"}
            size="sm"
            onClick={item.primaryActionVariant === "filled" ? onSelect : undefined}
          >
            {item.primaryActionLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onViewDetail}>
            ดูรายละเอียด
          </Button>
        </div>
      </div>
    </div>
  );
}
