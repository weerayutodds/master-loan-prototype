import type {
  BranchUser,
  FollowUpTask,
  NavItem,
  PerformanceStat,
  QuickAction,
} from "@/types/dashboard"
import type {
  CollateralType,
  LoanPurpose,
  OptionCardData,
  RefinanceStatus,
  VehicleBrandOption,
  VehicleCollateralType,
  VehicleModelOption,
  VehicleSubModelOption,
} from "@/types/ratebook"
import type {
  CardCustomerData,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form"
import type {ProductGuideData} from "@/types/product-guide"
import type {ProductCatalogData} from "@/types/product-catalog"
import type {FollowUpEntry} from "@/types/lead-content"

export const navItems: NavItem[] = [
  {href: "/", label: "หน้าแรก", icon: "home", active: true},
  {href: "/loans", label: "สินเชื่อ", icon: "credit-card"},
  {href: "/insurance", label: "ประกัน", icon: "shield"},
  {href: "/crm", label: "CRM", icon: "users"},
  {href: "/tasks", label: "งานติดตาม", icon: "calendar-check"},
  {href: "/encb", label: "eNCB", icon: "bar-chart"},
]

export const currentUser: BranchUser = {
  name: "สมหมาย รักงาน",
  branch: "สาขาลาดพร้าว",
  initials: "สก",
}

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
]

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
]

export const loanPurposeOptions: OptionCardData<LoanPurpose>[] = [
  {value: "need-money", label: "ต้องการเงิน", description: "จำนำทะเบียน"},
  {value: "buy-car", label: "อยากซื้อรถ", description: "ซื้อ-ขาย ดีลเลอร์"},
]

export const provinceOptions: {value: string; label: string}[] = [
  {value: "bangkok", label: "กรุงเทพมหานคร"},
  {value: "nonthaburi", label: "นนทบุรี"},
  {value: "pathum-thani", label: "ปทุมธานี"},
  {value: "samut-prakan", label: "สมุทรปราการ"},
  {value: "chiang-mai", label: "เชียงใหม่"},
  {value: "chon-buri", label: "ชลบุรี"},
  {value: "nakhon-ratchasima", label: "นครราชสีมา"},
  {value: "khon-kaen", label: "ขอนแก่น"},
]

export const collateralTypeOptions: OptionCardData<CollateralType>[] = [
  {
    value: "motorcycle",
    label: "มอเตอร์ไซค์",
    image: "/assets/collateral/motorcycle.png",
  },
  {value: "car", label: "เก๋ง กระบะ ตู้", image: "/assets/collateral/car.png"},
  {value: "truck", label: "บรรทุก", image: "/assets/collateral/truck.png"},
  {value: "land", label: "ที่ดิน", image: "/assets/collateral/land.png"},
]

export const refinanceStatusOptions: OptionCardData<RefinanceStatus>[] = [
  {value: "still-paying", label: "ยังผ่อนอยู่", description: "รีไฟแนนซ์"},
  {value: "paid-off", label: "ผ่อนหมดแล้ว", description: "ไม่ใช่รีไฟแนนซ์"},
]

export const customerTypeOptions: {value: CustomerType; label: string}[] = [
  {value: "individual", label: "บุคคลธรรมดา"},
]

export const verificationMethodOptions: {
  value: VerificationMethod
  label: string
}[] = [
  {value: "card", label: "เสียบบัตรประชาชน"},
  {value: "manual", label: "กรอกข้อมูลเอง"},
]

function subModels(
  entries: [string, string][],
): VehicleSubModelOption[] {
  return entries.map(([value, label]) => ({value, label}))
}

function model(
  value: string,
  label: string,
  entries: [string, string][],
): VehicleModelOption {
  return {value, label, subModels: subModels(entries)}
}

function brand(
  value: string,
  label: string,
  models: VehicleModelOption[],
): VehicleBrandOption {
  return {value, label, models}
}

export const vehicleCatalogByCollateralType: Record<
  VehicleCollateralType,
  VehicleBrandOption[]
