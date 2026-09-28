import {Badge} from "@/components/atoms/Badge"
import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {Card} from "@/components/molecules/Card"
import {CustomerLeadOpportunityCard} from "@/components/molecules/CustomerLeadOpportunityCard"
import {NcbCheckControl} from "@/components/organisms/NcbCheckControl"
import {updateCustomerLeadNcbGrade} from "@/lib/actions/customer-lead"
import {getCustomerLeadById} from "@/lib/customer-lead"
import {listCustomerLeadOpportunitiesByLeadId} from "@/lib/customer-lead-opportunity"
import {formatThaiPhone, maskIdCardNumber} from "@/lib/format"
import Image from "next/image"
import Link from "next/link"

const LEAD_LIST_TABS = ["รายการ Lead", "รายการใบคำขอ", "รายการสัญญาสินเชื่อ"]

type CustomerLeadListPageProps = {
  searchParams: Promise<{leadId?: string}>
}

export default async function CustomerLeadListPage({
  searchParams,
}: CustomerLeadListPageProps) {
  const {leadId} = await searchParams
  const [focusLead, opportunities] = await Promise.all([
    leadId ? getCustomerLeadById(leadId) : Promise.resolve(null),
    leadId
      ? listCustomerLeadOpportunitiesByLeadId(leadId)
      : Promise.resolve([]),
  ])
  console.log("focusLead, opportunities", {focusLead, opportunities})
  const isDipChip = focusLead?.verificationMethod === "card"
  const visibleTabs = isDipChip ? LEAD_LIST_TABS : LEAD_LIST_TABS.slice(0, 1)

  return (
    <div className="px-50 space-y-8">
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
                  <Icon name="check-circle-solid" className="size-4" />
                  Dip Chip
                </span>
              </Badge>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">เลขบัตรประชาชน</p>
          <p className="text-sm font-medium text-foreground">
            {focusLead?.idCardNumber
              ? maskIdCardNumber(focusLead.idCardNumber)
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">เบอร์มือถือ</p>
          <p className="text-sm font-medium text-foreground">
            {focusLead ? formatThaiPhone(focusLead.phone) : "-"}
          </p>
        </div>
        {focusLead ? (
          <NcbCheckControl
            ncbGrade={focusLead.ncbGrade}
            buttonVariant="primary"
            buttonSize="sm"
            onChecked={updateCustomerLeadNcbGrade.bind(null, focusLead.id)}
          />
        ) : (
          <Button variant="primary" size="sm" disabled>
            ตรวจ eNCB
          </Button>
        )}
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
          <Link
            href={`/ratebook?leadId=${focusLead.id}`}
            className="inline-flex min-w-20 items-center justify-center rounded-lg bg-[linear-gradient(150.46deg,var(--primary)_10%,var(--primary-to)_78.19%)] px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-95"
          >
            จัดสินเชื่อ
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex min-w-20 cursor-not-allowed items-center justify-center rounded-lg bg-surface-muted px-3 py-2 text-sm font-semibold text-muted-foreground"
          >
            จัดสินเชื่อ
          </button>
        )}
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-foreground">รายการ Lead</h2>

        {opportunities.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 p-2!">
            <Image
              src="/assets/images/no_data.png"
              alt=""
              width={64}
              height={64}
              priority
            />
            <p className="text-lg font-semibold text-foreground">ไม่มีรายการ</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {opportunities.map((opportunity) => (
              <CustomerLeadOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
