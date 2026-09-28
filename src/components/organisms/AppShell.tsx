"use client"

import {Sidebar} from "@/components/organisms/Sidebar"
import {TopHeader} from "@/components/organisms/TopHeader"
import {currentUser, navItems} from "@/lib/mock"
import {usePathname, useRouter} from "next/navigation"
import {createContext, useContext, useEffect, useState} from "react"

const PAGE_TITLES: Record<string, string> = {
  "/ratebook": "ทำรายการสินเชื่อ",
  "/customer-form": "ตรวจสอบข้อมูลลูกค้า",
  "/customer-lead-list": "ข้อมูลลูกค้า",
}

const PageTitleOverrideContext = createContext<(title: string | null) => void>(
  () => {},
)

// Lets a page swap the shell's header title as its own state changes. Pass null
// to fall back to the pathname title.
export function usePageTitleOverride(title: string | null) {
  const setOverride = useContext(PageTitleOverrideContext)

  useEffect(() => {
    setOverride(title)
    return () => setOverride(null)
  }, [setOverride, title])
}

export function AppShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const router = useRouter()
  const [titleOverride, setTitleOverride] = useState<string | null>(null)
  const basePageTitle = PAGE_TITLES[pathname]
  const pageTitle = basePageTitle ? (titleOverride ?? basePageTitle) : undefined

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        router.refresh()
      }
    }
    window.addEventListener("pageshow", handlePageShow)
    return () => window.removeEventListener("pageshow", handlePageShow)
  }, [router])

  return (
    <div className="flex flex-1">
      {pageTitle ? null : <Sidebar navItems={navItems} user={currentUser} />}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {pageTitle ? <TopHeader title={pageTitle} /> : null}
        <main
          className={`flex flex-col flex-1 py-8 ${pageTitle ? "bg-surface px-4 md:px-20" : "bg-surface-muted px-4 md:px-8"}`}
        >
          <div className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-341">
              <PageTitleOverrideContext.Provider value={setTitleOverride}>
                {children}
              </PageTitleOverrideContext.Provider>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
