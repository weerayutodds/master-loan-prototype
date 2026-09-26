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
};

export type ProductCatalogData = {
  filterChips: string[];
  gradeFilterLabel: string;
  items: ProductCatalogItem[];
};
