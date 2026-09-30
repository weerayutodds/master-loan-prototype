"use client"

import {Icon} from "@/components/atoms/Icon"
import type {NavItem as NavItemType} from "@/types/dashboard"
import Link from "next/link"
import {useState} from "react"
import {ErrorModal} from "../organisms/ErrorModal"

export function NavItem({href, label, icon, active}: NavItemType) {
  const [scanErrorOpen, setScanErrorOpen] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (label !== "หน้าแรก") {
      e.preventDefault()
      setScanErrorOpen(true)
    }
  }

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar ${
          active
            ? "bg-sidebar-active text-white"
            : "text-sidebar-foreground hover:bg-white/5"
        }`}
      >
        <Icon name={icon} className="size-5 shrink-0" />
        {label}
      </Link>
      <ErrorModal
        open={scanErrorOpen}
        onClose={() => setScanErrorOpen(false)}
        title="ระบบกำลังพัฒนา"
        description={`ฟังก์ชัน "${label}" กำลังอยู่ในช่วงการพัฒนา`}
        buttonText="ตกลง"
      />
    </>
  )
}