import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import type { NavItem as NavItemType } from "@/types/dashboard";

export function NavItem({ href, label, icon, active }: NavItemType) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-sidebar-active text-white"
          : "text-sidebar-foreground hover:bg-white/5"
      }`}
    >
      <Icon name={icon} className="size-5 shrink-0" />
      {label}
    </Link>
  );
}
