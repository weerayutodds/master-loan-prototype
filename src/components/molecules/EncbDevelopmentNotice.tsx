export function EncbDevelopmentNotice() {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-badge-warning-bg px-6 py-3 text-center">
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
        <path
          d="M10.27 3.5a2 2 0 0 1 3.46 0l8.2 14.2A2 2 0 0 1 20.2 20.7H3.8a2 2 0 0 1-1.73-3l8.2-14.2Z"
          className="fill-accent-lime"
        />
        <path
          d="M12 9v4.5M12 16.75v.01"
          strokeWidth={2}
          strokeLinecap="round"
          className="stroke-icon-warning"
        />
      </svg>
      <p className="text-base font-semibold text-foreground">
        การตรวจ eNCB กำลังพัฒนาระบบ
      </p>
      <p className="text-sm text-foreground">
        มีการใช้งานง่ายๆ เพียง 4 ขั้นตอน
      </p>
    </div>
  )
}
