"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { NcbCheckModal } from "@/components/organisms/NcbCheckModal";
import type { NcbGrade } from "@/types/customer-lead";

type NcbCheckControlProps = {
  ncbGrade: NcbGrade | null;
  onChecked: (ncbGrade: NcbGrade) => unknown;
  buttonVariant?: "primary" | "outline";
  buttonSize?: "xs" | "sm";
};

export function NcbCheckControl({
  ncbGrade,
  onChecked,
  buttonVariant = "outline",
  buttonSize = "xs",
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
      <Button variant={buttonVariant} size={buttonSize} onClick={() => setChecking(true)}>
        ตรวจ eNCB
      </Button>
      <NcbCheckModal open={checking} onComplete={handleComplete} />
    </>
  );
}
