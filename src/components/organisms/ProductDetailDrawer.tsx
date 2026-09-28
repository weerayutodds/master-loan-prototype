"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { ProductCatalogCondition, ProductCatalogItem } from "@/types/product-catalog";

const INTEREST_COLUMNS = ["NCB Grade / LTV", "ต่ำกว่า 50%", "50% - 60%", "60% ขึ้นไป"];

const TABLE_WRAPPER = "overflow-hidden rounded-lg border border-primary";
const HEADER_CELL = "px-4 py-2.5 text-left text-sm font-semibold text-foreground";
const BODY_CELL = "px-4 py-3 text-sm text-foreground";

function groupRowClassName(index: number) {
  return index % 2 === 0 ? "bg-catalog-card-bg" : "bg-surface";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-sm font-semibold text-primary-to">{children}</h3>;
}

function ConditionGrid({ title, items }: { title: string; items: ProductCatalogCondition[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p
              className={`text-sm font-medium ${
                item.tone === "success" ? "text-success" : "text-foreground"
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

type ProductDetailDrawerProps = {
  item: ProductCatalogItem | null;
  onClose: () => void;
  onSelect: () => void;
  onCheckNcb: () => void;
};

export function ProductDetailDrawer({
  item,
  onClose,
  onSelect,
  onCheckNcb,
}: ProductDetailDrawerProps) {
  const open = item !== null;

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!item) return null;
  const { detail } = item;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-foreground/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-5xl flex-col bg-surface shadow-secondary-m"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-divider px-4 py-3">
          <h2 className="text-lg font-semibold text-primary-to">{item.title}</h2>
          <div className="flex shrink-0 items-center gap-4">
            <Button variant="secondary" size="sm">
              <Icon name="document" className="mr-1 size-4" />
              ดูคู่มือการขาย
            </Button>
            <button type="button" onClick={onClose} aria-label="ปิด">
              <Icon name="close" className="size-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pt-4 pb-32">
          <section>
            <SectionTitle>%LTV สูงสุด</SectionTitle>
            <div className={TABLE_WRAPPER}>
              <table className="w-full table-fixed">
                <thead className="border-b border-card-border bg-surface">
                  <tr>
                    <th className={HEADER_CELL}>NCB Grade</th>
                    <th className={HEADER_CELL}>ระยะเวลาถือครอง</th>
                    <th className={HEADER_CELL}>วงเงิน</th>
                  </tr>
                </thead>
                {detail.ltvGroups.map((group, groupIndex) => (
                  <tbody key={group.ncbGrade} className={groupRowClassName(groupIndex)}>
                    {group.rows.map((row, rowIndex) => (
                      <tr key={row.holdingPeriod}>
                        <td className={BODY_CELL}>{rowIndex === 0 ? group.ncbGrade : null}</td>
                        <td className={BODY_CELL}>{row.holdingPeriod}</td>
                        <td className={BODY_CELL}>{row.limit}</td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
            <p className="mt-3 text-xs text-danger">
              *นอกเหนือจากเงื่อนไขนี้ จะเป็นงานนอกอำนาจทุกกรณี (วงเงินและวันครอบครอง)
            </p>
          </section>

          <section>
            <SectionTitle>ดอกเบี้ย</SectionTitle>
            <div className={TABLE_WRAPPER}>
              <table className="w-full table-fixed">
                <thead className="border-b border-card-border bg-surface">
                  <tr>
                    {INTEREST_COLUMNS.map((column) => (
                      <th key={column} className={HEADER_CELL}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.interestRows.map((row, index) => (
                    <tr key={row.ncbGrade} className={groupRowClassName(index)}>
                      <td className={BODY_CELL}>{row.ncbGrade}</td>
                      {row.rates.map((rate, rateIndex) => (
                        <td key={rateIndex} className={BODY_CELL}>
                          {rate}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ConditionGrid title="เงื่อนไขหลักประกัน - รถยนต์" items={detail.collateralConditions} />
          <div className="border-t border-divider pt-4">
            <ConditionGrid title="เงื่อนไขผู้กู้" items={detail.borrowerConditions} />
          </div>

          <div className="flex justify-end">
            <Button
              variant={item.primaryActionVariant === "filled" ? "primary" : "outline"}
              className="w-36"
              onClick={item.primaryActionVariant === "filled" ? onSelect : onCheckNcb}
            >
              {item.primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
