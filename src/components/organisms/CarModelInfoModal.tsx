import { Icon } from "@/components/atoms/Icon";
import { Modal } from "@/components/molecules/Modal";

type CarModelInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

const MOCK_MODEL = "COROLLA ALTIS";

const LEFT_COLUMN = [
  { label: "วันจดทะเบียน", value: "1 มกราคม 2553" },
  { label: "ประเภท", value: "รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน" },
  { label: "ยี่ห้อรถ", value: "TOYOTA" },
  { label: "สี", value: "เทา" },
  { label: "ยี่ห้อเครื่องยนต์", value: "TOYOTA" },
  { label: "อยู่ที่", value: "ข้างเครื่อง" },
  { label: "จำนวน", value: "4 สูบ 2494 ซีซี 109 แรงม้า" },
  { label: "น้ำหนักรถ", value: "2100 กก." },
  { label: "น้ำหนักรวม", value: "2100 กก." },
];

const MIDDLE_COLUMN_TOP = [
  { label: "เลขทะเบียน", value: "1กข XXXX" },
  { label: "( รย. 6 )", value: "" },
];

const MIDDLE_COLUMN_BOTTOM = [
  { label: "เลขตัวรถ", value: "AAAAAA12A1A123456" },
  { label: "เชื้อเพลิง", value: "ดีเซล" },
  { label: "จำนวนเพลา", value: "2 เพลา 4 ล้อ ยาง 4 เส้น" },
  { label: "ที่นั่ง", value: "12 คน" },
];

const RIGHT_COLUMN = [
  { label: "จังหวัด", value: "กรุงเทพมหานคร" },
  { label: "ลักษณะ", value: "นั่งสองตอนแวน" },
  { label: "รุ่นปี", value: "ค.ศ. 2010" },
  { label: "อยู่ที่", value: "กระจังหน้าตอนใน" },
];

function DocumentField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p>
      <span className="font-bold text-foreground">{label} </span>
      <span className="font-normal text-foreground">{value}</span>
    </p>
  );
}

export function CarModelInfoModal({ open, onClose }: CarModelInfoModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="lg" variant="info">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="w-full text-center text-xl font-semibold text-foreground">
            รุ่นรถตามที่ระบุในเล่ม
          </h2>
          <button type="button" onClick={onClose} aria-label="ปิด" className="shrink-0">
            <Icon name="close" className="size-5 text-muted-foreground" />
          </button>
        </div>

        <div className="rounded-lg bg-surface-muted py-4">
          <div className="mx-auto max-w-120.75 rounded-lg border border-border bg-surface p-4">
            <p className="mb-3 text-center text-sm font-semibold text-foreground">
              รายการจดทะเบียน
            </p>
            <div className="flex justify-between gap-2 text-[10px] font-bold leading-relaxed">
              <div className="min-w-0 flex-1 space-y-1">
                {LEFT_COLUMN.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                {MIDDLE_COLUMN_TOP.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
                <p className="relative">
                  <span className="font-bold text-primary">แบบ </span>
                  <span className="font-normal text-primary">{MOCK_MODEL}</span>
                  <span className="pointer-events-none absolute -inset-x-10 top-full z-20 mt-1 flex items-center justify-center">
                    <span className="rounded-full border-2 border-success bg-surface px-4 py-1 text-sm font-bold whitespace-nowrap text-primary shadow-lg">
                      แบบ {MOCK_MODEL}
                    </span>
                  </span>
                </p>
                {MIDDLE_COLUMN_BOTTOM.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                {RIGHT_COLUMN.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
