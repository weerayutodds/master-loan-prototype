import { Badge } from "@/components/atoms/Badge";
import { ProductGuidePlanCard } from "@/components/molecules/ProductGuidePlanCard";
import type { ProductGuideData } from "@/types/product-guide";

const CARD_TITLE_CLASSNAMES = [
  "product-guide-card-title-1",
  "product-guide-card-title-2",
  "product-guide-card-title-3",
];

type ProductGuideProps = {
  data: ProductGuideData;
};

export function ProductGuide({ data }: ProductGuideProps) {
  return (
    <div
      id="product-guide"
      className="product-guide-hero relative scroll-mt-32 overflow-hidden rounded-xl p-6 shadow-primary-s"
    >
      <div className="pointer-events-none absolute -top-16 left-[9%] size-64 rounded-full bg-primary blur-[100px] mix-blend-screen" />

      <div className="relative flex flex-wrap items-stretch justify-center gap-4">
        <div className="product-guide-ltv-box flex w-35 flex-col items-center gap-1 rounded-[10px_20px] border border-white/30 py-2 shadow-primary-xs">
          <span className="text-sm font-medium text-white">ราคาประเมิน</span>
          <span className="text-xl font-semibold text-accent-lime">
            {data.appraisalPrice.toLocaleString("th-TH")}
          </span>
          <Badge tone="info">100% LTV</Badge>
        </div>
        <div className="product-guide-ltv-box flex w-62.5 flex-col items-center gap-1 rounded-[10px_20px] border border-white/30 py-2 shadow-primary-xs">
          <span className="text-sm font-medium text-white">วงเงินที่จัดได้</span>
          <span className="text-xl font-semibold text-accent-lime">
            {data.approvedRange.min.toLocaleString("th-TH")} -{" "}
            {data.approvedRange.max.toLocaleString("th-TH")}
          </span>
          <div className="flex gap-1">
            {data.approvedLtvBadges.map((badge) => (
              <Badge key={badge} tone="info">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`relative mt-8 grid grid-cols-1 gap-4 ${
          data.plans.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        }`}
      >
        {data.plans.map((plan, index) => (
          <ProductGuidePlanCard
            key={plan.title}
            plan={plan}
            titleClassName={CARD_TITLE_CLASSNAMES[index % CARD_TITLE_CLASSNAMES.length]}
          />
        ))}
      </div>

      <div className="product-guide-disclaimer-box relative mt-6 flex flex-col items-center gap-1 rounded-[10px] border border-white/30 px-4 py-2 text-center shadow-primary-xs">
        <p className="text-sm font-medium text-accent-lime">
          ยอดอนุมัติเป็นเพียงการประมาณการเบื้องต้น
        </p>
        <p className="text-xs font-medium text-pale-blue">
          วงเงินอนุมัติสุดท้ายจะขึ้นอยู่กับยี่ห้อ รุ่นย่อย สภาพรถจริง และเอกสารประกอบการพิจารณา
          เมื่อมีการสร้างใบคำขอสินเชื่อ
        </p>
      </div>
    </div>
  );
}
