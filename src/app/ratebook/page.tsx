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

      if (opportunityId) {
    console.log("[ratebook] opened saved loan request", { opportunityId, initialOpportunity });
  }

  return <RatebookForm initialOpportunity={initialOpportunity} />;
}
