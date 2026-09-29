import {Badge} from "@/components/atoms/Badge"
import {Icon} from "@/components/atoms/Icon"
import {formatDateTime} from "@/lib/format"
import {
  carConditionOptions,
  collateralTypeOptions,
  refinanceStatusOptions,
} from "@/lib/mock"
import type {CustomerLeadOpportunity} from "@/types/customer-lead-opportunity"
import Link from "next/link"

type CustomerLeadOpportunityCardProps = {
  opportunity: CustomerLeadOpportunity
}

function getCollateralChips(opportunity: CustomerLeadOpportunity): string[] {
  const {
    collateralType,
    carBrand,
    carModel,
    carYear,
    carCondition,
    carSubModel,
  } = opportunity

  const collateralLabel = collateralTypeOptions.find(
    (option) => option.value === collateralType,
  )?.label

  // Stored as the ratebook writes them ("TOYOTA", "HILUXREVO"), so no lookup.
  const brandModelParts = [carBrand, carModel].filter(
    (label): label is string => Boolean(label),
  )
  const brandModelLabel =
    brandModelParts.length > 0
      ? brandModelParts.join(" • ").toUpperCase()
      : null

  const yearLabel = carYear ? `${carYear} (${Number(carYear) + 543})` : null

  const conditionLabel = carConditionOptions.find(
    (option) => option.value === carCondition,
  )?.label

  return [
    collateralLabel,
    brandModelLabel,
    yearLabel,
    conditionLabel,
    carSubModel ? carSubModel.toUpperCase() : null,
  ].filter((chip): chip is string => Boolean(chip))
}

export function CustomerLeadOpportunityCard({
  opportunity,
}: CustomerLeadOpportunityCardProps) {
  const requestedAmount = opportunity.requestedAmount
    ? Number(opportunity.requestedAmount)
    : 0
  const refinanceLabel =
    opportunity.refinanceStatus === "still-paying"
      ? refinanceStatusOptions.find((option) => option.value === "still-paying")
          ?.description
      : null
  const collateralChips = getCollateralChips(opportunity)

  return (
    <div className="relative w-full rounded-lg border border-secondary-border bg-surface p-4 pt-5">
      <Badge tone="warning" className="absolute -top-3 left-4">
        {opportunity.status}
      </Badge>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-lg font-medium text-foreground">
            {[opportunity.branchName, opportunity.referenceCode]
              .filter(Boolean)
              .join(" • ")}
          </p>
          {refinanceLabel ? (
            <span className="inline-flex items-center rounded-full bg-primary-to px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {refinanceLabel}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {opportunity.staffName ? (
            <p className="text-sm text-unit-label">
              {opportunity.staffName}
              {opportunity.staffCode ? ` : ${opportunity.staffCode}` : ""}
            </p>
          ) : null}
          <Link
            href={`/ratebook?opportunityId=${opportunity.id}`}
            className="flex size-6 shrink-0 items-center justify-center rounded border border-radio-border bg-surface"
          >
            <Icon name="arrow-right" className="size-3 text-foreground" />
          </Link>
        </div>
      </div>

      <div className="mt-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-catalog-card-bg px-1.5 py-1 text-xs font-medium text-primary-to">
          <Icon name="calendar" className="size-4" />
          สร้าง: {formatDateTime(opportunity.createdAt)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {collateralChips.length > 0 ? (
            collateralChips.map((chip, index) => (
              <span
                key={`${chip}-${index}`}
                className="inline-flex items-center rounded-full border border-secondary-border bg-surface px-2.5 py-1 text-xs text-foreground"
              >
                {chip}
              </span>
            ))
          ) : (
           <></>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-unit-label">ยอดขออนุมัติ</p>
            <p className="text-xl font-semibold text-primary">
              0.00{" "}
              <span className="text-xs font-normal text-unit-label">บาท</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-unit-label">ยอดลูกค้าขอ</p>

            <p className="text-xl font-semibold text-primary">
              {requestedAmount.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-xs font-normal text-unit-label">บาท</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
