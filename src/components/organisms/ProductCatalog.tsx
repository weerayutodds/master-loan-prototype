"use client";

import { Select } from "@/components/atoms/Select";
import { ProductCatalogCard } from "@/components/molecules/ProductCatalogCard";
import { EncbCheckFlow } from "@/components/organisms/EncbCheckFlow";
import { ProductDetailDrawer } from "@/components/organisms/ProductDetailDrawer";
import { SelectProductConfirmModal } from "@/components/organisms/SelectProductConfirmModal";
import { matchesProductLoanRequest } from "@/lib/product-loan-limits";
import { ncbGradeList } from "@/lib/mock";
import type { NcbGrade } from "@/types/customer-lead";
import type {
  ProductCatalogData,
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/types/product-catalog";
import { useState } from "react";

type ProductCatalogProps = {
  data: ProductCatalogData;
  /** Starts as `LoanCalBar`'s defaults, then follows whatever the user commits there. */
  filter: ProductCatalogFilter;
  /** Verified eNCB result; takes precedence over the local preview filter. */
  ncbGrade: NcbGrade | null;
  /** Same handler as the sidebar's "ตรวจ eNCB", so either button sets the one grade. */
  onNcbChecked: (ncbGrade: NcbGrade) => unknown;
  /** Shown on the eNCB flow's "กรุณาเสียบบัตรประชาชนผู้กู้" step. */
  customerName: string;
  idCardNumber: string;
  onSelectConfirmed?: (item: ProductCatalogItem) => void;
};

const ncbGradeOptions = [
  { label: "ทุกเกรด", value: "" },
  ...ncbGradeList.map(({ name, code }) => ({ label: name, value: code })),
];

/** Grades in a label like "A01, A02", "A01 - A03" or "U01-U03", with ranges expanded. */
function parseNcbGrades(label: string): Set<string> {
  const grades = new Set<string>();
  for (const [, letter, from, to] of label.matchAll(/([A-Z])(\d{2})(?:\s*-\s*[A-Z]?(\d{2}))?/g)) {
    for (let n = Number(from); n <= Number(to ?? from); n++) {
      grades.add(`${letter}${String(n).padStart(2, "0")}`);
    }
  }
  return grades;
}

/**
 * "ทุกเกรด" (no grades listed) accepts everyone; "Non …" / "Not …" / "ยกเว้น …" list the
 * grades that are excluded; anything else lists the only grades accepted.
 */
function acceptsNcbGrade(label: string, grade: NcbGrade): boolean {
  const grades = parseNcbGrades(label);
  if (grades.size === 0) return true;
  const isExclusion = /Non|Not|ยกเว้น/.test(label);
  return isExclusion ? !grades.has(grade) : grades.has(grade);
}

/** Numbers in a label like "80% - 130% LTV" or "100,000-200,000" as [min, max]. */
function parseRange(label: string): [number, number] {
  const values = (label.match(/\d[\d,]*(\.\d+)?/g) ?? []).map((value) =>
    Number(value.replace(/,/g, "")),
  );
  return values.length ? [Math.min(...values), Math.max(...values)] : [0, 0];
}

/**
 * วงเงินอนุมัติ filter:
 * - Single value (e.g. "905,600"): product must cover the request (approved ≥ requested).
 * - Range (e.g. "905,600 - 1,471,600"): วงเงินที่ขอ must fall inside that band inclusive.
 */
function meetsApprovedAmountRequest(label: string, requested: number): boolean {
  if (requested <= 0) return true
  const [min, max] = parseRange(label)
  if (min !== max) return min <= requested && requested <= max
  return max >= requested
}

/** How many grades a label accepts: "ทุกเกรด" = all, "Non …"/"ยกเว้น …" = all minus those. */
function acceptedNcbGradeCount(label: string): number {
  const grades = parseNcbGrades(label);
  if (grades.size === 0) return ncbGradeList.length;
  const isExclusion = /Non|Not|ยกเว้น/.test(label);
  return isExclusion
    ? ncbGradeList.filter(({ code }) => !grades.has(code)).length
    : grades.size;
}

const THAI_LEADING_CHARACTER = /^[\u0E00-\u0E7F]/;

/** Thai titles first (ก-ฮ), then everything else (a-z). */
function compareTitles(a: string, b: string): number {
  const aIsThai = THAI_LEADING_CHARACTER.test(a.trim());
  const bIsThai = THAI_LEADING_CHARACTER.test(b.trim());
  if (aIsThai !== bIsThai) return aIsThai ? -1 : 1;
  return a.localeCompare(b, aIsThai ? "th" : "en", { sensitivity: "base" });
}

/**
 * 1. NCB grade — with a grade, the closest match (fewest accepted grades) first;
 *    without one, the widest (ทุกเกรด, then most accepted grades) first.
 * 2. Lowest min annual interest. 3. Highest max %LTV. 4. Title, Thai before English.
 */
function compareProducts(ncbGrade: NcbGrade | null) {
  return (a: ProductCatalogItem, b: ProductCatalogItem): number => {
    const gradeCountDiff =
      acceptedNcbGradeCount(a.ncbGradeLabel) - acceptedNcbGradeCount(b.ncbGradeLabel);
    if (gradeCountDiff !== 0) return ncbGrade ? gradeCountDiff : -gradeCountDiff;
    if (a.minAnnualInterestPercent !== b.minAnnualInterestPercent) {
      return a.minAnnualInterestPercent - b.minAnnualInterestPercent;
    }
    if (a.maxLtvPercent !== b.maxLtvPercent) return b.maxLtvPercent - a.maxLtvPercent;
    return compareTitles(a.title, b.title);
  };
}

function matchesFilter(item: ProductCatalogItem, filter: ProductCatalogFilter): boolean {
  if (filter.bookStatus && item.bookStatusLabel !== filter.bookStatus) return false;
  if (!meetsApprovedAmountRequest(item.approvedAmount, filter.requestedAmount)) return false;
  return matchesProductLoanRequest(
    item.loanLimits,
    item.appraisalPrice,
    filter.requestedAmount,
    filter.requestedLtvPercent,
  );
}

export function ProductCatalog({
  data,
  filter,
  ncbGrade,
  onNcbChecked,
  customerName,
  idCardNumber,
  onSelectConfirmed,
}: ProductCatalogProps) {
  const [checkingNcb, setCheckingNcb] = useState(false);
  const [previewNcbGrade, setPreviewNcbGrade] = useState<NcbGrade | null>(null);
  const effectiveNcbGrade = ncbGrade ?? previewNcbGrade;
  // Previewing a grade does not satisfy a product's requirement for an NCB result.
  const items = data.items.map<ProductCatalogItem>((item) => {
    const requiresNcbCheck = ncbGrade === null && item.ncbGradeLabel.trim() !== "ทุกเกรด";
    return {
      ...item,
      primaryActionLabel: requiresNcbCheck ? "ตรวจ eNCB" : "เลือก",
      primaryActionVariant: requiresNcbCheck ? "outline" : "filled",
    };
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;
  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const detailItem = items.find((item) => item.id === detailItemId) ?? null;

  // The drawer is closed so the re-filtered list is visible once the grade arrives.
  function handleCheckNcb() {
    setDetailItemId(null);
    setCheckingNcb(true);
  }

  // A grade the product doesn't accept can't be approved, so those are dropped
  // outright rather than moved down to "ผลิตภัณฑ์อื่นที่น่าสนใจ".
  const gradeEligibleItems = effectiveNcbGrade
    ? items.filter((item) => acceptsNcbGrade(item.ncbGradeLabel, effectiveNcbGrade))
    : items;
  const byPriority = compareProducts(effectiveNcbGrade);
  const matchedItems = gradeEligibleItems
    .filter((item) => matchesFilter(item, filter))
    .sort(byPriority);
  const otherItems = gradeEligibleItems
    .filter((item) => !matchesFilter(item, filter))
    .sort(byPriority);

  function emptyMessage() {
    if (data.items.length === 0) return "ไม่มีผลิตภัณฑ์ที่ตรงตามเงื่อนไขของหลักประกันนี้";
    if (gradeEligibleItems.length === 0) return `ไม่มีผลิตภัณฑ์ที่รองรับ NCB เกรด ${effectiveNcbGrade}`;
    return "ไม่พบผลิตภัณฑ์ที่ตรงตามเงื่อนไข";
  }

  function renderCards(items: ProductCatalogItem[]) {
    return items.map((item) => (
      <ProductCatalogCard
        key={item.id}
        item={item}
        onSelect={() => setSelectedItemId(item.id)}
        onCheckNcb={handleCheckNcb}
        onViewDetail={() => setDetailItemId(item.id)}
      />
    ));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">ผลิตภัณฑ์ที่ตรงตามเงื่อนไขลูกค้า</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filter.bookStatus ? (
            <span className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
              {filter.bookStatus}
            </span>
          ) : null}
          {data.filterChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground"
              >
                {chip}
              </span>
            ))}
          {filter.wantsWheelCard ? (
            <span className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
              บัตรติดล้อ
            </span>
          ) : null}
          {filter.requestedLtvPercent > 0 ? (
            <span className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
              {filter.requestedLtvPercent} %LTV
            </span>
          ) : null}
          {ncbGrade ? (
            <span className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
              เกรด {ncbGrade}
            </span>
          ) : (
            <Select
              variant="compact"
              aria-label="กรองผลิตภัณฑ์ตามเกรด NCB"
              options={ncbGradeOptions}
              value={previewNcbGrade ?? ""}
              onChange={(event) => {
                const grade = ncbGradeList.find(({ code }) => code === event.target.value);
                setPreviewNcbGrade(grade?.code ?? null);
              }}
              className="font-medium"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {matchedItems.length === 0 ? (
          <p className="rounded-xl border-2 border-card-border bg-surface p-5 text-center text-sm text-muted-foreground shadow-primary-s">
            {emptyMessage()}
          </p>
        ) : (
          renderCards(matchedItems)
        )}
      </div>

      {otherItems.length > 0 ? (
        <>
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-divider" />
            <h3 className="text-sm font-semibold text-muted-foreground">ผลิตภัณฑ์อื่นที่น่าสนใจ</h3>
            <div className="h-px flex-1 bg-divider" />
          </div>
          <div className="space-y-4">{renderCards(otherItems)}</div>
        </>
      ) : null}

      <ProductDetailDrawer
        item={detailItem}
        onClose={() => setDetailItemId(null)}
        onSelect={() => setSelectedItemId(detailItemId)}
        onCheckNcb={handleCheckNcb}
      />

      {checkingNcb ? (
        <EncbCheckFlow
          customerName={customerName}
          idCardNumber={idCardNumber}
          onCancel={() => setCheckingNcb(false)}
          onComplete={async (grade) => {
            await onNcbChecked(grade);
            setCheckingNcb(false);
          }}
        />
      ) : null}

      <SelectProductConfirmModal
        open={selectedItemId !== null}
        onCancel={() => setSelectedItemId(null)}
        onConfirm={() => {
          if (selectedItem) onSelectConfirmed?.(selectedItem);
          setSelectedItemId(null);
          setDetailItemId(null);
        }}
      />
    </div>
  );
}
