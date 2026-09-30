"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {LoadingToast} from "@/components/molecules/LoadingToast"
import {Modal} from "@/components/molecules/Modal"
import {formatThaiPhone} from "@/lib/format"
import {mockEncbCheck} from "@/lib/mock"
import type {NcbGrade} from "@/types/customer-lead"
import Image from "next/image"
import {useEffect, useState} from "react"

const CARD_READ_DURATION_MS = 2000

type Step = "insert-card" | "reading-card" | "consent" | "face" | "otp"

type EncbCheckFlowProps = {
  customerName: string
  idCardNumber: string
  onCancel: () => void
  onComplete: (ncbGrade: NcbGrade) => unknown
}

function noop() {}

/** Mount only while the check is running; unmounting resets it to the first step. */
export function EncbCheckFlow({
  customerName,
  idCardNumber,
  onCancel,
  onComplete,
}: EncbCheckFlowProps) {
  const [step, setStep] = useState<Step>("insert-card")
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (step !== "reading-card") return
    const timer = setTimeout(() => setStep("consent"), CARD_READ_DURATION_MS)
    return () => clearTimeout(timer)
  }, [step])

  async function handleConfirmOtp() {
    setConfirming(true)
    try {
      await onComplete(mockEncbCheck.ncbGrade)
    } finally {
      setConfirming(false)
    }
  }

  const isCardStep = step === "insert-card" || step === "reading-card"

  return (
    <>
      <Modal
        open={isCardStep}
        onClose={step === "insert-card" ? onCancel : noop}
        size="lg"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              กรุณาเสียบบัตรประชาชนผู้กู้
            </h2>
            <p className="text-base text-muted-foreground">
              เลขบัตรประชาชน : {idCardNumber || "-"}
            </p>
            <p className="text-base text-muted-foreground">
              {customerName || "-"}
            </p>
          </div>
          <button
            type="button"
            disabled={step === "reading-card"}
            onClick={() => setStep("reading-card")}
            className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-dashed border-secondary-border bg-surface-muted px-4 py-8 transition-colors hover:border-primary"
          >
            <Image
              src="/assets/images/dipchip.png"
              alt=""
              width={192}
              height={120}
              priority
              className="h-30 w-48 object-contain"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              เครื่องเสียบบัตร :
              <span className="inline-flex items-center gap-1 text-xs">
                <Icon name="check-circle-solid" className="size-4 text-success" />
                พร้อมใช้งาน
              </span>
            </span>
          </button>
        </div>
      </Modal>

      <LoadingToast
        open={step === "reading-card"}
        title="กำลังอ่านข้อมูลบัตร..."
        description="อย่าเพิ่งดึงบัตรออก จนกว่าจะเสร็จสิ้น"
      />

      <Modal open={step === "consent"} onClose={onCancel} variant="info">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-tag-amber text-3xl font-bold text-white">
            !
          </span>
          <h2 className="text-xl font-semibold text-foreground">
            ยินยอมการขอสินเชื่อและตรวจ eNCB
          </h2>
          <p className="text-base text-price-label">
            หมายเหตุ: ต้องได้รับความยินยอมก่อนจึงจะสามารถตรวจ eNCB ได้
          </p>
        </div>
        <div className="mt-8 flex gap-4">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onCancel}
          >
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => setStep("face")}
          >
            ยืนยัน
          </Button>
        </div>
      </Modal>

      <Modal open={step === "face"} onClose={noop} size="lg">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-xl font-semibold text-foreground">
            ยืนยันตัวตนด้วยใบหน้า
          </h2>
          <div className="w-full max-w-80 overflow-hidden rounded-2xl border-4 border-primary-to">
            <Image
              src="/assets/images/encb-face-verify.png"
              alt="ภาพยืนยันตัวตนด้วยใบหน้า"
              width={548}
              height={736}
              priority
              className="h-auto w-full"
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="min-w-40"
            onClick={() => setStep("otp")}
          >
            ถัดไป
          </Button>
        </div>
      </Modal>

      <Modal open={step === "otp"} onClose={noop} size="lg">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-xl font-semibold text-foreground">
            กรอกรหัส OTP เพื่อยืนยันตัวตน
          </h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-base text-foreground">
              เราได้ส่งรหัส OTP ไปที่เบอร์
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatThaiPhone(mockEncbCheck.otpPhone)}
            </p>
            <button
              type="button"
              disabled
              className="text-sm font-semibold text-primary underline disabled:cursor-not-allowed"
            >
              เปลี่ยนเบอร์
            </button>
          </div>
          <div className="flex gap-2">
            {mockEncbCheck.otpCode.split("").map((digit, index) => (
              <span
                key={index}
                className="flex size-12 items-center justify-center rounded-lg border border-secondary-border text-2xl font-medium text-foreground"
              >
                {digit}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Ref. {mockEncbCheck.otpRef} รหัสมีอายุการใช้งาน 5 นาที
          </p>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 text-base font-semibold text-primary disabled:cursor-not-allowed"
          >
            <Icon name="refresh" className="size-5" />
            ขอรหัส OTP ใหม่
          </button>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              disabled={confirming}
              onClick={handleConfirmOtp}
            >
              ยืนยัน
            </Button>
            <Button variant="secondary" size="lg" disabled>
              ยกเลิก
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
