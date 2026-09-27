"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopHeader } from "@/components/organisms/TopHeader";
import { currentUser, navItems } from "@/lib/mock";

const PAGE_TITLES: Record<string, string> = {
  "/ratebook": "ทำรายการสินเชื่อ",
  "/customer-form": "ตรวจสอบข้อมูลลูกค้า",
  "/customer-lead-list": "ข้อมูลลูกค้า",
};

const PageTitleOverrideContext = createContext<(title: string | null) => void>(
  () => {},
);

// Lets a page swap the shell's header title as its own state changes. Pass null
// to fall back to the pathname title.
export function usePageTitleOverride(title: string | null) {
  const setOverride = useContext(PageTitleOverrideContext);

  useEffect(() => {
    setOverride(title);
    return () => setOverride(null);
  }, [setOverride, title]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const basePageTitle = PAGE_TITLES[pathname];
  const pageTitle = basePageTitle ? titleOverride ?? basePageTitle : undefined;

  return (
    <div className="flex flex-1">
      {pageTitle ? null : <Sidebar navItems={navItems} user={currentUser} />}
      <div className="flex flex-1 flex-col">
        {pageTitle ? <TopHeader title={pageTitle} /> : null}
        <main
          className={`flex-1 space-y-6 py-8 ${pageTitle ? "bg-surface px-20" : "bg-surface-muted px-8"}`}
        >
          <PageTitleOverrideContext.Provider value={setTitleOverride}>
            {children}
          </PageTitleOverrideContext.Provider>
        </main>
      </div>
    </div>
  );
}
