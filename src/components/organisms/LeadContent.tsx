"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { LeadCarInsuranceCard } from "@/components/molecules/LeadCarInsuranceCard";
import { LeadCollateralInfoCard } from "@/components/molecules/LeadCollateralInfoCard";
import { LeadFollowUpTimeline } from "@/components/molecules/LeadFollowUpTimeline";
import { LeadLoanInfoCard } from "@/components/molecules/LeadLoanInfoCard";
import { followUpTimelineMock } from "@/lib/mock";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type { ProductCatalogItem } from "@/types/product-catalog";
import type {
  CarInfo,
  CarInsuranceInfo,
  CollateralType,
  LoanInfo,
} from "@/types/ratebook";
import { useState } from "react";

const COLLATERAL_LOAN_LABEL: Record<string, string> = {
  motorcycle: "สินเชื่อรถจักรยานยนต์",
  car: "สินเชื่อรถยนต์",
  truck: "สินเชื่อรถบรรทุก",
  land: "สินเชื่อที่ดิน",
};

const TABS = [
  { key: "loan", label: "ข้อมูลสินเชื่อ" },
  { key: "history", label: "ประวัติการติดตาม" },
  { key: "lead", label: "ข้อมูล Lead" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function leadNoDisplay(opportunity: CustomerLeadOpportunity): string {
  return `L${opportunity.leadId.replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

type LeadContentProps = {
  initialOpportunity: CustomerLeadOpportunity;
  carInfo: CarInfo;
  collateralType: CollateralType | null;
  selectedProduct: ProductCatalogItem;
  loanInfo: LoanInfo;
  onLoanInfoChange: (value: LoanInfo) => void;
  carInsuranceInfo: CarInsuranceInfo;
  onCarInsuranceInfoChange: (value: CarInsuranceInfo) => void;
};

export function LeadContent({
  initialOpportunity,
  carInfo,
  collateralType,
  selectedProduct,
  loanInfo,
  onLoanInfoChange,
  carInsuranceInfo,
  onCarInsuranceInfoChange,
}: LeadContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("loan");
  // initialOpportunity.collateralType is the last-saved DB snapshot; the live
  // selection (not yet saved) is what the rest of the form is showing.
  const effectiveCollateralType = collateralType ?? initialOpportunity.collateralType;
  const loanLabel =
    COLLATERAL_LOAN_LABEL[effectiveCollateralType ?? "car"] ?? "สินเชื่อรถยนต์";

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-foreground">
              Lead No : {leadNoDisplay(initialOpportunity)}
            </span>
            <Badge tone="info" className="border border-primary-to/25 font-semibold">
              ติดตาม
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Icon name="calendar-check" className="size-4" />
              นัดหมาย
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              จัดการ Lead
              <Icon name="arrow-down" className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 border-b border-divider">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-semibold ${
                activeTab === tab.key
                  ? "border-b-2 border-primary-to text-primary-to"
                  : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "loan" && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{loanLabel}</p>
          <LeadCollateralInfoCard
            carInfo={carInfo}
            collateralType={effectiveCollateralType}
          />
          <LeadLoanInfoCard
            product={selectedProduct}
            value={loanInfo}
            onChange={onLoanInfoChange}
          />
          <LeadCarInsuranceCard value={carInsuranceInfo} onChange={onCarInsuranceInfoChange} />
          <LeadFollowUpTimeline entries={followUpTimelineMock} />
        </div>
      )}

      {activeTab === "history" && <LeadFollowUpTimeline entries={followUpTimelineMock} />}

      {activeTab === "lead" && (
        <div className="rounded-xl border border-card-border bg-surface p-6 text-sm text-muted-foreground shadow-primary-s">
          ข้อมูล Lead — อยู่ระหว่างการพัฒนา
        </div>
      )}
    </div>
  );
}
