import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
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

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← หน้าแรก
        </Link>
        <h1 className="text-xl font-semibold text-foreground">ทำรายการสินเชื่อ</h1>
        <Icon name="menu" className="size-5 text-muted-foreground" />
      </div>

      <RatebookForm initialOpportunity={initialOpportunity} />
    </>
  );
}
