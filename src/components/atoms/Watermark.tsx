type WatermarkProps = {
  text?: string;
  className?: string;
};

/** Diagonal "อยู่ระหว่างการพัฒนา" banner. Parent needs `relative overflow-hidden`. */
export function Watermark({ text = "อยู่ระหว่างการพัฒนา", className = "" }: WatermarkProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none">
      <div className="flex w-[170%] -rotate-[30deg] items-center justify-center border-y-2 border-muted-foreground/50 py-2">
        <span
          className={`whitespace-nowrap font-extrabold tracking-[0.2em] text-muted-foreground/60 ${className || "text-lg"}`}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
