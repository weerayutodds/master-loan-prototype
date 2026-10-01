export type ProductLoanLimits =
  | { status: "available"; minAmount: number | null; maxAmount: number }
  | { status: "unavailable" };

/** Whole-baht limits; LTV is a ceiling, not a minimum borrowing requirement. */
export function calculateProductLoanLimits({
  appraisalPrice,
  maxLtvPercent,
  minAmount,
  maxAmount,
}: {
  appraisalPrice: number;
  maxLtvPercent: number;
  minAmount: number | null;
  maxAmount: number | null;
}): ProductLoanLimits {
  if (
    !Number.isFinite(appraisalPrice) || appraisalPrice <= 0 ||
    !Number.isFinite(maxLtvPercent) || maxLtvPercent <= 0 ||
    [minAmount, maxAmount].some((amount) =>
      amount !== null && (!Number.isFinite(amount) || amount < 0),
    )
  ) return { status: "unavailable" };

  const effectiveMax = Math.floor(Math.min(
    maxAmount ?? Infinity,
    (appraisalPrice * maxLtvPercent) / 100,
  ));
  const effectiveMin = minAmount === null ? null : Math.ceil(minAmount);
  if (!Number.isFinite(effectiveMax) || effectiveMax <= 0 || effectiveMax < (effectiveMin ?? 0)) {
    return { status: "unavailable" };
  }
  return { status: "available", minAmount: effectiveMin, maxAmount: effectiveMax };
}

export function isWithinProductLoanLimits(limits: ProductLoanLimits, amount: number): boolean {
  return limits.status === "available" && Number.isFinite(amount) && amount > 0 &&
    amount >= (limits.minAmount ?? 0) && amount <= limits.maxAmount;
}

/** A supplied amount takes precedence over its rounded display LTV. Zero means no filter. */
export function matchesProductLoanRequest(
  limits: ProductLoanLimits,
  appraisalPrice: number,
  requestedAmount: number,
  requestedLtvPercent: number,
): boolean {
  if (limits.status !== "available" || !Number.isFinite(requestedAmount) ||
    !Number.isFinite(requestedLtvPercent) || requestedAmount < 0 || requestedLtvPercent < 0) return false;
  if (requestedAmount > 0) return isWithinProductLoanLimits(limits, requestedAmount);
  if (requestedLtvPercent > 0) {
    return isWithinProductLoanLimits(limits, (appraisalPrice * requestedLtvPercent) / 100);
  }
  return true;
}

/** Display the LTV-derived offer; the eligibility minimum does not define this band. */
export function formatProductLoanLimits(limits: ProductLoanLimits, lowerLtvAmount?: number): string {
  if (limits.status === "unavailable") return "ไม่เข้าเงื่อนไขวงเงิน";
  const max = limits.maxAmount.toLocaleString("en-US");
  if (lowerLtvAmount === undefined) return max;
  const lower = Math.min(Math.floor(lowerLtvAmount), limits.maxAmount);
  if (lower === limits.maxAmount) return max;
  return `${lower.toLocaleString("en-US")} - ${max}`;
}
