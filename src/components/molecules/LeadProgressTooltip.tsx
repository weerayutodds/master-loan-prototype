type LeadProgressChecklistItem = {
  label: string;
  filled: boolean;
};

type LeadProgressTooltipProps = {
  filledCount: number;
  total: number;
  items: LeadProgressChecklistItem[];
};

export function LeadProgressTooltip({
  filledCount,
  total,
  items,
}: LeadProgressTooltipProps) {
  return (
    <div className="invisible absolute top-1/2 left-full z-20 ml-3 w-41 -translate-y-1/2 rounded-lg bg-toast px-2 py-2 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover/progress:visible group-hover/progress:opacity-100">
      <span className="absolute top-3 -left-1 size-2 rotate-45 bg-toast" />
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
  );
}
