type WatermarkProps = {
  text?: string;
  className?: string;
  /** Band width (px number or CSS length). Defaults to the Figma 526.57px. */
  width?: number | string;
};

/** Diagonal "ข้อมูลตัวอย่าง / อยู่ระหว่างการพัฒนา" band. Parent needs `relative overflow-hidden`. */
export function Watermark({
  text = "อยู่ระหว่างการพัฒนา",
  className = "",
  width = 526.57,
}: WatermarkProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none">
      <div className="relative flex h-26.25 shrink-0 -rotate-[32.78deg] items-center justify-center border-y border-watermark-border py-3 opacity-15"
        style={{width}}
      >
        <div className="absolute inset-x-0 top-3 bottom-3 border-y border-watermark-border" />
        <p
          className={`text-center leading-[160%] tracking-[0.01em] text-black ${className || "text-lg"}`}
        >
          ข้อมูลตัวอย่าง
          <br />
          {text}
        </p>
      </div>
    </div>
  );
}
