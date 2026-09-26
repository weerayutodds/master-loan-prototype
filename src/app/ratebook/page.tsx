import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { CustomerCollateralPanel } from "@/components/organisms/CustomerCollateralPanel";
import { LoanQuestionsPanel } from "@/components/organisms/LoanQuestionsPanel";
import { getCustomerLeadById } from "@/lib/customer-lead";
import {
  collateralTypeOptions,
  loanPurposeOptions,
  refinanceStatusOptions,
} from "@/lib/mock";

type RatebookPageProps = {
  searchParams: Promise<{ leadId?: string }>;
};

export default async function RatebookPage({ searchParams }: RatebookPageProps) {
  const { leadId } = await searchParams;
  const initialLead = leadId ? await getCustomerLeadById(leadId) : null;

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← หน้าแรก
        </Link>
        <h1 className="text-xl font-semibold text-foreground">ทำรายการสินเชื่อ</h1>
        <Icon name="menu" className="size-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
        <CustomerCollateralPanel initialLead={initialLead} />
        <LoanQuestionsPanel
          loanPurposeOptions={loanPurposeOptions}
          collateralTypeOptions={collateralTypeOptions}
          refinanceStatusOptions={refinanceStatusOptions}
        />
      </div>
    </>
  );
}
