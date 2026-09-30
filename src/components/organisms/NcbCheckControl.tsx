"use client"

import {Badge} from "@/components/atoms/Badge"
import {Button} from "@/components/atoms/Button"
import {EncbCheckFlow} from "@/components/organisms/EncbCheckFlow"
import type {NcbGrade} from "@/types/customer-lead"
import {useState} from "react"

type NcbCheckControlProps = {
  ncbGrade: NcbGrade | null
  onChecked: (ncbGrade: NcbGrade) => unknown
  /** Shown on the flow's "กรุณาเสียบบัตรประชาชนผู้กู้" step. */
  customerName: string
  idCardNumber: string
  buttonVariant?: "primary" | "outline"
  buttonSize?: "xs" | "sm"
}

export function NcbCheckControl({
  ncbGrade,
  onChecked,
  customerName,
  idCardNumber,
  buttonVariant = "outline",
  buttonSize = "xs",
}: NcbCheckControlProps) {
  const [checking, setChecking] = useState(false)
  // Covers the gap until a server-rendered parent re-renders with the saved grade.
  const [checkedGrade, setCheckedGrade] = useState<NcbGrade | null>(null)
  const grade = ncbGrade ?? checkedGrade

  async function handleComplete(nextGrade: NcbGrade) {
    await onChecked(nextGrade)
    setCheckedGrade(nextGrade)
    setChecking(false)
  }

  if (grade) {
    return (
      <Badge tone="success" className="px-3 py-1 text-sm font-semibold">
        เกรด {grade}
      </Badge>
    )
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
      {checking ? (
        <EncbCheckFlow
          customerName={customerName}
          idCardNumber={idCardNumber}
          onCancel={() => setChecking(false)}
          onComplete={handleComplete}
        />
      ) : null}
    </>
  )
}
