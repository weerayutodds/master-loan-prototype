"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {EncbDevelopmentNotice} from "@/components/molecules/EncbDevelopmentNotice"
import {Modal} from "@/components/molecules/Modal"
import {formatThaiPhone} from "@/lib/format"
import {mockEncbCheck} from "@/lib/mock"
import type {NcbGrade} from "@/types/customer-lead"
import Image from "next/image"
import {useState} from "react"

const STEP_LABELS = [
  "เสียบบัตรและเลขหลังบัตร",
  "ยืนยันตัวตนด้วยใบหน้า",
  "ให้ความยินยอม",
  "OTP ยืนยันตัวตน",
]

type EncbCheckFlowProps = {
  customerName: string
  idCardNumber: string
  onCancel: () => void
  onComplete: (ncbGrade: NcbGrade) => unknown
}

/** Mount only while the check is running; unmounting resets it to the first step. */
export function EncbCheckFlow({
  customerName,
  idCardNumber,
  onCancel,
  onComplete,
}: EncbCheckFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [confirming, setConfirming] = useState(false)
  const isLastStep = stepIndex === STEP_LABELS.length - 1

  async function handleNext() {
    if (!isLastStep) {
      setStepIndex(stepIndex + 1)
      return
    }
    setConfirming(true)
    try {
      await onComplete(mockEncbCheck.ncbGrade)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Modal open onClose={onCancel} size="lg">
      <div className="relative flex flex-col items-center gap-4">
        <button
          type="button"
          aria-label="ปิด"
          onClick={onCancel}
          className="absolute -right-3 -top-3 text-muted-foreground hover:text-foreground"
        >
          <Icon name="close" className="size-6" />
        </button>

        <div className="w-full pt-4">
          <EncbDevelopmentNotice />
        </div>

        <div className="relative w-full max-w-sm">
          <div className="h-56 overflow-hidden rounded-2xl border-2 border-card-border bg-surface p-4 shadow-primary-s">
            {stepIndex === 0 ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    กรุณาเสียบบัตรประชาชนผู้กู้
                  </p>
                  <p className="text-xs text-muted-foreground">
                    เลขบัตรประชาชน : {idCardNumber || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {customerName || "-"}
                  </p>
                </div>
                <div className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-secondary-border bg-surface-muted px-4 py-5">
                  <Image
                    src="/assets/images/dipchip.png"
                    alt=""
                    width={128}
                    height={80}
                    priority
                    className="h-20 w-32 object-contain"
                  />
                  <span className="flex items-center gap-1 text-xs text-foreground">
                    เครื่องเสียบบัตร :
                    <Icon
                      name="check-circle-solid"
                      className="size-3.5 text-success"
                    />
                    พร้อมใช้งาน
                  </span>
                </div>
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-foreground">
                  ยืนยันตัวตนด้วยใบหน้า
                </p>
                <div className="w-44 overflow-hidden rounded-lg border-4 border-primary-to">
                  <Image
                    src="/assets/images/encb-face-verify.png"
                    alt="ภาพยืนยันตัวตนด้วยใบหน้า"
                    width={548}
                    height={736}
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium text-foreground">
                  ยินยอมตรวจ eNCB
                </p>
                <div className="space-y-2 rounded-2xl border border-secondary-border p-4 text-foreground">
                  <p className="text-lg font-semibold">
                    ข้อมูลส่วนบุคคลที่มีความสำคัญต่อการให้บริการ
                  </p>
                  <p className="text-sm leading-relaxed">
                    บริษัท เงินติดล้อ จำกัด (มหาชน) ซึ่งต่อไปนี้จะเรียกว่า
                    “บริษัทฯ” จัดทำบริการ Application NgernTidLor (เงินติดล้อ) นี้
                    เพื่อให้ข้อมูลเกี่ยวกับผลิตภัณฑ์และบริการต่าง ๆ ของบริษัทฯ
                    เพื่ออำนวยความสะดวกในการติดต่อสื่อสารระหว่างผู้ใช้บริการกับบริษัทฯ
                  </p>
                </div>
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-medium text-foreground">
                  กรอกรหัส OTP เพื่อยืนยันตัวตน
                </p>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-foreground">
                    เราได้ส่งรหัส OTP ไปที่เบอร์
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {formatThaiPhone(mockEncbCheck.otpPhone)}
                  </p>
                  <span className="text-sm font-semibold text-primary underline">
                    เปลี่ยนเบอร์
                  </span>
                </div>
                <div className="flex gap-2">
                  {Array.from({length: 6}, (_, index) => (
                    <span
                      key={index}
                      className="size-10 rounded-lg border border-secondary-border"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="pointer-events-none absolute -inset-x-2 -bottom-1 h-20 bg-linear-to-t from-surface to-transparent" />
        </div>

        <p className="flex items-center gap-2 text-base text-foreground">
          <span className="font-medium text-primary">
            {stepIndex + 1}/{STEP_LABELS.length}
          </span>
          {STEP_LABELS[stepIndex]}
        </p>

        <Button
          variant="primary"
          size="lg"
          className="min-w-40"
          disabled={confirming}
          onClick={handleNext}
        >
          {isLastStep ? "รับทราบ" : "ถัดไป"}
        </Button>
      </div>
    </Modal>
  )
}
