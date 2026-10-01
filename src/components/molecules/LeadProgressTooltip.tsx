type LeadProgressChecklistItem = {
  label: string
  filled: boolean
}

type LeadProgressTooltipProps = {
  filledCount: number
  total: number
  items: LeadProgressChecklistItem[]
}

export function LeadProgressTooltip({
  filledCount,
  total,
  items,
}: LeadProgressTooltipProps) {
  return (
    <div className="invisible absolute z-20 top-1/2 right-full mr-3 w-41 lg:right-auto lg:left-full lg:mr-0 lg:ml-3 -translate-y-3.5 rounded-lg bg-toast px-2 py-2 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover/progress:visible group-hover/progress:opacity-100">
      <span className="absolute top-3 -left-1.5 h-0 w-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-toast" />

      <p className="text-xs leading-[160%] tracking-[0.01em] text-white">
        ข้อมูลการจอง Lead {filledCount}/{total}
      </p>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 16 16"
              className={`size-4 shrink-0 ${item.filled ? "" : "opacity-20"}`}
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="8" className="fill-success" />
              <path
                d="M4.8 8.2 6.8 10.2 11.2 5.6"
                className="stroke-white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-xs leading-[160%] tracking-[0.01em] text-white">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
