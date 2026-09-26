import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Card } from "@/components/molecules/Card";
import { getCustomerLeadById, listCustomerLeads } from "@/lib/customer-lead";
import { formatThaiPhone, maskIdCardNumber } from "@/lib/format";

const LEAD_LIST_TABS = ["รายการ Lead", "รายการใบคำขอ", "รายการสัญญาสินเชื่อ"];

type CustomerLeadListPageProps = {
  searchParams: Promise<{ leadId?: string }>;
};

export default async function CustomerLeadListPage({
  searchParams,
}: CustomerLeadListPageProps) {
  const { leadId } = await searchParams;
  const [focusLead, leads] = await Promise.all([
    leadId ? getCustomerLeadById(leadId) : Promise.resolve(null),
    listCustomerLeads(),
  ]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← ข้อมูลลูกค้า
        </Link>
        <h1 className="text-xl font-semibold text-foreground">ข้อมูลลูกค้า</h1>
        <Icon name="menu" className="size-5 text-muted-foreground" />
      </div>

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
          {LEAD_LIST_TABS.map((tab, index) => (
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
          <Link
            href={`/ratebook?leadId=${focusLead.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            จัดสินเชื่อ
          </Link>
        ) : (
          <Button variant="primary" size="sm" disabled>
            จัดสินเชื่อ
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">รายการ Lead</h2>

        {leads.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-16 text-center">
            <Icon name="document" className="size-12 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">ไม่มีรายการ</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <Card
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatThaiPhone(lead.phone)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">เลขบัตรประชาชน</p>
                  <p className="text-sm text-foreground">
                    {lead.idCardNumber ? maskIdCardNumber(lead.idCardNumber) : "-"}
                  </p>
                </div>
                <Badge tone="success">เกรด {lead.ncbGrade}</Badge>
                <Link
                  href={`/ratebook?leadId=${lead.id}`}
                  className="inline-flex items-center justify-center rounded-lg border border-primary bg-surface px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  ทำรายการสินเชื่อ
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
