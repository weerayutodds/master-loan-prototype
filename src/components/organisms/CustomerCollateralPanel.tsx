"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Input } from "@/components/atoms/Input";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { Card } from "@/components/molecules/Card";
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
import type { CarInfo, CollateralIdentifier, CustomerInfo } from "@/types/ratebook";

const TOTAL_SECTIONS = 4;

type CustomerCollateralPanelProps = {
  initialOpportunity?: CustomerLeadOpportunity | null;
  opportunityId: string | null;
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
  const [editingBrandModel, setEditingBrandModel] = useState(false);

  const idCardNumber = initialOpportunity?.idCardNumber ?? "";

  const filledSectionCount = [
    customer !== null,
    idCardNumber.trim() !== "",
    collateralIdentifier !== null,
    brandModel.trim() !== "",
  ].filter(Boolean).length;

  return (
    <Card className="space-y-4 border-2">
      {customer ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-start justify-between text-left"
        >
          <div>
            <p className="text-base font-medium text-foreground">
              {customer.firstName} {customer.lastName}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon name="phone" className="size-4" />
              {customer.phone}
            </div>
          </div>
          <ProgressRing value={filledSectionCount} total={TOTAL_SECTIONS} />
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">ข้อมูลลูกค้า</span>
          <Button variant="outline" size="xs" onClick={() => setModalOpen(true)}>
            เพิ่ม/แก้ไข
          </Button>
        </div>
      )}

      <div className="border-t border-divider" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">เลขบัตรประชาชน</span>
        <div className="flex items-center gap-2">
          {idCardNumber ? (
            <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
              {maskIdCardNumber(idCardNumber)}
            </Badge>
          ) : null}
          {initialOpportunity?.verificationMethod !== "card" ? (
            <Button variant="outline" size="xs" onClick={() => router.push("/customer-form")}>
              Dipchip
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">NCB เกรด</span>
        {initialOpportunity?.ncbGrade ? (
          <span className="text-sm font-medium text-foreground">
            เกรด {initialOpportunity.ncbGrade}
          </span>
        ) : (
          <Button variant="outline" size="xs" onClick={() => router.push("/customer-form")}>
            ตรวจ eNCB
          </Button>
        )}
      </div>

      <div className="border-t border-divider" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">ข้อมูลหลักประกัน</span>
        <Button variant="outline" size="xs">
          เพิ่ม/แก้ไข
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2.5">
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
          <Button variant="outline" size="xs" onClick={() => setCollateralModalOpen(true)}>
            เพิ่ม
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2.5">
        <span className="text-sm text-muted-foreground">ยี่ห้อ / รุ่น</span>
        {editingBrandModel ? (
          <Input
            autoFocus
            className="ml-2 h-8 w-32 bg-surface text-sm"
            value={brandModel}
            onChange={(event) => setBrandModel(event.target.value)}
            onBlur={() => setEditingBrandModel(false)}
          />
        ) : brandModel ? (
          <button
            type="button"
            onClick={() => setEditingBrandModel(true)}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {brandModel}
          </button>
        ) : (
          <Button variant="outline" size="xs" onClick={() => setEditingBrandModel(true)}>
            เพิ่ม
          </Button>
        )}
      </div>

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
        disabled={!customer}
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