> = {
  car: [
    brand("toyota", "Toyota", [
      model("vios", "Vios", [
        ["1.5-j", "1.5 J"],
        ["1.5-e", "1.5 E"],
        ["1.5-g", "1.5 G"],
      ]),
      model("yaris", "Yaris", [
        ["entry", "1.2 Entry"],
        ["sport", "1.2 Sport"],
        ["premium", "1.2 Premium"],
      ]),
      model("fortuner", "Fortuner", [
        ["standard", "2.4 Standard"],
        ["legender", "2.8 Legender"],
      ]),
      model("hilux-revo", "Hilux Revo", [
        ["standard-cab", "Standard Cab"],
        ["smart-cab", "Smart Cab"],
        ["double-cab", "Double Cab"],
      ]),
    ]),
    brand("honda", "Honda", [
      model("city", "City", [
        ["s", "S"],
        ["v", "V"],
        ["sv", "SV"],
      ]),
      model("civic", "Civic", [
        ["el", "EL"],
        ["rs", "RS"],
        ["hatchback-rs", "Hatchback RS"],
      ]),
      model("cr-v", "CR-V", [
        ["e", "E"],
        ["el", "EL"],
        ["se", "SE"],
      ]),
    ]),
    brand("isuzu", "Isuzu", [
      model("d-max", "D-Max", [
        ["spark", "Spark"],
        ["hi-lander", "Hi-Lander"],
        ["v-cross", "V-Cross"],
      ]),
      model("mu-x", "MU-X", [
        ["standard", "Standard"],
        ["ultimate", "Ultimate"],
      ]),
    ]),
    brand("nissan", "Nissan", [
      model("almera", "Almera", [
        ["e", "E"],
        ["v", "V"],
        ["vl", "VL"],
      ]),
      model("navara", "Navara", [
        ["calibre", "Calibre"],
        ["pro-4x", "Pro-4X"],
      ]),
    ]),
    brand("mazda", "Mazda", [
      model("mazda2", "Mazda2", [
        ["s", "S"],
        ["sports-high", "Sports High"],
      ]),
      model("cx-5", "CX-5", [
        ["c", "C"],
        ["sp", "SP"],
      ]),
      model("bt-50", "BT-50", [
        ["standard-cab", "Standard Cab"],
        ["double-cab", "Double Cab"],
      ]),
    ]),
    brand("ford", "Ford", [
      model("ranger", "Ranger", [
        ["xl", "XL"],
        ["xlt", "XLT"],
        ["wildtrak", "Wildtrak"],
      ]),
      model("everest", "Everest", [
        ["ambiente", "Ambiente"],
        ["titanium", "Titanium"],
      ]),
    ]),
    brand("mitsubishi", "Mitsubishi", [
      model("triton", "Triton", [
        ["glx", "GLX"],
        ["gls", "GLS"],
        ["athlete", "Athlete"],
      ]),
      model("xpander", "Xpander", [
        ["gls", "GLS"],
        ["ultimate", "Ultimate"],
      ]),
    ]),
    brand("suzuki", "Suzuki", [
      model("swift", "Swift", [
        ["ga", "GA"],
        ["gl", "GL"],
      ]),
      model("ciaz", "Ciaz", [
        ["gl", "GL"],
        ["glx", "GLX"],
      ]),
    ]),
  ],
  motorcycle: [
    brand("honda", "Honda", [
      model("wave110i", "Wave110i", [
        ["standard", "Standard"],
        ["fi", "Fi"],
      ]),
      model("click160i", "Click160i", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ]),
      model("pcx160", "PCX160", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ]),
      model("cbr150r", "CBR150R", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ]),
    ]),
    brand("yamaha", "Yamaha", [
      model("fino", "Fino", [
        ["standard", "Standard"],
        ["premium", "Premium"],
      ]),
      model("aerox155", "Aerox155", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ]),
      model("nmax", "NMAX", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ]),
      model("exciter155vva", "Exciter155VVA", [
        ["standard", "Standard"],
        ["gp", "GP"],
      ]),
    ]),
    brand("suzuki", "Suzuki", [
      model("smash", "Smash", [["standard", "Standard"]]),
      model("address110", "Address110", [["standard", "Standard"]]),
      model("gsx-r150", "GSX-R150", [["standard", "Standard"]]),
    ]),
    brand("kawasaki", "Kawasaki", [
      model("ninja250", "Ninja250", [
        ["standard", "Standard"],
        ["se", "SE"],
      ]),
      model("z250", "Z250", [["standard", "Standard"]]),
      model("klx150", "KLX150", [["standard", "Standard"]]),
    ]),
    brand("vespa", "Vespa", [
      model("primavera150", "Primavera150", [["standard", "Standard"]]),
      model("sprint150", "Sprint150", [["standard", "Standard"]]),
      model("gts300", "GTS300", [["standard", "Standard"]]),
    ]),
    brand("gpx", "GPX", [
      model("demon150gr", "Demon150GR", [["standard", "Standard"]]),
      model("legend250", "Legend250", [["standard", "Standard"]]),
    ]),
  ],
  truck: [
    brand("isuzu", "Isuzu", [
      model("ftr", "FTR", [
        ["4x2", "4x2"],
        ["6x2", "6x2"],
      ]),
      model("fvr", "FVR", [
        ["6x2", "6x2"],
        ["6x4", "6x4"],
      ]),
      model("elf", "ELF", [["standard", "Standard"]]),
    ]),
    brand("hino", "Hino", [
      model("300-series", "300 Series", [
        ["standard", "Standard"],
        ["wide-cab", "Wide Cab"],
      ]),
      model("500-series", "500 Series", [
        ["4x2", "4x2"],
        ["6x2", "6x2"],
      ]),
      model("700-series", "700 Series", [["6x4", "6x4"]]),
    ]),
    brand("fuso", "Mitsubishi Fuso", [
      model("fighter", "Fighter", [["standard", "Standard"]]),
      model("canter", "Canter", [["standard", "Standard"]]),
    ]),
    brand("volvo", "Volvo Trucks", [
      model("fm", "FM", [
        ["4x2", "4x2"],
        ["6x4", "6x4"],
      ]),
      model("fh", "FH", [["6x4", "6x4"]]),
    ]),
    brand("scania", "Scania", [
      model("p-series", "P-series", [["standard", "Standard"]]),
      model("r-series", "R-series", [["standard", "Standard"]]),
    ]),
    brand("ud", "UD Trucks", [
      model("quon", "Quon", [["standard", "Standard"]]),
      model("condor", "Condor", [["standard", "Standard"]]),
    ]),
    brand("hyundai", "Hyundai", [
      model("mighty", "Mighty", [["standard", "Standard"]]),
      model("hd", "HD", [["standard", "Standard"]]),
    ]),
  ],
}

