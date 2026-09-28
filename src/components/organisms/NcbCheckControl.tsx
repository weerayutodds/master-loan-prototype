"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { NcbCheckModal } from "@/components/organisms/NcbCheckModal";
import type { NcbGrade } from "@/types/customer-lead";

type NcbCheckControlProps = {
  ncbGrade: NcbGrade | null;
  onChecked: (ncbGrade: NcbGrade) => unknown;
  buttonVariant?: "primary" | "outline";
  buttonSize?: "xs" | "sm";
  /** Dipchip-verified customers show "รอผล..." with a refresh button instead of "ตรวจ eNCB". */
  awaitingResult?: boolean;
};

export function NcbCheckControl({
  ncbGrade,
  onChecked,
  buttonVariant = "outline",
  buttonSize = "xs",
  awaitingResult = false,
}: NcbCheckControlProps) {
  const [checking, setChecking] = useState(false);
  // Covers the gap until a server-rendered parent re-renders with the saved grade.
  const [checkedGrade, setCheckedGrade] = useState<NcbGrade | null>(null);
  const grade = ncbGrade ?? checkedGrade;

  async function handleComplete(nextGrade: NcbGrade) {
    await onChecked(nextGrade);
    setCheckedGrade(nextGrade);
    setChecking(false);
  }

  if (grade) {
    return (
      <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
        เกรด {grade}
      </Badge>
    );
  }

  return (
    <>
      {awaitingResult ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">รอผล...</span>
          <Button variant="secondary" size="sm" onClick={() => setChecking(true)}>
            <Icon name="refresh" className="mr-1 size-3.5" />
            รีเฟรช
          </Button>
        </div>
      ) : (
        <Button variant={buttonVariant} size={buttonSize} onClick={() => setChecking(true)}>
          ตรวจ eNCB
        </Button>
      )}
      <NcbCheckModal open={checking} onComplete={handleComplete} />
    </>
  );
}
