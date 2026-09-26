import { Icon } from "@/components/atoms/Icon";
import { NavItem } from "@/components/molecules/NavItem";
import type { BranchUser, NavItem as NavItemType } from "@/types/dashboard";

type SidebarProps = {
  navItems: NavItemType[];
  user: BranchUser;
};

export function Sidebar({ navItems, user }: SidebarProps) {
  return (
    <aside className="flex w-70 shrink-0 flex-col bg-sidebar">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="leading-tight">
          <p className="text-base font-bold text-white">TIDLOR</p>
          <p className="text-[10px] tracking-wide text-sidebar-muted">
            SMART BRANCH
          </p>
        </div>
        <Icon name="bell" className="size-5 text-sidebar-muted" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <p className="px-3 py-2 text-xs font-medium text-sidebar-muted">
          เมนูหลัก
        </p>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
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
  );
}
