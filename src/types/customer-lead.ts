import type { VerificationMethod } from "@/types/customer-form";

export type NcbGrade =
  | "A01" | "A02" | "A03" | "A04" | "A05"
  | "U01" | "U02" | "U03" | "U04" | "U05"
  | "L01" | "L02" | "L03" | "L04" | "L05";
export type Gender = "male" | "female";

export type CustomerLead = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  idCardNumber: string;
  ncbGrade: NcbGrade | null;
  verificationMethod: VerificationMethod;
  gender: Gender | null;
  birthDate: string | null;
  createdAt: string;
};
