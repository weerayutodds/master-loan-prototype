export type ProductGuidePlan = {
  title: string;
  maxLtvLabel: string;
  maxAmount: number;
  /** Plain-text line shown above `bullets`, e.g. a rule the bullets belong to. */
  bulletsHeading?: string;
  bullets: string[];
};

export type ProductGuideData = {
  appraisalPrice: number;
  approvedRange: { min: number; max: number };
  approvedLtvBadges: string[];
  plans: ProductGuidePlan[];
};
