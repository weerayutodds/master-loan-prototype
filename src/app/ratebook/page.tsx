import { RatebookForm } from "@/components/organisms/RatebookForm";
import { getCustomerLeadOpportunityById } from "@/lib/customer-lead-opportunity";

type RatebookPageProps = {
  searchParams: Promise<{ opportunityId?: string }>;
};

export default async function RatebookPage({ searchParams }: RatebookPageProps) {
  const { opportunityId } = await searchParams;
  const initialOpportunity = opportunityId
    ? await getCustomerLeadOpportunityById(opportunityId)
    : null;

  return <RatebookForm initialOpportunity={initialOpportunity} />;
}
