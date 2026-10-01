import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import type {
  ProductCatalogItem,
  ProductCatalogTagTone,
} from "@/types/product-catalog"

const TAG_TONE_CLASSNAMES: Record<ProductCatalogTagTone, string> = {
  green: "bg-success",
  red: "bg-tag-red",
  purple: "bg-tag-purple",
  amber: "bg-tag-amber",
  pink: "bg-tag-pink",
}

const NCB_GRADE_TONE_CLASSNAMES: Record<
  ProductCatalogItem["ncbGradeTone"],
  string
> = {
  blue: "text-primary",
  green: "text-success",
}

type ProductCatalogCardProps = {
  item: ProductCatalogItem
  onSelect?: () => void
  onCheckNcb?: () => void
  onViewDetail?: () => void
}

export function ProductCatalogCard({
  item,
  onSelect,
  onCheckNcb,
  onViewDetail,
}: ProductCatalogCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-card-border bg-catalog-card-bg shadow-primary-xs">
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span className="text-sm font-semibold text-foreground">
          {item.title}
        </span>
        {item.tags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-full px-3 py-1 text-xs font-medium text-white ${TAG_TONE_CLASSNAMES[tag.tone]}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 overflow-x-auto rounded-t-lg bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 rounded-lg bg-surface-muted px-3 py-2 sm:w-64 sm:shrink-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center">
              <Icon name="money-bag" className="size-4 text-primary-to" />
              <span className="pb-0.5 text-xs text-foreground whitespace-nowrap">
                วงเงินอนุมัติ
              </span>
            </div>
            <span className="rounded-md bg-primary/20 px-1.5 text-xs font-medium whitespace-nowrap text-primary-to">
              {item.ltvLabel}
            </span>
          </div>

          <p className="flex items-end justify-end gap-1 text-lg font-semibold text-primary-to">
            {item.approvedAmount}
            <span className="pb-0.5 text-[10px] font-normal">บาท</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs sm:flex sm:flex-1 sm:items-center sm:gap-3">
          <div className="sm:shrink-0 sm:flex-1 whitespace-nowrap">
            <p className="text-muted-foreground">เล่มทะเบียน</p>
            <p className="font-medium text-price-label">
              {item.bookStatusLabel}
            </p>
          </div>

          <div className="hidden w-px shrink-0 self-stretch bg-secondary-border sm:block" />

          <div className="sm:shrink-0 sm:flex-[1.5] whitespace-nowrap">
            <p className="text-muted-foreground">อัตราดอกเบี้ย</p>
            <p className="text-unit-label">{item.interestRateLabel}</p>
            <p className="text-price-label">{item.interestReductionLabel}</p>
          </div>

          <div className="hidden w-px shrink-0 self-stretch bg-secondary-border sm:block" />

          <div className="sm:shrink-0 sm:flex-1 whitespace-nowrap">
            <p className="text-muted-foreground font-light">เฉพาะ NCB</p>
            <p
              className={`font-medium ${NCB_GRADE_TONE_CLASSNAMES[item.ncbGradeTone]}`}
            >
              {item.ncbGradeLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-36 sm:shrink-0">
          <Button
            variant={
              item.primaryActionVariant === "filled" ? "primary" : "outline"
            }
            size="sm"
            onClick={
              item.primaryActionVariant === "filled" ? onSelect : onCheckNcb
            }
          >
            {item.primaryActionLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onViewDetail}>
            ดูรายละเอียด
          </Button>
        </div>
      </div>
    </div>
  )
}
