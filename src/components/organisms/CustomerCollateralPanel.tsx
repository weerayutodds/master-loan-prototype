"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { Card } from "@/components/molecules/Card";
import { FormField } from "@/components/molecules/FormField";
import { CollateralDetailModal } from "@/components/organisms/CollateralDetailModal";
import { CustomerInfoModal } from "@/components/organisms/CustomerInfoModal";
import {
  updateOpportunityCarInfo,
  updateOpportunityCollateralDetail,
  updateOpportunityCustomerInfo,
} from "@/lib/actions/customer-lead-opportunity";
import { maskIdCardNumber } from "@/lib/format";
import { provinceOptions } from "@/lib/mock";
import type { CustomerLeadOpportunity } from "@/types/customer-lead-opportunity";
import type { CarInfo, CollateralIdentifier, CollateralType, CustomerInfo } from "@/types/ratebook";

const TOTAL_SECTIONS = 4;

type CustomerCollateralPanelProps = {
  initialOpportunity?: CustomerLeadOpportunity | null;
  opportunityId: string | null;
  collateralType: CollateralType | null;
  tags: string[];
  carInfo: CarInfo;
};

function formatCollateralIdentifier(identifier: CollateralIdentifier): string {
  if (identifier.licensePlateNumber && identifier.licensePlateProvince) {
    const province = provinceOptions.find(
      (option) => option.value === identifier.licensePlateProvince,
    );
    return `${identifier.licensePlateNumber} · ${province?.label ?? ""}`;
  }
  return identifier.chassisNumber ?? "";
}

export function CustomerCollateralPanel({
  initialOpportunity = null,
  opportunityId,
  collateralType,
  tags,
  carInfo,
}: CustomerCollateralPanelProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerInfo | null>(
    initialOpportunity
      ? {
          firstName: initialOpportunity.firstName,
          lastName: initialOpportunity.lastName,
          phone: initialOpportunity.phone,
        }
      : null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [collateralIdentifier, setCollateralIdentifier] = useState<CollateralIdentifier | null>(
    initialOpportunity &&
      (initialOpportunity.licensePlateNumber || initialOpportunity.chassisNumber)
      ? {
          licensePlateNumber: initialOpportunity.licensePlateNumber ?? undefined,
          licensePlateProvince: initialOpportunity.licensePlateProvince ?? undefined,
          chassisNumber: initialOpportunity.chassisNumber ?? undefined,
        }
      : null,
  );
  const [collateralModalOpen, setCollateralModalOpen] = useState(false);
  const [brandModel, setBrandModel] = useState(initialOpportunity?.brandModel ?? "");

  const idCardNumber = initialOpportunity?.idCardNumber ?? "";

  const filledSectionCount = [
    customer !== null,
    idCardNumber.trim() !== "",
    collateralIdentifier !== null,
    brandModel.trim() !== "",
  ].filter(Boolean).length;

  return (
    <Card className="space-y-4 border-2">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex w-full items-start justify-between text-left"
      >
        <div>
          <p className="text-base font-medium text-foreground">
            {customer ? `${customer.firstName} ${customer.lastName}` : "-"}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon name="phone" className="size-4" />
            {customer ? customer.phone : "-"}
          </div>
        </div>
        <ProgressRing value={filledSectionCount} total={TOTAL_SECTIONS} />
      </button>

      <div className="border-t border-dashed border-border" />

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">เลขบัตรประชาชน</span>
        <div className="flex items-center gap-2">
          <Badge tone={idCardNumber ? "success" : "neutral"} className="px-3 py-1 text-sm font-semibold">
            {idCardNumber ? maskIdCardNumber(idCardNumber) : "-"}
          </Badge>
          {initialOpportunity?.verificationMethod !== "card" ? (
            <Button variant="outline" size="sm" onClick={() => router.push("/customer-form")}>
              Dipchip
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">NCB เกรด</span>
        <Badge tone={initialOpportunity?.ncbGrade ? "success" : "neutral"}>
          {initialOpportunity?.ncbGrade ? `เกรด ${initialOpportunity.ncbGrade}` : "-"}
        </Badge>
      </div>

      <div className="border-t border-dashed border-border" />

      {collateralType ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">เลขทะเบียน / เลขตัวถัง</span>
          {collateralIdentifier ? (
            <button
              type="button"
              onClick={() => setCollateralModalOpen(true)}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {formatCollateralIdentifier(collateralIdentifier)}
            </button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setCollateralModalOpen(true)}>
              เพิ่ม
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm text-muted-foreground">
          กรุณาเลือกประเภทหลักประกัน
        </div>
      )}

      {collateralType ? (
        <FormField label="ยี่ห้อ / รุ่น">
          <div className="flex gap-2">
            <Input
              name="brandModel"
              defaultValue={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
            />
            <Button variant="outline" size="sm" className="shrink-0">
              เพิ่ม
            </Button>
          </div>
        </FormField>
      ) : (
        <div className="rounded-lg bg-surface-muted px-3 py-2.5 text-sm text-muted-foreground">
          กรุณาเลือกยี่ห้อ / รุ่น
        </div>
      )}

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} tone="primary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="border-t border-border" />

      <Button
        variant="primary"
        className="w-full"
        onClick={() => {
          if (!opportunityId) return;
          if (customer) void updateOpportunityCustomerInfo(opportunityId, customer);
          void updateOpportunityCollateralDetail(opportunityId, { collateralIdentifier, brandModel });
          void updateOpportunityCarInfo(opportunityId, carInfo);
        }}
      >
        บันทึก Lead
      </Button>

      <CustomerInfoModal
        open={modalOpen}
        initialValue={customer ?? undefined}
        onClose={() => setModalOpen(false)}
        onSave={(info) => {
          setCustomer(info);
          setModalOpen(false);
        }}
      />

      <CollateralDetailModal
        open={collateralModalOpen}
        initialValue={collateralIdentifier ?? undefined}
        onClose={() => setCollateralModalOpen(false)}
        onSave={(value) => {
          setCollateralIdentifier(value);
          setCollateralModalOpen(false);
        }}
      />
    </Card>
  );
}
