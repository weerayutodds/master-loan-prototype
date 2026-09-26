"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { FormField } from "@/components/molecules/FormField";
import { CustomerInfoModal } from "@/components/organisms/CustomerInfoModal";
import type { CustomerInfo } from "@/types/ratebook";

const TOTAL_SECTIONS = 4;

export function CustomerCollateralPanel() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [brandModel, setBrandModel] = useState("");

  const filledSectionCount = [
    customer !== null,
    idCardNumber.trim() !== "",
    registrationNumber.trim() !== "",
    brandModel.trim() !== "",
  ].filter(Boolean).length;

  return (
    <Card className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            ข้อมูลลูกค้า
          </span>
          {!customer ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
            >
              เพิ่ม/แก้ไข
            </Button>
          ) : null}
        </div>
        {customer ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-2 flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:border-primary/40"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{customer.phone}</p>
            </div>
            <Badge tone="neutral">
              {filledSectionCount}/{TOTAL_SECTIONS}
            </Badge>
          </button>
        ) : null}
      </div>

      <FormField label="เลขบัตรประชาชน">
        <div className="flex gap-2">
          <Input name="idCardNumber" onChange={(e) => setIdCardNumber(e.target.value)} />
          <Button variant="outline" size="sm" className="shrink-0">
            Dipchip
          </Button>
        </div>
      </FormField>

      <FormField label="NCB เกรด">
        <div className="flex gap-2">
          <Input name="ncbGrade" />
          <Button variant="outline" size="sm" className="shrink-0">
            ตรวจ eNCB
          </Button>
        </div>
      </FormField>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          ข้อมูลหลักประกัน
        </span>
        <Button variant="outline" size="sm">
          เพิ่ม/แก้ไข
        </Button>
      </div>

      <FormField label="เลขทะเบียน / เลขตัวถัง">
        <div className="flex gap-2">
          <Input name="registrationNumber" onChange={(e) => setRegistrationNumber(e.target.value)} />
          <Button variant="outline" size="sm" className="shrink-0">
            เพิ่ม
          </Button>
        </div>
      </FormField>

      <FormField label="ยี่ห้อ / รุ่น">
        <div className="flex gap-2">
          <Input name="brandModel" onChange={(e) => setBrandModel(e.target.value)} />
          <Button variant="outline" size="sm" className="shrink-0">
            เพิ่ม
          </Button>
        </div>
      </FormField>

      <Button variant="primary" className="w-full" disabled={!customer}>
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
    </Card>
  );
}
