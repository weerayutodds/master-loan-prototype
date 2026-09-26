import {NavItem} from "@/components/molecules/NavItem"
import type {BranchUser, NavItem as NavItemType} from "@/types/dashboard"
import Image from "next/image"

type SidebarProps = {
  navItems: NavItemType[]
  user: BranchUser
}

export function Sidebar({navItems, user}: SidebarProps) {
  return (
    <aside className="relative flex w-70 shrink-0 flex-col overflow-hidden bg-sidebar">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-72 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.28),transparent_70%)]"
      />

      <div className="relative z-10">
        <Image
          src="/assets/sidebar/sidebar-top.svg"
          alt="TIDLOR Smart Branch"
          width={240}
          height={50}
          priority
          unoptimized
          className="h-auto w-full"
        />
      </div>

      <nav className="relative z-10 flex flex-1 flex-col gap-1 px-3">
        <p className="px-3 py-2 text-xs font-medium text-sidebar-muted">
          เมนูหลัก
        </p>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="relative z-10 flex items-center gap-3 border-t border-white/10 px-5 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {user.initials}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-sidebar-foreground">
            {user.name}
          </p>
          <p className="text-xs text-sidebar-muted">{user.branch}</p>
        </div>
      </div>
    </aside>
  )
}
