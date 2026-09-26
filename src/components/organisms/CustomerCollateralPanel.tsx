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
import { maskIdCardNumber } from "@/lib/format";
import { provinceOptions } from "@/lib/mock";
import type { CustomerLead } from "@/types/customer-lead";
import type { CollateralIdentifier, CollateralType, CustomerInfo } from "@/types/ratebook";

const TOTAL_SECTIONS = 4;

type CustomerCollateralPanelProps = {
  initialLead?: CustomerLead | null;
  collateralType: CollateralType | null;
  tags: string[];
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
  initialLead = null,
  collateralType,
  tags,
}: CustomerCollateralPanelProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerInfo | null>(
    initialLead
      ? {
          firstName: initialLead.firstName,
          lastName: initialLead.lastName,
          phone: initialLead.phone,
        }
      : null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [collateralIdentifier, setCollateralIdentifier] = useState<CollateralIdentifier | null>(
    null,
  );
  const [collateralModalOpen, setCollateralModalOpen] = useState(false);
  const [brandModel, setBrandModel] = useState("");

  const idCardNumber = initialLead?.idCardNumber ?? "";

  const filledSectionCount = [
    customer !== null,
    idCardNumber.trim() !== "",
    collateralIdentifier !== null,
    brandModel.trim() !== "",
  ].filter(Boolean).length;

  if (!customer) {
    return (
      <Card className="space-y-4 border-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">ข้อมูลลูกค้า</span>
          <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
            เพิ่ม/แก้ไข
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลลูกค้า</p>

        <CustomerInfoModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={(info) => {
            setCustomer(info);
            setModalOpen(false);
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="space-y-4 border-2">
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

      <div className="border-t border-dashed border-border" />

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">เลขบัตรประชาชน</span>
        <div className="flex items-center gap-2">
          <Badge tone={idCardNumber ? "success" : "neutral"} className="px-3 py-1 text-sm font-semibold">
            {idCardNumber ? maskIdCardNumber(idCardNumber) : "-"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => router.push("/customer-form")}>
            Dipchip
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">NCB เกรด</span>
        <Badge tone={initialLead ? "success" : "neutral"}>
          {initialLead ? `เกรด ${initialLead.ncbGrade}` : "-"}
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
            <Input name="brandModel" onChange={(e) => setBrandModel(e.target.value)} />
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

      <Button variant="primary" className="w-full">
        บันทึก Lead
      </Button>

      <CustomerInfoModal
        open={modalOpen}
        initialValue={customer}
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
