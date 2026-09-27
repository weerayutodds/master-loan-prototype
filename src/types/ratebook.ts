import type { IconName } from "@/components/atoms/Icon";
import type { Gender } from "@/types/customer-lead";

export type LoanPurpose = "need-money" | "buy-car";
export type CollateralType = "motorcycle" | "car" | "truck" | "land";
export type RefinanceStatus = "still-paying" | "paid-off";

export type VehicleCollateralType = Extract<
  CollateralType,
  "motorcycle" | "car" | "truck"
>;

export type VehicleSubModelOption = { value: string; label: string };
export type VehicleModelOption = {
  value: string;
  label: string;
  subModels: VehicleSubModelOption[];
};
export type VehicleBrandOption = {
  value: string;
  label: string;
  models: VehicleModelOption[];
};

export type OptionCardData<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: IconName;
  image?: string;
};

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  gender?: Gender;
  birthDate?: string;
};

export type CollateralIdentifier = {
  licensePlateNumber?: string;
  licensePlateProvince?: string;
  chassisNumber?: string;
};

export type CarInfo = {
  brand?: string;
  model?: string;
  year?: string;
  condition?: string;
  doors?: string;
  carType?: string;
  engineCc?: string;
  transmission?: string;
  bodyType?: string;
  subModel?: string;
};

export type LoanInfo = {
  requestedAmount?: number;
  wantsWheelCard?: "yes" | "no";
  hasPpi?: "yes" | "no";
  installmentTerm?: number;
};

export type CarInsuranceInfo = {
  possessionDate?: string;
  carInsuranceExpiry?: string;
  carInsuranceCompany?: string;
  compulsoryExpiry?: string;
  compulsoryBundledWithCarInsurance?: boolean;
  compulsoryCompany?: string;
};
