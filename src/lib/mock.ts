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

export const collateralTypeOptions: OptionCardData<CollateralType>[] = [
  { value: "motorcycle", label: "มอเตอร์ไซค์", icon: "motorcycle" },
  { value: "car", label: "เก๋ง กระบะ ตู้", icon: "car" },
  { value: "truck", label: "บรรทุก", icon: "truck" },
  { value: "land", label: "ที่ดิน", icon: "map-pin" },
];

export const refinanceStatusOptions: OptionCardData<RefinanceStatus>[] = [
  { value: "still-paying", label: "ยังผ่อนอยู่", description: "รีไฟแนนซ์" },
  { value: "paid-off", label: "ผ่อนหมดแล้ว", description: "ไม่ใช่รีไฟแนนซ์" },
];

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
