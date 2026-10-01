"use client"

import {QuickActionCard} from "@/components/molecules/QuickActionCard"
import {ErrorModal} from "@/components/organisms/ErrorModal"
import type {QuickAction} from "@/types/dashboard"
import {useState} from "react"

type QuickActionsSectionProps = {
  actions: QuickAction[]
}

export function QuickActionsSection({actions}: QuickActionsSectionProps) {
  const [errorActionTitle, setErrorActionTitle] = useState<string | null>(null)

  const handleActionClick = (
    e: React.MouseEvent<HTMLDivElement>,
    title: string,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setErrorActionTitle(title)
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">
        Quick Actions & Shortcuts
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <div
            key={action.title}
            onClickCapture={(e) => handleActionClick(e, action.title)}
          >
            <QuickActionCard {...action} />
          </div>
        ))}
      </div>

      <ErrorModal
        open={!!errorActionTitle}
        onClose={() => setErrorActionTitle(null)}
        title="ระบบกำลังพัฒนา"
        description={`ฟังก์ชัน "${errorActionTitle}" กำลังอยู่ในช่วงการพัฒนา`}
        buttonText="ตกลง"
      />
    </section>
  )
}
