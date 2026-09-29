"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { MOCK_NCB_GRADE, NcbCheckModal } from "@/components/organisms/NcbCheckModal";
import type { NcbGrade } from "@/types/customer-lead";

type NcbCheckControlProps = {
  ncbGrade: NcbGrade | null;
  onChecked: (ncbGrade: NcbGrade) => unknown;
  buttonVariant?: "primary" | "outline";
  buttonSize?: "xs" | "sm";
  /** When set, "ตรวจ eNCB" only reads the card and then waits on "รีเฟรช" for the grade. */
  onCardRead?: () => unknown;
  /** Card already read (Dipchip-verified): "ตรวจ eNCB" goes straight to "รีเฟรช" without the card modal. */
  cardAlreadyRead?: boolean;
};

export function NcbCheckControl({
  ncbGrade,
  onChecked,
  buttonVariant = "outline",
  buttonSize = "xs",
  onCardRead,
  cardAlreadyRead = false,
}: NcbCheckControlProps) {
  const [checking, setChecking] = useState(false);
  const [cardRead, setCardRead] = useState(false);
  // Covers the gap until a server-rendered parent re-renders with the saved grade.
  const [checkedGrade, setCheckedGrade] = useState<NcbGrade | null>(null);
  const grade = ncbGrade ?? checkedGrade;

  async function applyGrade(nextGrade: NcbGrade) {
    await onChecked(nextGrade);
    setCheckedGrade(nextGrade);
  }

  async function handleComplete(nextGrade: NcbGrade) {
    if (onCardRead) {
      await onCardRead();
      setCardRead(true);
    } else {
      await applyGrade(nextGrade);
    }
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
      {cardRead ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">รอผล...</span>
          <Button variant="secondary" size="sm" onClick={() => applyGrade(MOCK_NCB_GRADE)}>
            <Icon name="refresh" className="mr-1 size-3.5" />
            รีเฟรช
          </Button>
        </div>
      ) : (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={() => (cardAlreadyRead ? setCardRead(true) : setChecking(true))}
        >
          ตรวจ eNCB
        </Button>
      )}
      <NcbCheckModal open={checking} onComplete={handleComplete} />
    </>
  );
}
