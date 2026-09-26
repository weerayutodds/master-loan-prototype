import type {
  BranchUser,
  FollowUpTask,
  NavItem,
  PerformanceStat,
  QuickAction,
} from "@/types/dashboard";
import type {
  CollateralType,
  LoanPurpose,
  OptionCardData,
  RefinanceStatus,
} from "@/types/ratebook";
import type {
  CardCustomerData,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form";
import type { ProductGuideData } from "@/types/product-guide";
import type { ProductCatalogData } from "@/types/product-catalog";
import type { FollowUpEntry } from "@/types/lead-content";

export const navItems: NavItem[] = [
  { href: "/", label: "หน้าแรก", icon: "home", active: true },
  { href: "/loans", label: "สินเชื่อ", icon: "credit-card" },
  { href: "/insurance", label: "ประกัน", icon: "shield" },
  { href: "/crm", label: "CRM", icon: "users" },
  { href: "/tasks", label: "งานติดตาม", icon: "calendar-check" },
  { href: "/encb", label: "eNCB", icon: "bar-chart" },
];

export const currentUser: BranchUser = {
  name: "สมหมาย รักงาน",
  branch: "สาขาลาดพร้าว",
  initials: "สก",
};

export const quickActions: QuickAction[] = [
  {
    title: "Ratebook",
    subtitle: "ตรวจสอบราคาประเมินรถ",
    href: "/ratebook",
  },
  {
    title: "eNCB",
    subtitle: "ตรวจสอบข้อมูลเครดิตบูโร",
    href: "/encb",
  },
];

export const followUpTasks: FollowUpTask[] = [
  {
    id: "1",
    title: "ติดตามหนี้ Lead 4390123450945905540",
    dueLabel: "Today",
    priority: "High",
  },
  {
    id: "2",
    title: "รายการจัดส่งเอกสารเข้าสำนักงานใหญ่",
    dueLabel: "Today",
    priority: "High",
  },
  {
    id: "3",
    title: "ติดตาม Lead 2304039423049023",
    dueLabel: "Today",
    priority: "High",
  },
];

export const loanPurposeOptions: OptionCardData<LoanPurpose>[] = [
  { value: "need-money", label: "ต้องการเงิน", description: "จำนำทะเบียน" },
  { value: "buy-car", label: "อยากซื้อรถ", description: "ซื้อ-ขาย ดีลเลอร์" },
];

export const provinceOptions: { value: string; label: string }[] = [
  { value: "bangkok", label: "กรุงเทพมหานคร" },
  { value: "nonthaburi", label: "นนทบุรี" },
  { value: "pathum-thani", label: "ปทุมธานี" },
  { value: "samut-prakan", label: "สมุทรปราการ" },
  { value: "chiang-mai", label: "เชียงใหม่" },
  { value: "chon-buri", label: "ชลบุรี" },
  { value: "nakhon-ratchasima", label: "นครราชสีมา" },
  { value: "khon-kaen", label: "ขอนแก่น" },
];

export const collateralTypeOptions: OptionCardData<CollateralType>[] = [
  { value: "motorcycle", label: "มอเตอร์ไซค์", image: "/assets/collateral/motorcycle.png" },
  { value: "car", label: "เก๋ง กระบะ ตู้", image: "/assets/collateral/car.png" },
  { value: "truck", label: "บรรทุก", image: "/assets/collateral/truck.png" },
  { value: "land", label: "ที่ดิน", image: "/assets/collateral/land.png" },
];

export const refinanceStatusOptions: OptionCardData<RefinanceStatus>[] = [
  { value: "still-paying", label: "ยังผ่อนอยู่", description: "รีไฟแนนซ์" },
  { value: "paid-off", label: "ผ่อนหมดแล้ว", description: "ไม่ใช่รีไฟแนนซ์" },
];

export const customerTypeOptions: { value: CustomerType; label: string }[] = [
  { value: "individual", label: "บุคคลธรรมดา" },
];

export const verificationMethodOptions: {
  value: VerificationMethod;
  label: string;
}[] = [
  { value: "card", label: "เสียบบัตรประชาชน" },
  { value: "manual", label: "กรอกข้อมูลเอง" },
];

export const carBrandOptions: { value: string; label: string }[] = [
  { value: "toyota", label: "Toyota" },
  { value: "honda", label: "Honda" },
  { value: "isuzu", label: "Isuzu" },
  { value: "nissan", label: "Nissan" },
  { value: "mazda", label: "Mazda" },
  { value: "ford", label: "Ford" },
  { value: "mitsubishi", label: "Mitsubishi" },
  { value: "suzuki", label: "Suzuki" },
];

export const carModelOptions: { value: string; label: string }[] = [
  { value: "vios", label: "Vios" },
  { value: "yaris", label: "Yaris" },
  { value: "city", label: "City" },
  { value: "civic", label: "Civic" },
  { value: "d-max", label: "D-Max" },
  { value: "almera", label: "Almera" },
  { value: "cx-5", label: "CX-5" },
  { value: "ranger", label: "Ranger" },
  { value: "triton", label: "Triton" },
  { value: "swift", label: "Swift" },
];

export const carYearOptions: { value: string; label: string }[] = Array.from(
  { length: 15 },
  (_, index) => {
    const year = 2024 - index;
    return { value: String(year), label: String(year) };
  },
);

export const carConditionOptions: { value: string; label: string }[] = [
  { value: "excellent", label: "ดีเยี่ยม" },
  { value: "good", label: "ดี" },
  { value: "fair", label: "พอใช้" },
  { value: "needs-repair", label: "ต้องซ่อมแซม" },
];

export const carDoorsOptions: { value: string; label: string }[] = [
  { value: "2", label: "2 ประตู" },
  { value: "4", label: "4 ประตู" },
  { value: "5", label: "5 ประตู" },
];

export const carTypeOptions: { value: string; label: string }[] = [
  { value: "sedan", label: "รถเก๋ง" },
  { value: "pickup", label: "รถกระบะ" },
  { value: "suv", label: "รถ SUV" },
  { value: "van", label: "รถตู้" },
  { value: "truck", label: "รถบรรทุก" },
];

export const carEngineCcOptions: { value: string; label: string }[] = [
  { value: "1000", label: "1000 ซีซี" },
  { value: "1200", label: "1200 ซีซี" },
  { value: "1500", label: "1500 ซีซี" },
  { value: "1800", label: "1800 ซีซี" },
  { value: "2000", label: "2000 ซีซี" },
  { value: "2500", label: "2500 ซีซี" },
  { value: "3000", label: "3000 ซีซี" },
];

export const carTransmissionOptions: { value: string; label: string }[] = [
  { value: "manual", label: "เกียร์ธรรมดา" },
  { value: "auto", label: "เกียร์อัตโนมัติ" },
];

export const carBodyTypeOptions: { value: string; label: string }[] = [
  { value: "sedan", label: "ซีดาน" },
  { value: "pickup", label: "กระบะ" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "รถตู้" },
  { value: "hatchback", label: "แฮทช์แบ็ก" },
];

export const carSubModelOptions: { value: string; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "sport", label: "Sport" },
  { value: "hybrid", label: "Hybrid" },
];

