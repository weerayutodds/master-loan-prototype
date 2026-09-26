export type ProductGuidePlan = {
  title: string;
  maxLtvLabel: string;
  maxAmount: number;
  bullets: string[];
};

export type ProductGuideData = {
  appraisalPrice: number;
  approvedRange: { min: number; max: number };
  approvedLtvBadges: string[];
  plans: ProductGuidePlan[];
};
