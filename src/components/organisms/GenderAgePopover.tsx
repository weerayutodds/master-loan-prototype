"use client"

import {Button} from "@/components/atoms/Button"
import {Icon} from "@/components/atoms/Icon"
import {calculateAge} from "@/lib/format"
import {genderOptions} from "@/lib/mock"
import type {Gender} from "@/types/customer-lead"
import {useState} from "react"

const MIN_AGE = 20

function getMaxBirthDate(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - MIN_AGE)
  return date.toISOString().slice(0, 10)
}

type GenderAgePopoverProps = {
  initialGender: Gender | null
  initialBirthDate: string | null
  onSave: (value: {gender: Gender; birthDate: string}) => void
  onCancel: () => void
}

export function GenderAgePopover({
  initialGender,
  initialBirthDate,
  onSave,
  onCancel,
}: GenderAgePopoverProps) {
  const [gender, setGender] = useState<Gender | null>(initialGender)
  const [birthDate, setBirthDate] = useState(initialBirthDate ?? "")

  const age = birthDate ? calculateAge(birthDate) : 0
  const isUnderMinAge = birthDate !== "" && age < MIN_AGE
  const canSave = gender !== null && birthDate !== "" && !isUnderMinAge

  return (
    <div className="relative w-66.5 rounded-[20px] border-2 border-card-border bg-surface p-4 shadow-primary-s">
      <p className="text-base font-medium text-foreground">
        ข้อมูลเพิ่มเติมสำหรับ PPI
      </p>

      <div className="mt-4">
        <span className="mb-1 block text-sm text-muted-foreground">เพศ</span>
        <div className="flex">
          {genderOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={`flex-1 border py-2 text-sm font-medium text-foreground ${
                index === 0 ? "rounded-l-lg" : "-ml-px rounded-r-lg"
              } ${
                gender === option.value
                  ? "z-10 border-2 border-primary"
                  : "border-secondary-border"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <span className="mb-1 block text-sm text-muted-foreground">
          วันเดือนปีเกิด
        </span>
        <div className="flex">
          <div className="flex flex-1 items-center gap-1 rounded-l-md border border-secondary-border bg-surface px-2 py-1.5">
            <input
              type="date"
              value={birthDate}
              max={getMaxBirthDate()}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full text-sm text-foreground outline-none"
            />
            <Icon name="calendar" className="size-4 shrink-0 text-unit-label" />
          </div>
          <div
            className={`flex w-12.5 shrink-0 items-center justify-center gap-1 rounded-r-md border border-l-0 bg-surface px-2 py-1.5 ${
              isUnderMinAge ? "border-danger" : "border-secondary-border"
            }`}
          >
            <span className="text-sm text-foreground">{age}</span>
            <span className="text-xs text-muted-foreground">ปี</span>
          </div>
        </div>
        {isUnderMinAge ? (
          <p className="mt-1 text-xs text-danger">
            อายุต้องไม่ต่ำกว่า {MIN_AGE} ปี
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex gap-4">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          ยกเลิก
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          disabled={!canSave}
          onClick={() => gender && onSave({gender, birthDate})}
        >
          บันทึก
        </Button>
      </div>

      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-r-2 border-b-2 border-card-border bg-surface" />
    </div>
  )
}
