import sql from "@/lib/db";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): CustomerLeadOpportunity {
  return {
    id: row.id,
    leadId: row.lead_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    idCardNumber: row.id_card_number,
    ncbGrade: row.ncb_grade,
    verificationMethod: row.verification_method,
    loanPurpose: row.loan_purpose,
    collateralType: row.collateral_type,
    refinanceStatus: row.refinance_status,
    licensePlateNumber: row.license_plate_number,
    licensePlateProvince: row.license_plate_province,
    chassisNumber: row.chassis_number,
    brandModel: row.brand_model,
    carBrand: row.car_brand,
    carModel: row.car_model,
    carYear: row.car_year,
    carCondition: row.car_condition,
    carDoors: row.car_doors,
    carType: row.car_type,
    carEngineCc: row.car_engine_cc,
    carTransmission: row.car_transmission,
    carBodyType: row.car_body_type,
    carSubModel: row.car_sub_model,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getCustomerLeadOpportunityById(
  id: string,
): Promise<CustomerLeadOpportunity | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const [row] = await sql`
    select
      id, lead_id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method,
      loan_purpose, collateral_type, refinance_status,
      license_plate_number, license_plate_province, chassis_number, brand_model,
      car_brand, car_model, car_year, car_condition, car_doors, car_type, car_engine_cc,
      car_transmission, car_body_type, car_sub_model,
      created_at, updated_at
    from customer_lead_opportunity
    where id = ${id}
  `;

  return row ? mapRow(row) : null;
}

export async function listCustomerLeadOpportunitiesByLeadId(
  leadId: string,
): Promise<CustomerLeadOpportunity[]> {
  if (!UUID_PATTERN.test(leadId)) return [];

  const rows = await sql`
    select
      id, lead_id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method,
      loan_purpose, collateral_type, refinance_status,
      license_plate_number, license_plate_province, chassis_number, brand_model,
      car_brand, car_model, car_year, car_condition, car_doors, car_type, car_engine_cc,
      car_transmission, car_body_type, car_sub_model,
      created_at, updated_at
    from customer_lead_opportunity
    where lead_id = ${leadId}
    order by created_at desc
  `;

  return rows.map(mapRow);
}
