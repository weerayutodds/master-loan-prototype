import { Icon } from "@/components/atoms/Icon";
import { Modal } from "@/components/molecules/Modal";

type ChassisNumberInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

const MOCK_CHASSIS_NUMBER = "AAAAAA12A1A123456";

const LEFT_COLUMN = [
  { label: "วันจดทะเบียน", value: "1 มกราคม 2553" },
  { label: "ประเภท", value: "รถยนต์รับจ้าง" },
  { label: "ยี่ห้อรถ", value: "TOYOTA" },
  { label: "สี", value: "เทา" },
  { label: "ยี่ห้อเครื่องยนต์", value: "TOYOTA" },
  { label: "อยู่ที่", value: "ซ้ายเครื่อง" },
  { label: "จำนวน", value: "4 สูบ 2494 ซีซี" },
  { label: "น้ำหนักรถ", value: "2100 กก." },
  { label: "น้ำหนักรวม", value: "2100 กก." },
];

const MIDDLE_COLUMN = [
  { label: "เลขทะเบียน", value: "1กข XXXX" },
  { label: "(รย. 6)", value: "" },
  { label: "แบบ", value: "HIACE" },
  { label: "เลขตัวรถ", value: MOCK_CHASSIS_NUMBER, highlight: true },
  { label: "เลขเครื่องยนต์", value: "1AA-2XXXXXX" },
  { label: "เชื้อเพลิง", value: "ดีเซล" },
  { label: "เลขถังแก๊ส", value: "-" },
  { label: "จำนวนเพลา", value: "2 เพลา 4 ล้อ ยาง 4 เส้น" },
  { label: "น้ำหนักบรรทุก/น้ำหนักลงเพลา", value: "-" },
  { label: "ที่นั่ง", value: "7 คน" },
];

const RIGHT_COLUMN = [
  { label: "จังหวัด", value: "กรุงเทพมหานคร" },
  { label: "ลักษณะ", value: "ตู้นั่งสี่ตอน" },
  { label: "รุ่นปี", value: "ค.ศ. 2010" },
  { label: "อยู่ที่", value: "กระจังหน้าตอนใน" },
];

function DocumentField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <p className="whitespace-nowrap">
      <span className="text-foreground">{label} </span>
      <span className={highlight ? "text-primary" : "text-foreground"}>{value}</span>
    </p>
  );
}

export function ChassisNumberInfoModal({ open, onClose }: ChassisNumberInfoModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="lg" variant="info">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="w-full text-center text-xl font-semibold text-foreground">
            เลขตัวถังตามที่ระบุในเล่ม
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
            <div className="flex justify-between gap-4 text-[11px] font-bold leading-relaxed">
              <div className="space-y-1">
                {LEFT_COLUMN.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
              <div className="space-y-1">
                {MIDDLE_COLUMN.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
              <div className="space-y-1">
                {RIGHT_COLUMN.map((field) => (
                  <DocumentField key={field.label} {...field} />
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <span className="rounded-xl border-4 border-success bg-surface px-5 py-2 text-2xl font-bold text-primary">
                {MOCK_CHASSIS_NUMBER}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
