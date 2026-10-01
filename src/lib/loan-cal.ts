import type { ProductCatalogData, ProductCatalogFilter, ProductCatalogItem } from "@/types/product-catalog";

export const TRANSFER_BOOK_STATUS = "โอนเล่ม";

/** งวดผ่อน options, shared by `LoanCalBar` and `LeadLoanInfoCard` so they can't drift apart. */
export const INSTALLMENT_TERM_OPTIONS = [12, 18, 24, 30, 36, 42, 48, 54, 60];
export const DEFAULT_INSTALLMENT_TERM = 60;
/** มอเตอร์ไซค์ is fixed at this term — the dropdown offers nothing else. */
export const MOTORCYCLE_INSTALLMENT_TERM = 30;

/** Every book status present in the catalog, in catalog order; the first one is the default. */
export function getBookStatusOptions(productCatalog: ProductCatalogData): string[] {
  return Array.from(new Set(productCatalog.items.map((item) => item.bookStatusLabel)));
}

/** What `LoanCalBar` starts with, so the catalog is split the same way before the user touches it. */
export function getDefaultProductCatalogFilter(
  productCatalog: ProductCatalogData,
): ProductCatalogFilter {
  const bookStatus = getBookStatusOptions(productCatalog)[0] ?? "";
  return {
    bookStatus,
    requestedAmount: 0,
    requestedLtvPercent: 0,
    wantsWheelCard: bookStatus !== TRANSFER_BOOK_STATUS,
  };
}

/** Effective ceiling shared with catalog display and filtering. */
export function getMaxApprovedAmount(product: Pick<ProductCatalogItem, "loanLimits">): number {
  return product.loanLimits.status === "available" ? product.loanLimits.maxAmount : 0;
}

export function calculateLtvPercent(amount: number, appraisalPrice: number): number {
  if (appraisalPrice <= 0) return 0;
  return Math.round((amount / appraisalPrice) * 10000) / 100;
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