export const carTypeOptionsByCollateralType: Record<
  VehicleCollateralType,
  {value: string; label: string}[]
> = {
  car: [
    {value: "sedan", label: "รถเก๋ง"},
    {value: "pickup", label: "รถกระบะ"},
    {value: "suv", label: "รถ SUV"},
    {value: "van", label: "รถตู้"},
  ],
  truck: [
    {value: "4-wheel", label: "รถบรรทุก 4 ล้อ"},
    {value: "6-wheel", label: "รถบรรทุก 6 ล้อ"},
    {value: "10-wheel", label: "รถบรรทุก 10 ล้อ"},
    {value: "trailer", label: "รถพ่วง"},
  ],
  motorcycle: [
    {value: "family", label: "ครอบครัว"},
    {value: "scooter", label: "สกู๊ตเตอร์ออโตเมติก"},
    {value: "sport", label: "สปอร์ต"},
    {value: "big-bike", label: "บิ๊กไบค์"},
    {value: "adv", label: "ADV/Adventure"},
  ],
}

export const carBodyTypeOptionsByCollateralType: Record<
  VehicleCollateralType,
  {value: string; label: string}[]
> = {
  car: [
    {value: "sedan", label: "ซีดาน"},
    {value: "pickup", label: "กระบะ"},
    {value: "suv", label: "SUV"},
    {value: "van", label: "รถตู้"},
    {value: "hatchback", label: "แฮทช์แบ็ก"},
  ],
  truck: [
    {value: "cab-chassis", label: "แค็บ"},
    {value: "full-cab", label: "4 ประตู"},
    {value: "flatbed", label: "กระบะบรรทุก"},
    {value: "box", label: "ตู้ทึบ"},
    {value: "tanker", label: "ถังบรรทุก"},
  ],
  motorcycle: [
    {value: "standard", label: "มาตรฐาน"},
    {value: "sport", label: "สปอร์ต"},
    {value: "scooter", label: "สกู๊ตเตอร์"},
    {value: "cruiser", label: "ครุยเซอร์"},
    {value: "adventure", label: "แอดเวนเจอร์"},
  ],
}

export const carEngineCcOptionsByCollateralType: Record<
  VehicleCollateralType,
  {value: string; label: string}[]
> = {
  car: [
    {value: "1000", label: "1000 ซีซี"},
    {value: "1200", label: "1200 ซีซี"},
    {value: "1500", label: "1500 ซีซี"},
    {value: "1800", label: "1800 ซีซี"},
    {value: "2000", label: "2000 ซีซี"},
    {value: "2500", label: "2500 ซีซี"},
    {value: "3000", label: "3000 ซีซี"},
  ],
  truck: [
    {value: "2500", label: "2500 ซีซี"},
    {value: "3000", label: "3000 ซีซี"},
    {value: "4000", label: "4000 ซีซี"},
    {value: "6000", label: "6000 ซีซี"},
    {value: "8000", label: "8000 ซีซี"},
    {value: "10000", label: "10000 ซีซี"},
    {value: "13000", label: "13000 ซีซี"},
  ],
  motorcycle: [
    {value: "110", label: "110 ซีซี"},
    {value: "125", label: "125 ซีซี"},
    {value: "150", label: "150 ซีซี"},
    {value: "160", label: "160 ซีซี"},
    {value: "250", label: "250 ซีซี"},
    {value: "300", label: "300 ซีซี"},
    {value: "400", label: "400 ซีซี"},
  ],
}

