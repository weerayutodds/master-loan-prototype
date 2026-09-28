import { RatebookForm } from "@/components/organisms/RatebookForm";
import { getCustomerLeadById } from "@/lib/customer-lead";
import { getCustomerLeadOpportunityById } from "@/lib/customer-lead-opportunity";

type RatebookPageProps = {
  searchParams: Promise<{ opportunityId?: string; leadId?: string }>;
};

export default async function RatebookPage({ searchParams }: RatebookPageProps) {
  const { opportunityId, leadId } = await searchParams;
  const initialOpportunity = opportunityId
    ? await getCustomerLeadOpportunityById(opportunityId)
    : null;
  // customer_lead.ncb_grade is the single source of truth for NCB grade, so it's
  // always read fresh here rather than trusting the opportunity's snapshot copy.
  const resolvedLeadId = initialOpportunity?.leadId ?? leadId ?? null;
  const initialLead = resolvedLeadId
    ? await getCustomerLeadById(resolvedLeadId)
    : null;

      if (opportunityId) {
    console.log("[ratebook] opened saved loan request", { opportunityId, initialOpportunity });
  }

  return (
    <RatebookForm
      initialOpportunity={initialOpportunity}
      initialLead={initialLead}
    />
  );
}