export const mockCardCustomer: CardCustomerData = {
  name: "สดใส สะอาดเอี่ยม",
  idCardNumber: "1-2345-67890-12-3",
};

export const performanceStats: PerformanceStat[] = [
  {
    label: "Total Sales",
    value: "฿4.2M",
    changeLabel: "12.4%",
    trend: "up",
  },
  {
    label: "Conversion Rate",
    value: "68.2%",
    changeLabel: "4.1%",
    trend: "up",
  },
  {
    label: "Pipeline Value",
    value: "฿12.8M",
    changeLabel: "2.4%",
    trend: "down",
  },
  {
    label: "Leads Contacted",
    value: "142",
    changeLabel: "8.7%",
    trend: "up",
  },
];

export const productGuideMock: ProductGuideData = {
  appraisalPrice: 570000,
  approvedRange: { min: 421000, max: 912000 },
  approvedLtvBadges: ["70% LTV", "160% LTV"],
  plans: [
    {
      title: "อนุมัติง่าย LTV ต่ำ",
      maxLtvLabel: "ไม่เกิน 70% LTV",
      maxAmount: 421000,
      bullets: [
        "NCB A01-A03 ได้สูงสุด 70%LTV",
        "วันครอบครอง 60-210 วัน ขึ้นอยู่กับเกรด NCB",
      ],
    },
    {
      title: "วงเงินสูง ความเสี่ยงปกติ",
      maxLtvLabel: "ไม่เกิน 130% LTV",
      maxAmount: 741000,
      bullets: ["เงื่อนไขขึ้นอยู่กับ NCB grade, LTV และวันครอบครอง"],
    },
    {
      title: "วงเงินสูง ดอกเบี้ยต่ำ ความเสี่ยงต่ำ",
      maxLtvLabel: "ไม่เกิน 160% LTV",
      maxAmount: 912000,
      bullets: ["NCB A01-A02", "เอกสารแสดงรายได้", "งานนอกอำนาจ"],
    },
  ],
};

