"use server";

import sql from "@/lib/db";
import type { VerificationMethod } from "@/types/customer-form";
import type { CustomerLead, Gender, NcbGrade } from "@/types/customer-lead";

const NCB_GRADES: NcbGrade[] = ["A01", "A02", "A03", "L05"];

function pickRandomNcbGrade(): NcbGrade {
  return NCB_GRADES[Math.floor(Math.random() * NCB_GRADES.length)];
}

type CreateCustomerLeadInput = {
  firstName: string;
  lastName: string;
  phone: string;
  idCardNumber: string;
  verificationMethod: VerificationMethod;
  gender?: Gender | null;
  birthDate?: string | null;
};

export async function createCustomerLead(
  input: CreateCustomerLeadInput,
): Promise<CustomerLead> {
  // NCB grade simulates a real eNCB check, which only happens on a card read;
  // manual entry has no such check, so the grade stays unset.
  const ncbGrade = input.verificationMethod === "card" ? pickRandomNcbGrade() : null;
  const gender = input.gender ?? null;
  const birthDate = input.birthDate ?? null;

  const [row] = await sql`
    insert into customer_lead (first_name, last_name, phone, id_card_number, ncb_grade, verification_method, gender, birth_date)
    values (${input.firstName}, ${input.lastName}, ${input.phone}, ${input.idCardNumber}, ${ncbGrade}, ${input.verificationMethod}, ${gender}, ${birthDate})
    on conflict (phone) do update set
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      id_card_number = excluded.id_card_number,
      ncb_grade = excluded.ncb_grade,
      verification_method = excluded.verification_method,
      gender = excluded.gender,
      birth_date = excluded.birth_date
    returning id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method, gender, birth_date, created_at
  `;

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    idCardNumber: row.id_card_number,
    ncbGrade: row.ncb_grade,
    verificationMethod: row.verification_method,
    gender: row.gender,
    birthDate: row.birth_date ? row.birth_date.toISOString().slice(0, 10) : null,
    createdAt: row.created_at.toISOString(),
  };
}
