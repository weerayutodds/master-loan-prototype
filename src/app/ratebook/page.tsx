import { RatebookForm } from "@/components/organisms/RatebookForm";
import { getCustomerLeadById } from "@/lib/customer-lead";

type RatebookPageProps = {
  searchParams: Promise<{ leadId?: string }>;
};

export default async function RatebookPage({ searchParams }: RatebookPageProps) {
  const { leadId } = await searchParams;
  const initialLead = leadId ? await getCustomerLeadById(leadId) : null;

  return <RatebookForm initialLead={initialLead} />;
}
