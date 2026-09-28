import type { ProductCatalogData, ProductCatalogFilter } from "@/types/product-catalog";
import type { CollateralType } from "@/types/ratebook";

export const TRANSFER_BOOK_STATUS = "โอนเล่ม";

/** Motorcycles are always โอนเล่ม; otherwise every book status present in the catalog, in catalog order. */
export function getBookStatusOptions(
  productCatalog: ProductCatalogData,
  collateralType: CollateralType | null,
): string[] {
  if (collateralType === "motorcycle") return [TRANSFER_BOOK_STATUS];
  return Array.from(new Set(productCatalog.items.map((item) => item.bookStatusLabel)));
}

/** What `LoanCalBar` starts with, so the catalog is split the same way before the user touches it. */
export function getDefaultProductCatalogFilter(
  productCatalog: ProductCatalogData,
  collateralType: CollateralType | null,
): ProductCatalogFilter {
  return {
    bookStatus: getBookStatusOptions(productCatalog, collateralType)[0] ?? "",
    requestedAmount: 0,
    requestedLtvPercent: 0,
  };
}

/** Reads the top of a product's "456,000 - 741,000"-style approved-amount range. */
export function getMaxApprovedAmount(product: { approvedAmount: string }): number {
  const amounts = (product.approvedAmount.match(/[\d,]+/g) ?? []).map((match) =>
    Number(match.replace(/,/g, "")),
  );
  return amounts[amounts.length - 1] ?? 0;
}

export function calculateLtvPercent(amount: number, appraisalPrice: number): number {
  if (appraisalPrice <= 0) return 0;
  return Math.round((amount / appraisalPrice) * 100);
}

export function calculateAmountFromLtv(ltvPercent: number, appraisalPrice: number): number {
  return Math.round(appraisalPrice * (ltvPercent / 100));
}

export function calculateFlatRateEquivalent(
  reducingAnnualRatePercent: number,
  months: number,
): number {
  if (months <= 0) return 0;
  const flatAnnualRatePercent = (reducingAnnualRatePercent * (months + 1)) / (2 * months);
  return Math.round((flatAnnualRatePercent / 12) * 100) / 100;
}

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  if (months <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(payment);
}

export function calculateFlatMonthlyPayment(
  principal: number,
  monthlyFlatRatePercent: number,
  months: number,
): number {
  if (months <= 0) return 0;
  const totalInterest = principal * (monthlyFlatRatePercent / 100) * months;
  return Math.round((principal + totalInterest) / months);
}

/**
 * "reducing" = ลดต้นลดดอก, rate in % ต่อปี.
 * "flat" = คงที่ (โอนเล่ม), rate in % ต่อเดือน.
 */
export type InterestRateType = "reducing" | "flat";

export const PPI_ANNUAL_PREMIUM = 8073;

export type LoanCalSummary = {
  financedAmount: number;
  ppiTotal: number;
  ppiMonthly: number;
  basePayment: number;
  totalPayment: number;
};

/**
 * บัตรติดล้อ (TLC) bills PPI as a flat monthly add-on to the installment.
 * Without it, PPI is instead financed into the principal up front.
 */
export function calculateLoanCalSummary({
  requestedAmount,
  interestRatePercent,
  rateType,
  installmentTerm,
  isTLC,
  hasPpi,
}: {
  requestedAmount: number;
  interestRatePercent: number;
  rateType: InterestRateType;
  installmentTerm: number;
  isTLC: boolean;
  hasPpi: boolean;
}): LoanCalSummary {
  if (requestedAmount <= 0) {
    return {financedAmount: 0, ppiTotal: 0, ppiMonthly: 0, basePayment: 0, totalPayment: 0};
  }

  const monthlyPayment = rateType === "flat" ? calculateFlatMonthlyPayment : calculateMonthlyPayment;

  if (isTLC) {
    const basePayment = monthlyPayment(
      requestedAmount,
      interestRatePercent,
      installmentTerm,
    );
    const ppiMonthly = hasPpi ? Math.round(PPI_ANNUAL_PREMIUM / 12) : 0;
    return {
      financedAmount: requestedAmount,
      ppiTotal: 0,
      ppiMonthly,
      basePayment,
      totalPayment: basePayment + ppiMonthly,
    };
  }

  const ppiTotal = hasPpi ? Math.round((PPI_ANNUAL_PREMIUM * installmentTerm) / 12) : 0;
  const financedAmount = requestedAmount + ppiTotal;
  const basePayment = monthlyPayment(
    financedAmount,
    interestRatePercent,
    installmentTerm,
  );
  return {
    financedAmount,
    ppiTotal,
    ppiMonthly: 0,
    basePayment,
    totalPayment: basePayment,
  };
}
