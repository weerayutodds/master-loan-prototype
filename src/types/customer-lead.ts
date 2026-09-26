export type NcbGrade = "A01" | "A02" | "A03" | "L05";

export type CustomerLead = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  idCardNumber: string;
  ncbGrade: NcbGrade;
  createdAt: string;
};
