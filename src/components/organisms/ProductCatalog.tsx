"use client";

import { Icon } from "@/components/atoms/Icon";
import { ProductCatalogCard } from "@/components/molecules/ProductCatalogCard";
import { SelectProductConfirmModal } from "@/components/organisms/SelectProductConfirmModal";
import type { ProductCatalogData, ProductCatalogItem } from "@/types/product-catalog";
import { useState } from "react";

type ProductCatalogProps = {
  data: ProductCatalogData;
  onSelectConfirmed?: (item: ProductCatalogItem) => void;
};

export function ProductCatalog({ data, onSelectConfirmed }: ProductCatalogProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = data.items.find((item) => item.id === selectedItemId) ?? null;

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
          <span className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground">
            {data.gradeFilterLabel}
            <Icon name="arrow-down" className="size-3.5 text-muted-foreground" />
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.items.map((item) => (
          <ProductCatalogCard
            key={item.id}
            item={item}
            onSelect={() => setSelectedItemId(item.id)}
          />
        ))}
      </div>

      <SelectProductConfirmModal
        open={selectedItemId !== null}
        onCancel={() => setSelectedItemId(null)}
        onConfirm={() => {
          if (selectedItem) onSelectConfirmed?.(selectedItem);
          setSelectedItemId(null);
        }}
      />
    </div>
  );
}
