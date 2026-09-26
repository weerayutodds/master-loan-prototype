import type { VerificationMethod } from "@/types/customer-form";

export type NcbGrade = "A01" | "A02" | "A03" | "L05";

export type CustomerLead = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  idCardNumber: string;
  ncbGrade: NcbGrade | null;
  verificationMethod: VerificationMethod;
  createdAt: string;
};
