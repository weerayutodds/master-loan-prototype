import { Badge } from "@/components/atoms/Badge"
import type { ProductGuidePlan } from "@/types/product-guide"

type ProductGuidePlanCardProps = {
  plan: ProductGuidePlan
  titleClassName: string
}

export function ProductGuidePlanCard({
  plan,
  titleClassName,
}: ProductGuidePlanCardProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* 1. TOP LAYER (Behind Middle) */}
      <div
        className={`relative z-0 rounded-t-2xl border-x border-t border-white/50 px-4 pt-3 pb-8 ${titleClassName}`}
      >
        <span className="text-xs font-medium text-white">{plan.title}</span>
      </div>

      {/* 2. MIDDLE LAYER (In front of Top and Bottom) */}
      <div className="relative z-10 -mt-5 rounded-2xl border border-divider bg-surface-muted px-4 py-4">
        <Badge tone="info" className="mb-2">
          {plan.maxLtvLabel}
        </Badge>
        <p className="flex items-baseline gap-1">
          <span className="text-sm font-medium text-price-label">
            ยอดไม่เกิน
          </span>
          <span className="text-2xl font-semibold text-primary-to">
            {plan.maxAmount.toLocaleString("th-TH")}
          </span>
          <span className="text-xs text-unit-label">บาท</span>
        </p>
      </div>

      {/* 3. BOTTOM LAYER (Behind Middle) */}
      <div className="relative z-0 -mt-5 flex-1 rounded-b-2xl border-x border-b border-divider bg-surface px-4 pb-6 pt-9 shadow-[0px_4px_12px_rgba(23,32,84,0.06)]">
        {plan.bulletsHeading ? (
          <p className="mb-2 text-xs font-medium text-foreground">
            {plan.bulletsHeading}
          </p>
        ) : null}
        <ul className="space-y-2">
          {plan.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-xs text-foreground"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-radio-border" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}