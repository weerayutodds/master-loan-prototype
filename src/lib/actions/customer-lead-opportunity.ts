"use server";

import { redirect } from "next/navigation";
import { getCustomerLeadById } from "@/lib/customer-lead";
import sql from "@/lib/db";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type { CarInfo, CollateralIdentifier, CollateralType, CustomerInfo, LoanPurpose, RefinanceStatus } from "@/types/ratebook";

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

export async function createCustomerLeadOpportunity(
  leadId: string,
): Promise<CustomerLeadOpportunity> {
  const lead = await getCustomerLeadById(leadId);
  if (!lead) {
    throw new Error(`customer_lead not found: ${leadId}`);
  }

  const [row] = await sql`
    insert into customer_lead_opportunity (
      lead_id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method
    )
    values (
      ${lead.id}, ${lead.firstName}, ${lead.lastName}, ${lead.phone},
      ${lead.idCardNumber}, ${lead.ncbGrade}, ${lead.verificationMethod}
    )
    returning *
  `;

  return mapRow(row);
}

export async function createOpportunityAndRedirect(leadId: string): Promise<never> {
  const opportunity = await createCustomerLeadOpportunity(leadId);
  redirect(`/ratebook?opportunityId=${opportunity.id}`);
}

export async function updateOpportunityLoanQuestions(
  opportunityId: string,
  input: {
    loanPurpose: LoanPurpose;
    collateralType: CollateralType;
    refinanceStatus: RefinanceStatus;
  },
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      loan_purpose = ${input.loanPurpose},
      collateral_type = ${input.collateralType},
      refinance_status = ${input.refinanceStatus},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  return mapRow(row);
}

export async function updateOpportunityCustomerInfo(
  opportunityId: string,
  input: CustomerInfo,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      first_name = ${input.firstName},
      last_name = ${input.lastName},
      phone = ${input.phone},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  return mapRow(row);
}

export async function updateOpportunityCollateralDetail(
  opportunityId: string,
  input: { collateralIdentifier: CollateralIdentifier | null; brandModel: string },
): Promise<CustomerLeadOpportunity> {
  const identifier = input.collateralIdentifier;

  const [row] = await sql`
    update customer_lead_opportunity
    set
      license_plate_number = ${identifier?.licensePlateNumber ?? null},
      license_plate_province = ${identifier?.licensePlateProvince ?? null},
      chassis_number = ${identifier?.chassisNumber ?? null},
      brand_model = ${input.brandModel || null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  return mapRow(row);
}

export async function updateOpportunityCarInfo(
  opportunityId: string,
  input: CarInfo,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      car_brand = ${input.brand ?? null},
      car_model = ${input.model ?? null},
      car_year = ${input.year ?? null},
      car_condition = ${input.condition ?? null},
      car_doors = ${input.doors ?? null},
      car_type = ${input.carType ?? null},
      car_engine_cc = ${input.engineCc ?? null},
      car_transmission = ${input.transmission ?? null},
      car_body_type = ${input.bodyType ?? null},
      car_sub_model = ${input.subModel ?? null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  return mapRow(row);
}
