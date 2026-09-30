import type { IconName } from "@/components/atoms/Icon";
import type { InterestRateType } from "@/lib/loan-cal";
import type { Gender } from "@/types/customer-lead";

export type LoanPurpose = "need-money" | "buy-car";
export type CollateralType = "motorcycle" | "car" | "truck" | "land";
export type RefinanceStatus = "still-paying" | "paid-off";

export type VehicleCollateralType = Extract<
  CollateralType,
  "motorcycle" | "car" | "truck"
>;

export type VehicleSubModelOption = { value: string; label: string };

// The vehicle facts the car form derives instead of asking for.
export type VehicleModelSpec = {
  // ประเภทรถ keyed by จำนวนประตู — the single source of both the จำนวนประตู option list and the
  // system-chosen ประเภทรถ. Vehicles with no doors (มอเตอร์ไซค์) key their one entry off "".
  carTypeByDoors: Record<string, string>;
  // carTransmissionOptions values this รุ่น comes in; exactly one means the form fills it in.
  transmissions: string[];
  // carBodyTypeOptionsByCollateralType values for this รุ่น; exactly one means the form fills it in.
  bodyTypes: string[];
};

export type VehicleModelOption = VehicleModelSpec & {
  value: string;
  label: string;
  subModels: VehicleSubModelOption[];
  basePrice: number;
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
  imageClassName?: string;
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
  /** Display text for รุ่นย่อย -- read off the chosen row, never picked directly. */
  subModel?: string;
  /**
   * What the รุ่นย่อย dropdown is actually keyed on, and the stable identity of
   * the whole selection: the ratebook Code for รถยนต์/มอเตอร์ไซค์, the mock
   * catalog's sub-model slug for รถบรรทุก. A Sub-Model alone is not enough --
   * BENZ S280 2005 has two priced rows under "2.8 RWD (2799ซีซี)".
   */
  ratebookCode?: string;
  /** ราคาประเมิน of the chosen row. */
  appraisalPrice?: number;
  /** `Rate Book` (วงเงินจัด) of the chosen row. รถบรรทุก has none. */
  ratebookPrice?: number;
};

export type LoanInfo = {
  requestedAmount?: number;
  wantsWheelCard?: "yes" | "no";
  hasPpi?: "yes" | "no";
  installmentTerm?: number;
  /** Not persisted — carried over from `LoanCalBar` for the current session only. */
  interestRatePercent?: number;
  rateType?: InterestRateType;
};

export type CarInsuranceInfo = {
  possessionDate?: string;
  carInsuranceExpiry?: string;
  carInsuranceCompany?: string;
  compulsoryExpiry?: string;
  compulsoryBundledWithCarInsurance?: boolean;
  compulsoryCompany?: string;
};
