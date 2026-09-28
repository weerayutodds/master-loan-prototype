"use client";

import { Icon } from "@/components/atoms/Icon";
import { ProductCatalogCard } from "@/components/molecules/ProductCatalogCard";
import { ProductDetailDrawer } from "@/components/organisms/ProductDetailDrawer";
import { SelectProductConfirmModal } from "@/components/organisms/SelectProductConfirmModal";
import type {
  ProductCatalogData,
  ProductCatalogFilter,
  ProductCatalogItem,
} from "@/types/product-catalog";
import { useState } from "react";

type ProductCatalogProps = {
  data: ProductCatalogData;
  filter: ProductCatalogFilter | null;
  onSelectConfirmed?: (item: ProductCatalogItem) => void;
};

/** Numbers in a label like "80% - 130% LTV" or "100,000-200,000" as [min, max]. */
function parseRange(label: string): [number, number] {
  const values = (label.match(/\d[\d,]*(\.\d+)?/g) ?? []).map((value) =>
    Number(value.replace(/,/g, "")),
  );
  return values.length ? [Math.min(...values), Math.max(...values)] : [0, 0];
}

/**
 * Matches when the product is at or above the request (e.g. 200,000 for 150,000),
 * or when the request falls inside the product's range (e.g. 100,000-200,000 for 150,000).
 */
function meetsRequest(label: string, requested: number): boolean {
  if (requested <= 0) return true;
  const [min, max] = parseRange(label);
  const isAtOrAbove = min >= requested;
  const isWithinRange = min <= requested && requested <= max;
  return isAtOrAbove || isWithinRange;
}

function matchesFilter(item: ProductCatalogItem, filter: ProductCatalogFilter): boolean {
  if (filter.bookStatus && item.bookStatusLabel !== filter.bookStatus) return false;
  if (!meetsRequest(item.approvedAmount, filter.requestedAmount)) return false;
  if (!meetsRequest(item.ltvLabel, filter.requestedLtvPercent)) return false;
  return true;
}

export function ProductCatalog({ data, filter, onSelectConfirmed }: ProductCatalogProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = data.items.find((item) => item.id === selectedItemId) ?? null;
  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const detailItem = data.items.find((item) => item.id === detailItemId) ?? null;

  const matchedItems = filter ? data.items.filter((item) => matchesFilter(item, filter)) : data.items;
  const otherItems = filter ? data.items.filter((item) => !matchesFilter(item, filter)) : [];

  function renderCards(items: ProductCatalogItem[]) {
    return items.map((item) => (
      <ProductCatalogCard
        key={item.id}
        item={item}
        onSelect={() => setSelectedItemId(item.id)}
        onViewDetail={() => setDetailItemId(item.id)}
      />
    ));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">ผลิตภัณฑ์ที่ตรงตามเงื่อนไขลูกค้า</h2>
        <div className="flex flex-wrap items-center gap-2">
          {data.filterChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground"
            >
              {chip}
            </span>
          ))}
          {filter && filter.requestedLtvPercent > 0 ? (
            <span className="rounded-full border border-secondary-border bg-surface px-3 py-1 text-xs font-medium text-foreground">
              {filter.requestedLtvPercent} %LTV
            </span>
          ) : null}
          <span className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground">
            {data.gradeFilterLabel}
            <Icon name="arrow-down" className="size-3.5 text-muted-foreground" />
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {matchedItems.length === 0 ? (
          <p className="rounded-xl border-2 border-card-border bg-surface p-5 text-center text-sm text-muted-foreground shadow-primary-s">
            {data.items.length === 0
              ? "ไม่มีผลิตภัณฑ์ที่ตรงตามเงื่อนไขของหลักประกันนี้"
              : "ไม่พบผลิตภัณฑ์ที่ตรงตามเงื่อนไข"}
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
      />

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
