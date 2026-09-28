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
};
