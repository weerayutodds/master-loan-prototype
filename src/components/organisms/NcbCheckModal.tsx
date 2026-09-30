"use client"

import {Icon} from "@/components/atoms/Icon"
import {Modal} from "@/components/molecules/Modal"
import Image from "next/image"
import {useEffect} from "react"

const CHECK_DURATION_MS = 2000

type NcbCheckModalProps = {
  open: boolean
  onComplete: () => unknown
}

/** The sidebar's "Dipchip" card read; "ตรวจ eNCB" uses `EncbCheckFlow` instead. */
export function NcbCheckModal({open, onComplete}: NcbCheckModalProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => onComplete(), CHECK_DURATION_MS)
    return () => clearTimeout(timer)
  }, [open])

  return (
    <Modal open={open} onClose={() => {}} size="lg">
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
  )
}
