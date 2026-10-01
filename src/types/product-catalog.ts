import type { ProductLoanLimits } from "@/lib/product-loan-limits";

export type ProductCatalogTagTone = "green" | "red" | "purple" | "amber" | "pink";

export type ProductCatalogTag = {
  label: string;
  tone: ProductCatalogTagTone;
};

export type ProductCatalogItem = {
  id: string;
  title: string;
  tags: ProductCatalogTag[];
  ltvLabel: string;
  approvedAmount: string;
  appraisalPrice: number;
  maxLtvPercent: number;
  /** Lowest annual rate (ลดต้นลดดอก / ดอกเบี้ยคงที่ ต่อปี); used for sorting. */
  minAnnualInterestPercent: number;
  loanLimits: ProductLoanLimits;
  /** Configured CSV limits in baht; null means unspecified. */
  minAmount: number | null;
  maxAmount: number | null;
  ncbGradeLabel: string;
  ncbGradeTone: "blue" | "green";
  bookStatusLabel: string;
  interestRateLabel: string;
  interestReductionLabel: string;
  primaryActionLabel: string;
  primaryActionVariant: "outline" | "filled";
  detail: ProductCatalogDetail;
};

export type ProductCatalogLtvGroup = {
  ncbGrade: string;
  rows: { holdingPeriod: string; limit: string }[];
};

/** Rates follow the interest table's column order: <50%, 50%-60%, >=60% LTV. */
export type ProductCatalogInterestRow = {
  ncbGrade: string;
  rates: [string, string, string];
};

export type ProductCatalogCondition = {
  label: string;
  value: string;
  tone?: "success";
};

export type ProductCatalogDetail = {
  /** e.g. "รถยนต์", "รถจักรยานยนต์" — used in the drawer's "เงื่อนไขหลักประกัน - {label}" title. */
  collateralLabel: string;
  ltvGroups: ProductCatalogLtvGroup[];
  interestRows: ProductCatalogInterestRow[];
  collateralConditions: ProductCatalogCondition[];
  borrowerConditions: ProductCatalogCondition[];
};

export type ProductCatalogData = {
  filterChips: string[];
  gradeFilterLabel: string;
  items: ProductCatalogItem[];
};

/** A 0 amount/LTV means that condition is not applied. */
export type ProductCatalogFilter = {
  bookStatus: string;
  requestedAmount: number;
  requestedLtvPercent: number;
  /** Mirrors `LoanCalBar`'s บัตรติดล้อ checkbox. Shows the "บัตรติดล้อ" chip. Display-only — does not filter cards. */
  wantsWheelCard: boolean;
};
