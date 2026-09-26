import sql from "@/lib/db";
import type { CustomerLead } from "@/types/customer-lead";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): CustomerLead {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    idCardNumber: row.id_card_number,
    ncbGrade: row.ncb_grade,
    verificationMethod: row.verification_method,
    createdAt: row.created_at.toISOString(),
  };
}

export async function getCustomerLeadById(
  id: string,
): Promise<CustomerLead | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const [row] = await sql`
    select id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method, created_at
    from customer_lead
    where id = ${id}
  `;

  return row ? mapRow(row) : null;
}

export async function listCustomerLeads(): Promise<CustomerLead[]> {
  const rows = await sql`
    select id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method, created_at
    from customer_lead
    order by created_at desc
  `;

  return rows.map(mapRow);
}
