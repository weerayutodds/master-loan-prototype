"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Modal } from "@/components/molecules/Modal";
import type { NcbGrade } from "@/types/customer-lead";

const MOCK_NCB_GRADE: NcbGrade = "A02";
const CHECK_DURATION_MS = 2000;

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
  const [grade, setGrade] = useState(ncbGrade);

  useEffect(() => {
    if (!checking) return;
    const timer = setTimeout(async () => {
      await onChecked(MOCK_NCB_GRADE);
      setGrade(MOCK_NCB_GRADE);
      setChecking(false);
    }, CHECK_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  if (grade) {
    return (
      <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
        เกรด {grade}
      </Badge>
    );
  }

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setChecking(true)}
      >
        ตรวจ eNCB
      </Button>

      <Modal open={checking} onClose={() => {}} size="lg">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              เสียบบัตรประชาชน
            </h2>
            <p className="text-sm text-muted-foreground">
              เพื่อดึงข้อมูลอัตโนมัติ
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-success bg-surface px-2 py-0.5 text-xs font-medium text-success">
            <Icon name="check" className="size-3.5" />
            เชื่อมต่ออยู่
          </span>
          <Image
            src="/assets/images/dipchip.png"
            alt=""
            width={160}
            height={100}
            priority
            className="h-25 w-40 object-contain"
          />
        </div>
      </Modal>
    </>
  );
}
