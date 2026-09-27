import type { Gender } from "@/types/customer-lead";

export type CustomerType = "individual";
export type VerificationMethod = "card" | "manual";
export type CardReadStatus = "idle" | "loading" | "success";

export type CardCustomerData = {
  name: string;
  idCardNumber: string;
  gender: Gender;
  birthDate: string;
};