export const productCatalogMock: ProductCatalogData = {
  filterChips: ["รถเก๋ง กระบะ 4 ประตู", "จำนำทะเบียน", "ไม่มีไฟแนนซ์", "บัตรติดลบ"],
  gradeFilterLabel: "ทุกเกรด",
  items: [
    {
      id: "no-transfer-low-risk",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงต่ำ",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "นอกอำนาจ", tone: "red" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
      ],
      ltvLabel: "92% LTV",
      approvedAmount: "524,400",
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      interestRateLabel: "(0.60% ต่อเดือน)",
      interestReductionLabel: "ลดต้นลดดอก 13% ต่อปี",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
    },
    {
      id: "high-limit-normal-risk",
      title: "โครงการวงเงินสูง ความเสี่ยงปกติ เก่ง กระบะ",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltvLabel: "80% - 130% LTV",
      approvedAmount: "456,000 - 741,000",
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      interestRateLabel: "(0.60% - 0.84% ต่อเดือน)",
      interestReductionLabel: "ลดต้นลดดอก 20% - 24% ต่อปี",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "easy-approval-low-ltv",
      title: "โครงการอนุมัติง่าย LTV ต่ำ เก่ง กระบะ",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "70% LTV", tone: "pink" },
      ],
      ltvLabel: "70% LTV",
      approvedAmount: "399,000",
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่มีเล่ม",
      interestRateLabel: "(0.94% - 1.13% ต่อเดือน)",
      interestReductionLabel: "ลดต้นลดดอก 20% - 24% ต่อปี",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
};

export const insuranceCompanyOptions: { value: string; label: string }[] = [
  { value: "viriyah", label: "วิริยะประกันภัย" },
  { value: "thipya", label: "ทิพยประกันภัย" },
  { value: "bkk-insurance", label: "กรุงเทพประกันภัย" },
];

export const followUpTimelineMock: FollowUpEntry[] = [
  {
    id: "1",
    timestamp: "28/04/2569 12:24",
    actor: "บันทึกโดย สมหมาย รักงาน (80012345)",
    statusBadge: "ติดตามแล้ว",
    note: "บันทึกผลการติดตาม • วันนัดหมาย 28/04/2569 12:00 น.\nไม่สะดวกคุย ให้ติดตามกลับตอนเที่ยง / แจ้งวงเงินแต่ของระยะเวลาตัดสินใจ 2-3 วัน ให้ติดตามกลับมาอีกที",
  },
  {
    id: "2",
    timestamp: "25/04/2569 12:00",
    actor: "บันทึกโดย สมหมาย รักงาน (80012345)",
    statusBadge: "ติดตามแล้ว",
    highlight: "TOYOTA • COLLOLA ALTIS • 2018(2555) • 1กก4567 • XDEEE4455977RD45",
  },
  {
    id: "3",
    timestamp: "23/04/2569 14:21",
    actor: "โดย อรอุมา โกสินทร์ (80010123)",
    actionBadge: "ส่งต่องาน",
    note: "หมายเหตุ\nลูกค้าสะดวกไปสาขาพระนครศรีอยุธยา ประมาณช่วงเที่ยง",
  },
  {
    id: "4",
    timestamp: "21/04/2569 16:04",
    actor: "โดย กรรณิการ์ ส่งจิต (CF108645)",
    actionBadge: "สร้าง Lead",
  },
];
