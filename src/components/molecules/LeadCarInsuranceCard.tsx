"use client";

import { Select } from "@/components/atoms/Select";
import { Card } from "@/components/molecules/Card";
import { insuranceCompanyOptions } from "@/lib/mock";
import { useState } from "react";

const PLACEHOLDER = { value: "", label: "เลือกข้อมูล" };

export function LeadCarInsuranceCard() {
  const [possessionDate, setPossessionDate] = useState("");
  const [carInsuranceExpiry, setCarInsuranceExpiry] = useState("");
  const [carInsuranceCompany, setCarInsuranceCompany] = useState("");
  const [compulsoryExpiry, setCompulsoryExpiry] = useState("");
  const [compulsoryBundledWithCarInsurance, setCompulsoryBundledWithCarInsurance] = useState(false);
  const [compulsoryCompany, setCompulsoryCompany] = useState("");

  return (
    <Card className="space-y-4">
      <h3 className="border-b border-divider pb-3 text-lg font-semibold text-primary-to">
        ข้อมูลรถ (ถ้ามี)
      </h3>

      <div>
        <label className="mb-1 block text-sm text-muted-foreground">วันที่ครอบครอง</label>
        <input
          type="date"
          value={possessionDate}
          onChange={(e) => setPossessionDate(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-secondary-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
        />
      </div>

      <div>
        <p className="mb-2 font-medium text-foreground">ประกันรถยนต์</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">วันหมดอายุกรมธรรม์</label>
            <input
              type="date"
              value={carInsuranceExpiry}
              onChange={(e) => setCarInsuranceExpiry(e.target.value)}
              className="w-full rounded-lg border border-secondary-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">บริษัทประกัน</label>
            <Select
              options={[PLACEHOLDER, ...insuranceCompanyOptions]}
              value={carInsuranceCompany}
              onChange={(e) => setCarInsuranceCompany(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 font-medium text-foreground">พ.ร.บ.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm text-muted-foreground">วันหมดอายุ</label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={compulsoryBundledWithCarInsurance}
                  onChange={(e) => setCompulsoryBundledWithCarInsurance(e.target.checked)}
                  className="size-4 rounded border-radio-border"
                />
                พร้อมประกันรถยนต์
              </label>
            </div>
            <input
              type="date"
              value={compulsoryExpiry}
              onChange={(e) => setCompulsoryExpiry(e.target.value)}
              disabled={compulsoryBundledWithCarInsurance}
              className="w-full rounded-lg border border-secondary-border bg-surface px-3 py-2 text-sm text-foreground outline-none disabled:bg-surface-muted disabled:text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">บริษัทประกัน</label>
            <Select
              options={[PLACEHOLDER, ...insuranceCompanyOptions]}
              value={compulsoryCompany}
              onChange={(e) => setCompulsoryCompany(e.target.value)}
              disabled={compulsoryBundledWithCarInsurance}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