export function toVehicleCollateralType(
  collateralType?: CollateralType | null,
): VehicleCollateralType {
  return collateralType === "motorcycle" || collateralType === "truck"
    ? collateralType
    : "car"
}

export function getVehicleBrands(
  collateralType?: CollateralType | null,
): VehicleBrandOption[] {
  return vehicleCatalogByCollateralType[toVehicleCollateralType(collateralType)]
}

export function getVehicleModels(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
): VehicleModelOption[] {
  return (
    getVehicleBrands(collateralType).find((option) => option.value === brandValue)
      ?.models ?? []
  )
}

export function getVehicleSubModels(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): VehicleSubModelOption[] {
  return (
    getVehicleModels(collateralType, brandValue).find(
      (option) => option.value === modelValue,
    )?.subModels ?? []
  )
}

export function getVehicleBrandLabel(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
): string {
  return (
    getVehicleBrands(collateralType).find((option) => option.value === brandValue)
      ?.label ?? "-"
  )
}

export function getVehicleModelLabel(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): string {
  return (
    getVehicleModels(collateralType, brandValue).find(
      (option) => option.value === modelValue,
    )?.label ?? "-"
  )
}

export function getVehicleSubModelLabel(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
  subModelValue?: string,
): string {
  return (
    getVehicleSubModels(collateralType, brandValue, modelValue).find(
      (option) => option.value === subModelValue,
    )?.label ?? "-"
  )
}

export const carYearOptions: {value: string; label: string}[] = Array.from(
  {length: 15},
  (_, index) => {
    const year = 2024 - index
    return {value: String(year), label: String(year)}
  },
)

export const carConditionOptions: {value: string; label: string}[] = [
  {value: "excellent", label: "ดีเยี่ยม"},
  {value: "good", label: "ดี"},
  {value: "fair", label: "พอใช้"},
  {value: "needs-repair", label: "ต้องซ่อมแซม"},
]

export const carDoorsOptions: {value: string; label: string}[] = [
  {value: "2", label: "2 ประตู"},
  {value: "4", label: "4 ประตู"},
  {value: "5", label: "5 ประตู"},
]

export const carTransmissionOptions: {value: string; label: string}[] = [
  {value: "manual", label: "เกียร์ธรรมดา"},
  {value: "auto", label: "เกียร์อัตโนมัติ"},
]

export const mockCardCustomer: CardCustomerData = {
  name: "สดใส สะอาดเอี่ยม",
  idCardNumber: "1-2345-67890-12-3",
}

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
]

export const productGuideMock: ProductGuideData = {
  appraisalPrice: 570000,
  approvedRange: {min: 421000, max: 912000},
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
}

export const productCatalogMock: ProductCatalogData = {
  filterChips: [
    "รถเก๋ง กระบะ 4 ประตู",
    "จำนำทะเบียน",
    "ไม่มีไฟแนนซ์",
    "บัตรติดล้อ",
  ],
  gradeFilterLabel: "ทุกเกรด",
  items: [
    {
      id: "no-transfer-low-risk",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงต่ำ",
      tags: [
        {label: "ดอกเบี้ยถูก", tone: "green"},
        {label: "นอกอำนาจ", tone: "red"},
        {label: "ใช้เอกสารรายได้", tone: "purple"},
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
      tags: [{label: "รับทุกเกรด", tone: "purple"}],
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
        {label: "อนุมัติไว", tone: "amber"},
        {label: "70% LTV", tone: "pink"},
      ],
      ltvLabel: "70% LTV",
      approvedAmount: "399,000",
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "โอนเล่ม",
      interestRateLabel: "(0.94% - 1.13% ต่อเดือน)",
      interestReductionLabel: "ลดต้นลดดอก 20% - 24% ต่อปี",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
}

export const insuranceCompanyOptions: {value: string; label: string}[] = [
  {value: "viriyah", label: "วิริยะประกันภัย"},
  {value: "thipya", label: "ทิพยประกันภัย"},
  {value: "bkk-insurance", label: "กรุงเทพประกันภัย"},
]

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
    highlight:
      "TOYOTA • COLLOLA ALTIS • 2018(2555) • 1กก4567 • XDEEE4455977RD45",
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
]
