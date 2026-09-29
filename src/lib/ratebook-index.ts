// GENERATED FILE -- DO NOT EDIT BY HAND.
//
// Source: Ratebook/Cartype{1,2,3,8}(*) 202601.xlsx
// Regenerate: npm run generate:ratebook
//
// Only the brand list is bundled. The rows for a brand live in
// public/ratebook/<collateralType>/<file>.json and are fetched by
// loadBrandRows() in src/lib/ratebook.ts when that brand is picked.

export type RatebookBrand = {
  /** Stored verbatim in customer_lead_opportunity.car_brand and shown as-is. */
  value: string;
  /** Basename under public/ratebook/<collateralType>/. */
  file: string;
};

export const RATEBOOK_PERIOD = "202601";

export const ratebookBrandsByCollateralType: Record<
  "car" | "motorcycle",
  RatebookBrand[]
> = {
  car: [
    { value: "BENZ", file: "benz" },
    { value: "BMW", file: "bmw" },
    { value: "CHEVROLET", file: "chevrolet" },
    { value: "FORD", file: "ford" },
    { value: "HONDA", file: "honda" },
    { value: "HYUNDAI", file: "hyundai" },
    { value: "ISUZU", file: "isuzu" },
    { value: "MAZDA", file: "mazda" },
    { value: "MG", file: "mg" },
    { value: "MITSUBISHI", file: "mitsubishi" },
    { value: "NISSAN", file: "nissan" },
    { value: "SUZUKI", file: "suzuki" },
    { value: "TOYOTA", file: "toyota" },
  ],
  motorcycle: [
    { value: "GPX", file: "gpx" },
    { value: "HONDA", file: "honda" },
    { value: "KAWASAKI", file: "kawasaki" },
    { value: "SUZUKI", file: "suzuki" },
    { value: "YAMAHA", file: "yamaha" },
  ],
};
