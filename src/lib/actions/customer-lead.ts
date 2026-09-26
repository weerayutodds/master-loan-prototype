"use server";

import sql from "@/lib/db";
import type { CustomerLead, NcbGrade } from "@/types/customer-lead";

const NCB_GRADES: NcbGrade[] = ["A01", "A02", "A03", "L05"];

function pickRandomNcbGrade(): NcbGrade {
  return NCB_GRADES[Math.floor(Math.random() * NCB_GRADES.length)];
}

type CreateCustomerLeadInput = {
  firstName: string;
  lastName: string;
  phone: string;
  idCardNumber: string;
};

export async function createCustomerLead(
  input: CreateCustomerLeadInput,
): Promise<CustomerLead> {
  const ncbGrade = pickRandomNcbGrade();

  const [row] = await sql`
    insert into customer_lead (first_name, last_name, phone, id_card_number, ncb_grade)
    values (${input.firstName}, ${input.lastName}, ${input.phone}, ${input.idCardNumber}, ${ncbGrade})
    on conflict (phone) do update set
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      id_card_number = excluded.id_card_number,
      ncb_grade = excluded.ncb_grade
    returning id, first_name, last_name, phone, id_card_number, ncb_grade, created_at
  `;

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    idCardNumber: row.id_card_number,
    ncbGrade: row.ncb_grade,
    createdAt: row.created_at.toISOString(),
  };
}
