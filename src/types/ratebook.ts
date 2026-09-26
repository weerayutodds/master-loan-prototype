import type { IconName } from "@/components/atoms/Icon";

export type LoanPurpose = "need-money" | "buy-car";
export type CollateralType = "motorcycle" | "car" | "truck" | "land";
export type RefinanceStatus = "still-paying" | "paid-off";

export type OptionCardData<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: IconName;
};

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  phone: string;
};
