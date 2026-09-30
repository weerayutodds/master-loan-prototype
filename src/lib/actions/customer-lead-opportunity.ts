"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCustomerLeadById } from "@/lib/customer-lead";
import sql from "@/lib/db";
import {
  MOCK_OPPORTUNITY_BRANCH_NAME,
  MOCK_OPPORTUNITY_STAFF_CODE,
  MOCK_OPPORTUNITY_STAFF_NAME,
  mockKeyInCardCustomer,
} from "@/lib/mock";
import type { NcbGrade } from "@/types/customer-lead";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type { CarInfo, CarInsuranceInfo, CollateralIdentifier, CollateralType, CustomerInfo, LoanInfo, LoanPurpose, RefinanceStatus } from "@/types/ratebook";

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
    gender: row.gender,
    birthDate: row.birth_date ? row.birth_date.toISOString().slice(0, 10) : null,
    status: row.status,
    branchName: row.branch_name,
    referenceCode: row.reference_code,
    staffName: row.staff_name,
    staffCode: row.staff_code,
    loanPurpose: row.loan_purpose,
    collateralType: row.collateral_type,
    refinanceStatus: row.refinance_status,
    existingFinanceCompany: row.existing_finance_company,
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
    carRatebookCode: row.car_ratebook_code,
    carAppraisalPrice: row.car_appraisal_price,
    carRatebookPrice: row.car_ratebook_price,
    selectedProductId: row.selected_product_id,
    requestedAmount: row.requested_amount,
    wantsWheelCard: row.wants_wheel_card,
    hasPpi: row.has_ppi,
    installmentTerm: row.installment_term,
    possessionDate: row.possession_date,
    carInsuranceExpiry: row.car_insurance_expiry,
    carInsuranceCompany: row.car_insurance_company,
    compulsoryExpiry: row.compulsory_expiry,
    compulsoryBundledWithCarInsurance: row.compulsory_bundled_with_car_insurance,
    compulsoryCompany: row.compulsory_company,
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

  const referenceCode = `CF${Math.floor(100000 + Math.random() * 900000)}`;

  const [row] = await sql`
    insert into customer_lead_opportunity (
      lead_id, first_name, last_name, phone, id_card_number, ncb_grade, verification_method,
      gender, birth_date, branch_name, reference_code, staff_name, staff_code
    )
    values (
      ${lead.id}, ${lead.firstName}, ${lead.lastName}, ${lead.phone},
      ${lead.idCardNumber}, ${lead.ncbGrade}, ${lead.verificationMethod},
      ${lead.gender}, ${lead.birthDate}, ${MOCK_OPPORTUNITY_BRANCH_NAME}, ${referenceCode},
      ${MOCK_OPPORTUNITY_STAFF_NAME}, ${MOCK_OPPORTUNITY_STAFF_CODE}
    )
    returning *
  `;

  revalidatePath("/customer-lead-list");

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
    existingFinanceCompany: string | null;
  },
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      loan_purpose = ${input.loanPurpose},
      collateral_type = ${input.collateralType},
      refinance_status = ${input.refinanceStatus},
      existing_finance_company = ${input.existingFinanceCompany},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

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
      gender = ${input.gender ?? null},
      birth_date = ${input.birthDate ?? null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

  return mapRow(row);
}

/** Same as `updateCustomerLeadCardVerified`, on the opportunity's snapshot. */
export async function updateOpportunityCardVerified(
  opportunityId: string,
  idCardNumber: string = mockKeyInCardCustomer.idCardNumber,
): Promise<void> {
  await sql`
    update customer_lead_opportunity
    set
      verification_method = 'card',
      id_card_number = coalesce(nullif(id_card_number, ''), ${idCardNumber}),
      gender = coalesce(gender, ${mockKeyInCardCustomer.gender}),
      birth_date = coalesce(birth_date, ${mockKeyInCardCustomer.birthDate}::date),
      updated_at = now()
    where id = ${opportunityId}
  `;

  revalidatePath("/customer-lead-list");
}

/** Same card-verified side effect as `updateCustomerLeadNcbGrade`, on the opportunity's snapshot. */
export async function updateOpportunityNcbGrade(
  opportunityId: string,
  ncbGrade: NcbGrade,
  idCardNumber: string = mockKeyInCardCustomer.idCardNumber,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      ncb_grade = ${ncbGrade},
      verification_method = 'card',
      id_card_number = coalesce(nullif(id_card_number, ''), ${idCardNumber}),
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

  return mapRow(row);
}

export async function updateOpportunitySelectedProduct(
  opportunityId: string,
  productId: string,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      selected_product_id = ${productId},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

  return mapRow(row);
}

export async function updateOpportunityLoanInfo(
  opportunityId: string,
  input: LoanInfo,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      requested_amount = ${input.requestedAmount != null ? String(input.requestedAmount) : null},
      wants_wheel_card = ${input.wantsWheelCard ?? null},
      has_ppi = ${input.hasPpi ?? null},
      installment_term = ${input.installmentTerm != null ? String(input.installmentTerm) : null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

  return mapRow(row);
}

export async function updateOpportunityCarInsurance(
  opportunityId: string,
  input: CarInsuranceInfo,
): Promise<CustomerLeadOpportunity> {
  const [row] = await sql`
    update customer_lead_opportunity
    set
      possession_date = ${input.possessionDate ?? null},
      car_insurance_expiry = ${input.carInsuranceExpiry ?? null},
      car_insurance_company = ${input.carInsuranceCompany ?? null},
      compulsory_expiry = ${input.compulsoryExpiry ?? null},
      compulsory_bundled_with_car_insurance = ${input.compulsoryBundledWithCarInsurance ?? false},
      compulsory_company = ${input.compulsoryCompany ?? null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

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

  revalidatePath("/customer-lead-list");

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
      car_ratebook_code = ${input.ratebookCode ?? null},
      car_appraisal_price = ${input.appraisalPrice ?? null},
      car_ratebook_price = ${input.ratebookPrice ?? null},
      updated_at = now()
    where id = ${opportunityId}
    returning *
  `;

  revalidatePath("/customer-lead-list");

  return mapRow(row);
}
