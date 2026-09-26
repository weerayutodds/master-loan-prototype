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
