import {Icon} from "@/components/atoms/Icon"

export function DevelopmentBanner({
  message = "ข้อมูลตัวอย่าง อยู่ระหว่างการพัฒนา",
}: {
  message?: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-secondary-border bg-badge-warning-bg px-3 py-2.5">
      <span className="flex items-center pt-0.5">
        <Icon name="alert-triangle-solid" className="size-6 text-badge-warning-fg" />
      </span>
      <p className="flex-1 text-base font-medium leading-[160%] tracking-[0.01em] text-foreground">
        {message}
      </p>
    </div>
  )
}
