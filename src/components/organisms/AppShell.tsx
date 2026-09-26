"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopHeader } from "@/components/organisms/TopHeader";
import { currentUser, navItems } from "@/lib/mock";

const PAGE_TITLES: Record<string, string> = {
  "/ratebook": "ทำรายการสินเชื่อ",
  "/customer-form": "ตรวจสอบข้อมูลลูกค้า",
  "/customer-lead-list": "ข้อมูลลูกค้า",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname];

  return (
    <div className="flex flex-1">
      {pageTitle ? null : <Sidebar navItems={navItems} user={currentUser} />}
      <div className="flex flex-1 flex-col">
        {pageTitle ? <TopHeader title={pageTitle} /> : null}
        <main
          className={`flex-1 space-y-6 bg-surface-muted py-8 ${pageTitle ? "px-20" : "px-8"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
