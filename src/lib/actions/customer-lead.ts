"use server";

import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import { mockCardCustomer } from "@/lib/mock";
import type { VerificationMethod } from "@/types/customer-form";
import type { CustomerLead, Gender, NcbGrade } from "@/types/customer-lead";

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
  // A card read only verifies identity; the NCB grade stays unset until a separate eNCB check.
  const ncbGrade = null;
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

/**
 * The eNCB check reads the ID card, so it also marks the lead as card-verified;
 * an ID number already on file is kept, otherwise the one read from the card is stored.
 */
export async function updateCustomerLeadNcbGrade(
  leadId: string,
  ncbGrade: NcbGrade,
  idCardNumber: string = mockCardCustomer.idCardNumber,
): Promise<CustomerLead> {
  const [row] = await sql`
    update customer_lead
    set
      ncb_grade = ${ncbGrade},
      verification_method = 'card',
      id_card_number = coalesce(nullif(id_card_number, ''), ${idCardNumber})
    where id = ${leadId}
    returning id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method, gender, birth_date, created_at
  `;

  revalidatePath("/customer-lead-list");

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
