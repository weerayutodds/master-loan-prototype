import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Card } from "@/components/molecules/Card";
import { createOpportunityAndRedirect } from "@/lib/actions/customer-lead-opportunity";
import { getCustomerLeadById } from "@/lib/customer-lead";
import { listCustomerLeadOpportunitiesByLeadId } from "@/lib/customer-lead-opportunity";
import { formatThaiPhone, maskIdCardNumber } from "@/lib/format";
import { collateralTypeOptions, loanPurposeOptions } from "@/lib/mock";

const LEAD_LIST_TABS = ["รายการ Lead", "รายการใบคำขอ", "รายการสัญญาสินเชื่อ"];

type CustomerLeadListPageProps = {
  searchParams: Promise<{ leadId?: string }>;
};

export default async function CustomerLeadListPage({
  searchParams,
}: CustomerLeadListPageProps) {
  const { leadId } = await searchParams;
  const [focusLead, opportunities] = await Promise.all([
    leadId ? getCustomerLeadById(leadId) : Promise.resolve(null),
    leadId ? listCustomerLeadOpportunitiesByLeadId(leadId) : Promise.resolve([]),
  ]);

  const isDipChip = focusLead?.verificationMethod === "card";
  const visibleTabs = isDipChip ? LEAD_LIST_TABS : LEAD_LIST_TABS.slice(0, 1);

  return (
    <>
      <Card className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-base font-semibold text-foreground">
            {focusLead ? `${focusLead.firstName} ${focusLead.lastName}` : "-"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">บุคคลธรรมดา</span>
            {focusLead?.idCardNumber ? (
              <Badge tone="success">
                <span className="inline-flex items-center gap-1">
                  <Icon name="check" className="size-3.5" />
                  Dip Chip
                </span>
              </Badge>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">เลขบัตรประชาชน</p>
          <p className="text-sm font-medium text-foreground">
            {focusLead?.idCardNumber ? maskIdCardNumber(focusLead.idCardNumber) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">เบอร์มือถือ</p>
          <p className="text-sm font-medium text-foreground">
            {focusLead ? formatThaiPhone(focusLead.phone) : "-"}
          </p>
        </div>
        <Button variant="primary" size="sm">
          ตรวจ eNCB
        </Button>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((tab, index) => (
            <span
              key={tab}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                index === 0
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
        {focusLead ? (
          <form action={createOpportunityAndRedirect.bind(null, focusLead.id)}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              จัดสินเชื่อ
            </button>
          </form>
        ) : (
          <Button variant="primary" size="sm" disabled>
            จัดสินเชื่อ
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">รายการ Lead</h2>

        {opportunities.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <Icon name="document" className="size-12 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">ไม่มีรายการ</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {opportunities.map((opportunity) => {
              const loanPurposeLabel = loanPurposeOptions.find(
                (option) => option.value === opportunity.loanPurpose,
              )?.label;
              const collateralTypeLabel = collateralTypeOptions.find(
                (option) => option.value === opportunity.collateralType,
              )?.label;

              return (
                <Card
                  key={opportunity.id}
                  className="flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {opportunity.firstName} {opportunity.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatThaiPhone(opportunity.phone)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ประเภทสินเชื่อ</p>
                    <p className="text-sm text-foreground">
                      {loanPurposeLabel ?? "-"} · {collateralTypeLabel ?? "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">วันที่ทำรายการ</p>
                    <p className="text-sm text-foreground">
                      {new Date(opportunity.createdAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  <Badge tone={opportunity.ncbGrade ? "success" : "neutral"}>
                    {opportunity.ncbGrade ? `เกรด ${opportunity.ncbGrade}` : "-"}
                  </Badge>
                  <Link
                    href={`/ratebook?opportunityId=${opportunity.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-primary bg-surface px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                    ทำรายการสินเชื่อ
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
