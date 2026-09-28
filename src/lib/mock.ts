import type {
  BranchUser,
  FollowUpTask,
  NavItem,
  PerformanceStat,
  QuickAction,
} from "@/types/dashboard"
import type {
  CarInfo,
  CollateralType,
  LoanPurpose,
  OptionCardData,
  RefinanceStatus,
  VehicleBrandOption,
  VehicleCollateralType,
  VehicleModelOption,
  VehicleModelSpec,
  VehicleSubModelOption,
} from "@/types/ratebook"
import type {
  CardCustomerData,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form"
import type { ProductGuideData } from "@/types/product-guide"
import type {
  ProductCatalogData,
  ProductCatalogDetail,
  ProductCatalogInterestRow,
  ProductCatalogItem,
  ProductCatalogLtvGroup,
  ProductCatalogTag,
} from "@/types/product-catalog"
import { calculateAmountFromLtv } from "@/lib/loan-cal"
import type { FollowUpEntry } from "@/types/lead-content"
import type { Gender } from "@/types/customer-lead"

export const navItems: NavItem[] = [
  { href: "/", label: "หน้าแรก", icon: "home", active: true },
  { href: "/loans", label: "สินเชื่อ", icon: "credit-card" },
  { href: "/insurance", label: "ประกัน", icon: "shield" },
  { href: "/crm", label: "CRM", icon: "users" },
  { href: "/tasks", label: "งานติดตาม", icon: "calendar-check" },
  { href: "/encb", label: "eNCB", icon: "bar-chart" },
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
  { value: "need-money", label: "ต้องการเงิน", description: "จำนำทะเบียน" },
  { value: "buy-car", label: "อยากซื้อรถ", description: "ซื้อ-ขาย ดีลเลอร์" },
]

export const provinceOptions: { value: string; label: string }[] = [
  { value: "bangkok", label: "กรุงเทพมหานคร" },
  { value: "nonthaburi", label: "นนทบุรี" },
  { value: "pathum-thani", label: "ปทุมธานี" },
  { value: "samut-prakan", label: "สมุทรปราการ" },
  { value: "chiang-mai", label: "เชียงใหม่" },
  { value: "chon-buri", label: "ชลบุรี" },
  { value: "nakhon-ratchasima", label: "นครราชสีมา" },
  { value: "khon-kaen", label: "ขอนแก่น" },
]

export const collateralTypeOptions: OptionCardData<CollateralType>[] = [
  {
    value: "motorcycle",
    label: "มอเตอร์ไซค์",
    image: "/assets/collateral/motorcycle.png",
  },
  { value: "car", label: "เก๋ง กระบะ ตู้", image: "/assets/collateral/car.png" },
  { value: "truck", label: "บรรทุก", image: "/assets/collateral/truck.png" },
  { value: "land", label: "ที่ดิน", image: "/assets/collateral/land.png" },
]

export const refinanceStatusOptions: OptionCardData<RefinanceStatus>[] = [
  { value: "still-paying", label: "ยังผ่อนอยู่", description: "รีไฟแนนซ์" },
  { value: "paid-off", label: "ผ่อนหมดแล้ว", description: "ไม่ใช่รีไฟแนนซ์" },
]

// ไฟแนนซ์เดิมที่รับรีไฟแนนซ์ — จาก image_figma/RateBook/car-precreen-refinance.png
// หมายเหตุจาก Figma (ยังไม่แสดงใน UI):
// 1. ไฟแนนซ์ลำดับที่ 20–23 จัดได้เฉพาะช่องทาง Agent ที่ Refer ให้กับสาขาในจังหวัด ร้อยเอ็ด มุกดาหาร และกาฬสินธุ์ เท่านั้น
// 2. ขั้นตอนการทำงานและเงื่อนไขการพิจารณาสินเชื่อ อ้างอิงตาม Policy ของสินเชื่อรีไฟแนนซ์ แบบไม่โอนเล่มในปัจจุบันที่กำหนด
export const existingFinanceOptions: { value: string; label: string }[] = [
  { value: "tisco", label: "ธนาคาร ทิสโก้ จำกัด (มหาชน)" },
  { value: "thanachart", label: "ธนาคาร ธนชาต จำกัด (มหาชน)" },
  { value: "scb", label: "ธนาคาร ไทยพาณิชย์ จำกัด (มหาชน)" },
  { value: "tripetch-isuzu-leasing", label: "บริษัท ตรีเพชรอีซูซุลิสซิ่ง จำกัด" },
  { value: "kasikorn-leasing", label: "บริษัท ลิสซิ่งกสิกรไทย จำกัด" },
  { value: "kiatnakin", label: "ธนาคาร เกียรตินาคิน จำกัด (มหาชน)" },
  {
    value: "asia-sermkij-leasing",
    label: "บริษัท เอเซียเสริมกิจลีสซิ่ง จำกัด (มหาชน)",
  },
  { value: "icbc-thai-leasing", label: "บริษัท ลิสซิ่งไอซีบีซี (ไทย) จำกัด" },
  {
    value: "krungthai-business-leasing",
    label: "บริษัท กรุงไทยธุรกิจลีสซิ่ง จำกัด",
  },
  { value: "toyota-leasing", label: "บริษัท โตโยต้า ลิสซิ่ง (ประเทศไทย) จำกัด" },
  { value: "cimb-thai-auto", label: "บริษัท ซีไอเอ็มบี ไทย ออโต้ จำกัด" },
  {
    value: "ayudhya-capital-auto-lease",
    label: "บริษัท อยุธยา แคปปิตอล ออโต้ ลิส จำกัด (มหาชน)",
  },
  { value: "krungsri", label: "ธนาคาร กรุงศรีอยุธยา จำกัด (มหาชน)" },
  { value: "nissan-leasing", label: "บริษัท นิสสัน ลิสซิ่ง (ประเทศไทย) จำกัด" },
  { value: "honda-leasing", label: "บริษัท ฮอนด้า ลิสซิ่ง (ประเทศไทย) จำกัด" },
  { value: "highway", label: "บริษัท ไฮเวย์ จำกัด" },
  { value: "center-auto-lease", label: "บริษัท เซ็นเตอร์ ออโต้ ลิส จำกัด" },
  {
    value: "mercedes-benz-leasing",
    label: "บริษัท เมอร์เซเดส-เบนซ์ ลิสซิ่ง (ประเทศไทย) จำกัด",
  },
  {
    value: "bmw-leasing",
    label: "บริษัท บีเอ็มดับเบิลยู ลิสซิ่ง (ประเทศไทย) จำกัด",
  },
  { value: "hem-leasing", label: "เฮมลิสซิ่ง" },
  { value: "nim-leasing", label: "นิ่ม ลิสซิ่ง (นิ่ม ซี่ เส็ง)" },
  { value: "chukiat-leasing", label: "ชูเกียรติลิสซิ่ง" },
  { value: "chukiat-autotech-1995", label: "ชูเกียรติออโต้เทค (1995) จำกัด" },
  { value: "chukiat-leasing-krabi", label: "ชูเกียรติลิสซิ่ง กระบี่ จำกัด" },
  { value: "chukiat-motor-1996", label: "ชูเกียรติมอเตอร์ (1996) จำกัด" },
  { value: "ratchthani-leasing", label: "บริษัท ราชธานีลิสซิ่ง จำกัด (มหาชน)" },
  {
    value: "ngern-hai-jai",
    label: "บริษัท เงินให้ใจ จำกัด",
  },
]

export const customerTypeOptions: { value: CustomerType; label: string }[] = [
  { value: "individual", label: "บุคคลธรรมดา" },
]

export const verificationMethodOptions: {
  value: VerificationMethod
  label: string
}[] = [
    { value: "card", label: "เสียบบัตรประชาชน" },
    { value: "manual", label: "กรอกข้อมูลเอง" },
  ]

function subModels(
  entries: [string, string][],
): VehicleSubModelOption[] {
  return entries.map(([value, label]) => ({ value, label }))
}

function model(
  value: string,
  label: string,
  entries: [string, string][],
  basePrice: number,
  spec: VehicleModelSpec,
): VehicleModelOption {
  return { value, label, subModels: subModels(entries), basePrice, ...spec }
}

function brand(
  value: string,
  label: string,
  models: VehicleModelOption[],
): VehicleBrandOption {
  return { value, label, models }
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
      ], 600000, {
        carTypeByDoors: { "4": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan"],
      }),
      model("yaris", "Yaris", [
        ["entry", "1.2 Entry"],
        ["sport", "1.2 Sport"],
        ["premium", "1.2 Premium"],
      ], 580000, {
        carTypeByDoors: { "4": "sedan", "5": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan", "hatchback"],
      }),
      model("fortuner", "Fortuner", [
        ["standard", "2.4 Standard"],
        ["legender", "2.8 Legender"],
      ], 1350000, {
        carTypeByDoors: { "5": "suv" },
        transmissions: ["auto"],
        bodyTypes: ["suv"],
      }),
      model("hilux-revo", "Hilux Revo", [
        ["standard-cab", "Standard Cab"],
        ["smart-cab", "Smart Cab"],
        ["double-cab", "Double Cab"],
      ], 700000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
    ]),
    brand("honda", "Honda", [
      model("city", "City", [
        ["s", "S"],
        ["v", "V"],
        ["sv", "SV"],
      ], 650000, {
        carTypeByDoors: { "4": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan"],
      }),
      model("civic", "Civic", [
        ["el", "EL"],
        ["rs", "RS"],
        ["hatchback-rs", "Hatchback RS"],
      ], 950000, {
        carTypeByDoors: { "4": "sedan", "5": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan", "hatchback"],
      }),
      model("cr-v", "CR-V", [
        ["e", "E"],
        ["el", "EL"],
        ["se", "SE"],
      ], 1300000, {
        carTypeByDoors: { "5": "suv" },
        transmissions: ["auto"],
        bodyTypes: ["suv"],
      }),
    ]),
    brand("isuzu", "Isuzu", [
      model("d-max", "D-Max", [
        ["spark", "Spark"],
        ["hi-lander", "Hi-Lander"],
        ["v-cross", "V-Cross"],
      ], 650000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
      model("mu-x", "MU-X", [
        ["standard", "Standard"],
        ["ultimate", "Ultimate"],
      ], 1300000, {
        carTypeByDoors: { "5": "suv" },
        transmissions: ["auto"],
        bodyTypes: ["suv"],
      }),
    ]),
    brand("nissan", "Nissan", [
      model("almera", "Almera", [
        ["e", "E"],
        ["v", "V"],
        ["vl", "VL"],
      ], 550000, {
        carTypeByDoors: { "4": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan"],
      }),
      model("navara", "Navara", [
        ["calibre", "Calibre"],
        ["pro-4x", "Pro-4X"],
      ], 700000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
    ]),
    brand("mazda", "Mazda", [
      model("mazda2", "Mazda2", [
        ["s", "S"],
        ["sports-high", "Sports High"],
      ], 550000, {
        carTypeByDoors: { "4": "sedan", "5": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan", "hatchback"],
      }),
      model("cx-5", "CX-5", [
        ["c", "C"],
        ["sp", "SP"],
      ], 1200000, {
        carTypeByDoors: { "5": "suv" },
        transmissions: ["auto"],
        bodyTypes: ["suv"],
      }),
      model("bt-50", "BT-50", [
        ["standard-cab", "Standard Cab"],
        ["double-cab", "Double Cab"],
      ], 700000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
    ]),
    brand("ford", "Ford", [
      model("ranger", "Ranger", [
        ["xl", "XL"],
        ["xlt", "XLT"],
        ["wildtrak", "Wildtrak"],
      ], 750000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
      model("everest", "Everest", [
        ["ambiente", "Ambiente"],
        ["titanium", "Titanium"],
      ], 1400000, {
        carTypeByDoors: { "5": "suv" },
        transmissions: ["auto"],
        bodyTypes: ["suv"],
      }),
    ]),
    brand("mitsubishi", "Mitsubishi", [
      model("triton", "Triton", [
        ["glx", "GLX"],
        ["gls", "GLS"],
        ["athlete", "Athlete"],
      ], 650000, {
        carTypeByDoors: { "2": "pickup", "4": "pickup" },
        transmissions: ["manual", "auto"],
        bodyTypes: ["pickup"],
      }),
      model("xpander", "Xpander", [
        ["gls", "GLS"],
        ["ultimate", "Ultimate"],
      ], 800000, {
        carTypeByDoors: { "5": "van" },
        transmissions: ["auto"],
        bodyTypes: ["van"],
      }),
    ]),
    brand("suzuki", "Suzuki", [
      model("swift", "Swift", [
        ["ga", "GA"],
        ["gl", "GL"],
      ], 550000, {
        carTypeByDoors: { "5": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["hatchback"],
      }),
      model("ciaz", "Ciaz", [
        ["gl", "GL"],
        ["glx", "GLX"],
      ], 550000, {
        carTypeByDoors: { "4": "sedan" },
        transmissions: ["auto"],
        bodyTypes: ["sedan"],
      }),
    ]),
  ],
  motorcycle: [
    brand("honda", "Honda", [
      model("wave110i", "Wave110i", [
        ["standard", "Standard"],
        ["fi", "Fi"],
      ], 45000, {
        carTypeByDoors: { "": "family" },
        transmissions: ["manual"],
        bodyTypes: ["standard"],
      }),
      model("click160i", "Click160i", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ], 75000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("pcx160", "PCX160", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ], 100000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("cbr150r", "CBR150R", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ], 105000, {
        carTypeByDoors: { "": "sport" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
    ]),
    brand("yamaha", "Yamaha", [
      model("fino", "Fino", [
        ["standard", "Standard"],
        ["premium", "Premium"],
      ], 48000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("aerox155", "Aerox155", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ], 75000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("nmax", "NMAX", [
        ["standard", "Standard"],
        ["abs", "ABS"],
      ], 90000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("exciter155vva", "Exciter155VVA", [
        ["standard", "Standard"],
        ["gp", "GP"],
      ], 95000, {
        carTypeByDoors: { "": "sport" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
    ]),
    brand("suzuki", "Suzuki", [
      model("smash", "Smash", [["standard", "Standard"]], 45000, {
        carTypeByDoors: { "": "family" },
        transmissions: ["manual"],
        bodyTypes: ["standard"],
      }),
      model("address110", "Address110", [["standard", "Standard"]], 55000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("gsx-r150", "GSX-R150", [["standard", "Standard"]], 110000, {
        carTypeByDoors: { "": "sport" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
    ]),
    brand("kawasaki", "Kawasaki", [
      model("ninja250", "Ninja250", [
        ["standard", "Standard"],
        ["se", "SE"],
      ], 170000, {
        carTypeByDoors: { "": "big-bike" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
      model("z250", "Z250", [["standard", "Standard"]], 160000, {
        carTypeByDoors: { "": "big-bike" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
      model("klx150", "KLX150", [["standard", "Standard"]], 110000, {
        carTypeByDoors: { "": "adv" },
        transmissions: ["manual"],
        bodyTypes: ["adventure"],
      }),
    ]),
    brand("vespa", "Vespa", [
      model("primavera150", "Primavera150", [["standard", "Standard"]], 150000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("sprint150", "Sprint150", [["standard", "Standard"]], 150000, {
        carTypeByDoors: { "": "scooter" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
      model("gts300", "GTS300", [["standard", "Standard"]], 260000, {
        carTypeByDoors: { "": "big-bike" },
        transmissions: ["auto"],
        bodyTypes: ["scooter"],
      }),
    ]),
    brand("gpx", "GPX", [
      model("demon150gr", "Demon150GR", [["standard", "Standard"]], 65000, {
        carTypeByDoors: { "": "sport" },
        transmissions: ["manual"],
        bodyTypes: ["sport"],
      }),
      model("legend250", "Legend250", [["standard", "Standard"]], 130000, {
        carTypeByDoors: { "": "big-bike" },
        transmissions: ["manual"],
        bodyTypes: ["cruiser"],
      }),
    ]),
  ],
  truck: [
    brand("isuzu", "Isuzu", [
      model("ftr", "FTR", [
        ["4x2", "4x2"],
        ["6x2", "6x2"],
      ], 2200000, {
        carTypeByDoors: { "2": "6-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "flatbed", "box"],
      }),
      model("fvr", "FVR", [
        ["6x2", "6x2"],
        ["6x4", "6x4"],
      ], 2800000, {
        carTypeByDoors: { "2": "10-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "flatbed", "box"],
      }),
      model("elf", "ELF", [["standard", "Standard"]], 1400000, {
        carTypeByDoors: { "2": "4-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
    ]),
    brand("hino", "Hino", [
      model("300-series", "300 Series", [
        ["standard", "Standard"],
        ["wide-cab", "Wide Cab"],
      ], 1600000, {
        carTypeByDoors: { "2": "4-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
      model("500-series", "500 Series", [
        ["4x2", "4x2"],
        ["6x2", "6x2"],
      ], 2900000, {
        carTypeByDoors: { "2": "6-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "flatbed", "box"],
      }),
      model("700-series", "700 Series", [["6x4", "6x4"]], 4500000, {
        carTypeByDoors: { "2": "10-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["flatbed", "tanker"],
      }),
    ]),
    brand("fuso", "Mitsubishi Fuso", [
      model("fighter", "Fighter", [["standard", "Standard"]], 2300000, {
        carTypeByDoors: { "2": "6-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["flatbed", "box"],
      }),
      model("canter", "Canter", [["standard", "Standard"]], 1300000, {
        carTypeByDoors: { "2": "4-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
    ]),
    brand("volvo", "Volvo Trucks", [
      model("fm", "FM", [
        ["4x2", "4x2"],
        ["6x4", "6x4"],
      ], 4800000, {
        carTypeByDoors: { "2": "10-wheel" },
        transmissions: ["auto"],
        bodyTypes: ["flatbed", "tanker"],
      }),
      model("fh", "FH", [["6x4", "6x4"]], 5500000, {
        carTypeByDoors: { "2": "trailer" },
        transmissions: ["auto"],
        bodyTypes: ["flatbed"],
      }),
    ]),
    brand("scania", "Scania", [
      model("p-series", "P-series", [["standard", "Standard"]], 4600000, {
        carTypeByDoors: { "2": "10-wheel" },
        transmissions: ["auto"],
        bodyTypes: ["flatbed", "tanker"],
      }),
      model("r-series", "R-series", [["standard", "Standard"]], 5800000, {
        carTypeByDoors: { "2": "trailer" },
        transmissions: ["auto"],
        bodyTypes: ["flatbed"],
      }),
    ]),
    brand("ud", "UD Trucks", [
      model("quon", "Quon", [["standard", "Standard"]], 4700000, {
        carTypeByDoors: { "2": "10-wheel" },
        transmissions: ["auto"],
        bodyTypes: ["flatbed", "tanker"],
      }),
      model("condor", "Condor", [["standard", "Standard"]], 2600000, {
        carTypeByDoors: { "2": "6-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
    ]),
    brand("hyundai", "Hyundai", [
      model("mighty", "Mighty", [["standard", "Standard"]], 1500000, {
        carTypeByDoors: { "2": "4-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
      model("hd", "HD", [["standard", "Standard"]], 2000000, {
        carTypeByDoors: { "2": "6-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
    ]),
  ],
}

export const carTypeOptionsByCollateralType: Record<
  VehicleCollateralType,
  { value: string; label: string }[]
> = {
  car: [
    { value: "sedan", label: "รถเก๋ง" },
    { value: "pickup", label: "รถกระบะ" },
    { value: "suv", label: "รถ SUV" },
    { value: "van", label: "รถตู้" },
  ],
  truck: [
    { value: "4-wheel", label: "รถบรรทุก 4 ล้อ" },
    { value: "6-wheel", label: "รถบรรทุก 6 ล้อ" },
    { value: "10-wheel", label: "รถบรรทุก 10 ล้อ" },
    { value: "trailer", label: "รถพ่วง" },
  ],
  motorcycle: [
    { value: "family", label: "ครอบครัว" },
    { value: "scooter", label: "สกู๊ตเตอร์ออโตเมติก" },
    { value: "sport", label: "สปอร์ต" },
    { value: "big-bike", label: "บิ๊กไบค์" },
    { value: "adv", label: "ADV/Adventure" },
  ],
}

export const carBodyTypeOptionsByCollateralType: Record<
  VehicleCollateralType,
  { value: string; label: string }[]
> = {
  car: [
    { value: "sedan", label: "ซีดาน" },
    { value: "pickup", label: "กระบะ" },
    { value: "suv", label: "SUV" },
    { value: "van", label: "รถตู้" },
    { value: "hatchback", label: "แฮทช์แบ็ก" },
  ],
  truck: [
    { value: "cab-chassis", label: "แค็บ" },
    { value: "full-cab", label: "4 ประตู" },
    { value: "flatbed", label: "กระบะบรรทุก" },
    { value: "box", label: "ตู้ทึบ" },
    { value: "tanker", label: "ถังบรรทุก" },
  ],
  motorcycle: [
    { value: "standard", label: "มาตรฐาน" },
    { value: "sport", label: "สปอร์ต" },
    { value: "scooter", label: "สกู๊ตเตอร์" },
    { value: "cruiser", label: "ครุยเซอร์" },
    { value: "adventure", label: "แอดเวนเจอร์" },
  ],
}

export const carEngineCcOptionsByCollateralType: Record<
  VehicleCollateralType,
  { value: string; label: string }[]
> = {
  car: [
    { value: "1000", label: "1000 ซีซี" },
    { value: "1200", label: "1200 ซีซี" },
    { value: "1500", label: "1500 ซีซี" },
    { value: "1800", label: "1800 ซีซี" },
    { value: "2000", label: "2000 ซีซี" },
    { value: "2500", label: "2500 ซีซี" },
    { value: "3000", label: "3000 ซีซี" },
  ],
  truck: [
    { value: "2500", label: "2500 ซีซี" },
    { value: "3000", label: "3000 ซีซี" },
    { value: "4000", label: "4000 ซีซี" },
    { value: "6000", label: "6000 ซีซี" },
    { value: "8000", label: "8000 ซีซี" },
    { value: "10000", label: "10000 ซีซี" },
    { value: "13000", label: "13000 ซีซี" },
  ],
  motorcycle: [
    { value: "110", label: "110 ซีซี" },
    { value: "125", label: "125 ซีซี" },
    { value: "150", label: "150 ซีซี" },
    { value: "160", label: "160 ซีซี" },
    { value: "250", label: "250 ซีซี" },
    { value: "300", label: "300 ซีซี" },
    { value: "400", label: "400 ซีซี" },
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

export function getVehicleModelSpec(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): VehicleModelSpec | undefined {
  return getVehicleModels(collateralType, brandValue).find(
    (option) => option.value === modelValue,
  )
}

// จำนวนประตู is narrowed to what the chosen รุ่น actually comes in, so the ประเภทรถ below can
// always be resolved from it. An unpicked รุ่น — or one with no doors at all (มอเตอร์ไซค์) — has
// nothing to offer.
export function getVehicleDoorsOptions(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): { value: string; label: string }[] {
  const carTypeByDoors =
    getVehicleModelSpec(collateralType, brandValue, modelValue)?.carTypeByDoors ?? {}
  return carDoorsOptions.filter((option) => option.value in carTypeByDoors)
}

// ประเภทรถ is a fact about the vehicle, not a question for the user: the รุ่น's own
// จำนวนประตู → ประเภทรถ table decides it. Undefined until both are known.
export function getVehicleCarType(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
  doors?: string,
): string | undefined {
  return getVehicleModelSpec(collateralType, brandValue, modelValue)?.carTypeByDoors[
    doors ?? ""
  ]
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

export function getVehicleModelBasePrice(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): number {
  return (
    getVehicleModels(collateralType, brandValue).find(
      (option) => option.value === modelValue,
    )?.basePrice ?? 300000
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

export const carYearOptions: { value: string; label: string }[] = Array.from(
  { length: 15 },
  (_, index) => {
    const year = 2024 - index
    return { value: String(year), label: String(year) }
  },
)

export const carConditionOptions: { value: string; label: string }[] = [
  { value: "excellent", label: "ดีเยี่ยม" },
  { value: "good", label: "ดี" },
  { value: "fair", label: "พอใช้" },
  { value: "needs-repair", label: "ต้องซ่อมแซม" },
]

export const carDoorsOptions: { value: string; label: string }[] = [
  { value: "2", label: "2 ประตู" },
  { value: "4", label: "4 ประตู" },
  { value: "5", label: "5 ประตู" },
]

export const carTransmissionOptions: { value: string; label: string }[] = [
  { value: "manual", label: "เกียร์ธรรมดา" },
  { value: "auto", label: "เกียร์อัตโนมัติ" },
]

export const mockCardCustomer: CardCustomerData = {
  name: "สดใส สะอาดเอี่ยม",
  idCardNumber: "1-2345-67890-12-3",
  gender: "male",
  birthDate: "1990-05-20",
}

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
]

export const GENDER_LABELS: Record<Gender, string> = {
  male: "ชาย",
  female: "หญิง",
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

const CONDITION_MULTIPLIERS: Record<string, number> = {
  excellent: 1,
  good: 0.93,
  fair: 0.83,
  "needs-repair": 0.65,
}

const DEPRECIATION_RATE_PER_YEAR = 0.1
const MIN_DEPRECIATION_FACTOR = 0.2

function depreciationFactor(ageInYears: number): number {
  const factor = (1 - DEPRECIATION_RATE_PER_YEAR) ** Math.max(ageInYears, 0)
  return Math.max(factor, MIN_DEPRECIATION_FACTOR)
}

function roundToNearestThousand(amount: number): number {
  return Math.round(amount / 1000) * 1000
}

export function getProductGuideData(
  carInfo: CarInfo,
  collateralType?: CollateralType | null,
): ProductGuideData {
  const basePrice = getVehicleModelBasePrice(
    collateralType,
    carInfo.brand,
    carInfo.model,
  )
  const latestCatalogYear = Math.max(
    ...carYearOptions.map((option) => Number(option.value)),
  )
  const ageInYears = latestCatalogYear - Number(carInfo.year ?? latestCatalogYear)
  const conditionMultiplier = CONDITION_MULTIPLIERS[carInfo.condition ?? ""] ?? 1

  const appraisalPrice = roundToNearestThousand(
    basePrice * depreciationFactor(ageInYears) * conditionMultiplier,
  )

  return {
    appraisalPrice,
    approvedRange: {
      min: roundToNearestThousand(appraisalPrice * 0.7),
      max: roundToNearestThousand(appraisalPrice * 1.6),
    },
    approvedLtvBadges: ["70% LTV", "160% LTV"],
    plans: [
      {
        title: "อนุมัติง่าย LTV ต่ำ",
        maxLtvLabel: "ไม่เกิน 70% LTV",
        maxAmount: roundToNearestThousand(appraisalPrice * 0.7),
        bullets: [
          "NCB A01-A03 ได้สูงสุด 70%LTV",
          "วันครอบครอง 60-210 วัน ขึ้นอยู่กับเกรด NCB",
        ],
      },
      {
        title: "วงเงินสูง ความเสี่ยงปกติ",
        maxLtvLabel: "ไม่เกิน 130% LTV",
        maxAmount: roundToNearestThousand(appraisalPrice * 1.3),
        bullets: ["เงื่อนไขขึ้นอยู่กับ NCB grade, LTV และวันครอบครอง"],
      },
      {
        title: "วงเงินสูง ดอกเบี้ยต่ำ ความเสี่ยงต่ำ",
        maxLtvLabel: "ไม่เกิน 160% LTV",
        maxAmount: roundToNearestThousand(appraisalPrice * 1.6),
        bullets: ["NCB A01-A02", "เอกสารแสดงรายได้", "งานนอกอำนาจ"],
      },
    ],
  }
}

/** A single value, or a low-high band rendered as "low - high". */
type NumberOrRange = number | { min: number; max: number }

type ProductRule = {
  id: string
  title: string
  tags: ProductCatalogTag[]
  /** Percent of the appraisal price; also what the approved amount is derived from. */
  ltv: NumberOrRange
  /** Percent per month. */
  monthlyRate: NumberOrRange
  /** ลดต้นลดดอก, percent per year. */
  annualReduction: NumberOrRange
  ncbGradeLabel: string
  ncbGradeTone: ProductCatalogItem["ncbGradeTone"]
  bookStatusLabel: string
  primaryActionLabel: string
  primaryActionVariant: ProductCatalogItem["primaryActionVariant"]
  minAppraisalPrice?: number
  requiresTopTierBrand?: boolean
}

// Brands whose resale value is strong enough for the premium products. Everything
// else in the catalog only qualifies for that collateral type's baseline product.
const topTierBrandsByCollateralType: Record<VehicleCollateralType, string[]> = {
  car: ["toyota", "honda", "isuzu"],
  motorcycle: ["honda", "yamaha"],
  truck: ["isuzu", "hino", "fuso"],
}

// The last rule of every set is the baseline: no eligibility conditions, so the
// catalog is never empty. Rates are %/month and stay within the ~24%/yr ceiling
// that Thai title loans are capped at.
const productRulesByCollateralType: Record<VehicleCollateralType, ProductRule[]> = {
  car: [
    {
      id: "no-transfer-low-risk",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงต่ำ",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "นอกอำนาจ", tone: "red" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
      ],
      ltv: 92,
      monthlyRate: 0.6,
      annualReduction: 13,
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
      minAppraisalPrice: 200000,
      requiresTopTierBrand: true,
    },
    {
      id: "high-limit-normal-risk",
      title: "โครงการวงเงินสูง ความเสี่ยงปกติ เก่ง กระบะ",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltv: { min: 80, max: 130 },
      monthlyRate: { min: 0.6, max: 0.84 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 300000,
      requiresTopTierBrand: true,
    },
    {
      id: "easy-approval-low-ltv",
      title: "โครงการอนุมัติง่าย LTV ต่ำ เก่ง กระบะ",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "70% LTV", tone: "pink" },
      ],
      ltv: 70,
      monthlyRate: { min: 0.94, max: 1.13 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
  motorcycle: [
    {
      id: "mc-no-transfer",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม มอเตอร์ไซค์ ความเสี่ยงต่ำ",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
      ],
      ltv: 80,
      monthlyRate: 1.25,
      annualReduction: 15,
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
      minAppraisalPrice: 40000,
      requiresTopTierBrand: true,
    },
    {
      id: "mc-high-limit",
      title: "โครงการวงเงินสูง มอเตอร์ไซค์ บิ๊กไบค์",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltv: { min: 70, max: 110 },
      monthlyRate: { min: 1.25, max: 1.75 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 60000,
      requiresTopTierBrand: true,
    },
    {
      id: "mc-easy-approval",
      title: "โครงการอนุมัติง่าย LTV ต่ำ มอเตอร์ไซค์",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "60% LTV", tone: "pink" },
      ],
      ltv: 60,
      monthlyRate: { min: 1.75, max: 2 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
  truck: [
    {
      id: "truck-no-transfer",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม รถบรรทุก ความเสี่ยงต่ำ",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
      ],
      ltv: 75,
      monthlyRate: 1.09,
      annualReduction: 15,
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
      minAppraisalPrice: 800000,
      requiresTopTierBrand: true,
    },
    {
      id: "truck-high-limit",
      title: "โครงการวงเงินสูง ความเสี่ยงปกติ รถบรรทุก",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltv: { min: 70, max: 100 },
      monthlyRate: { min: 1.09, max: 1.35 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 1000000,
      requiresTopTierBrand: true,
    },
    {
      id: "truck-easy-approval",
      title: "โครงการอนุมัติง่าย LTV ต่ำ รถบรรทุก",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "60% LTV", tone: "pink" },
      ],
      ltv: 60,
      monthlyRate: { min: 1.35, max: 1.6 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
}

// Latin digits and comma grouping only: LeadLoanInfoCard regex-parses these strings
// back into numbers (approvedAmount takes the LAST match, interestRateLabel the FIRST).
function formatRange(
  spec: NumberOrRange,
  format: (value: number) => string,
): string {
  return typeof spec === "number"
    ? format(spec)
    : `${format(spec.min)} - ${format(spec.max)}`
}

export type ProductCatalogContext = {
  carInfo: CarInfo
  collateralType?: CollateralType | null
  loanPurpose?: LoanPurpose | null
  refinanceStatus?: RefinanceStatus | null
  appraisalPrice: number
}

function isTopTierBrand(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
): boolean {
  return topTierBrandsByCollateralType[
    toVehicleCollateralType(collateralType)
  ].includes(brandValue ?? "")
}

function isRuleEligible(rule: ProductRule, context: ProductCatalogContext): boolean {
  if (
    rule.minAppraisalPrice != null &&
    context.appraisalPrice < rule.minAppraisalPrice
  ) {
    return false
  }
  if (
    rule.requiresTopTierBrand &&
    !isTopTierBrand(context.collateralType, context.carInfo.brand)
  ) {
    return false
  }
  return true
}

const ALL_NCB_GRADES_LABEL = "ทุกเกรด"

const allGradeLtvGroups: ProductCatalogLtvGroup[] = [
  {
    ncbGrade: "A01 - A03",
    rows: [{ holdingPeriod: "60 วันขึ้นไป", limit: "130%LTV" }],
  },
  {
    ncbGrade: "A04",
    rows: [
      { holdingPeriod: "180 วันขึ้นไป", limit: "130%LTV" },
      { holdingPeriod: "60 - 179 วัน", limit: "100%LTV" },
    ],
  },
  {
    ncbGrade: "U01 - U04, L01",
    rows: [
      { holdingPeriod: "180 วันขึ้นไป", limit: "130%LTV" },
      { holdingPeriod: "90 - 179 วัน", limit: "80%LTV" },
    ],
  },
  {
    ncbGrade: "A05, U05, L05",
    rows: [
      { holdingPeriod: "180 วันขึ้นไป", limit: "100%LTV" },
      { holdingPeriod: "90 - 179 วัน", limit: "80%LTV" },
    ],
  },
]

const allGradeInterestRows: ProductCatalogInterestRow[] = [
  { ncbGrade: "A01 - A03", rates: ["20.00%", "21.00%", "22.00%"] },
  { ncbGrade: "A04 - A05", rates: ["21.00%", "22.00%", "24.00%"] },
  { ncbGrade: "U01 - U05", rates: ["23.00%", "23.00%", "24.00%"] },
  { ncbGrade: "L01, L05", rates: ["23.00%", "23.00%", "24.00%"] },
]

// Mock: both condition blocks are the same for every product for now.
const productDetailTemplate: Pick<
  ProductCatalogDetail,
  "collateralConditions" | "borrowerConditions"
> = {
  collateralConditions: [
    { label: "ประเภทรถ", value: "ทุกประเภท" },
    { label: "ประเภทจดทะเบียน", value: "ร.ย.1, ร.ย.2, ร.ย.3" },
    { label: "ยี่ห้อ", value: "ทุกยี่ห้อ" },
    { label: "อายุทรัพย์สิน", value: "1 - 20 ปี" },
    { label: "ระยะครอบครอง", value: "1 - 20 ปี" },
  ],
  borrowerConditions: [
    { label: "ประเภท", value: "บุคคลธรรมดา" },
    { label: "อายุ", value: "20 - 65 ปี" },
    { label: "เกรด NCB", value: "A01 - A05" },
    { label: "ระยะอาศัยที่อยู่ปัจจุบัน", value: "1- 99 ปี" },
    { label: "ผู้ค้ำประกัน", value: "ไม่จำเป็น", tone: "success" },
  ],
}

function toProductDetail(rule: ProductRule): ProductCatalogDetail {
  const maxLtv = typeof rule.ltv === "number" ? rule.ltv : rule.ltv.max
  const isAllGrades = rule.ncbGradeLabel === ALL_NCB_GRADES_LABEL
  return {
    ...productDetailTemplate,
    ltvGroups: isAllGrades
      ? allGradeLtvGroups
      : [
          {
            ncbGrade: rule.ncbGradeLabel,
            rows: [{ holdingPeriod: "60 วันขึ้นไป", limit: `${maxLtv}%LTV` }],
          },
        ],
    // Mock: a single-grade product reuses the A01 - A03 rates.
    interestRows: isAllGrades
      ? allGradeInterestRows
      : [{ ncbGrade: rule.ncbGradeLabel, rates: allGradeInterestRows[0].rates }],
  }
}

function toCatalogItem(
  rule: ProductRule,
  appraisalPrice: number,
): ProductCatalogItem {
  return {
    id: rule.id,
    title: rule.title,
    tags: rule.tags,
    ltvLabel: `${formatRange(rule.ltv, (value) => `${value}%`)} LTV`,
    approvedAmount: formatRange(rule.ltv, (value) =>
      calculateAmountFromLtv(value, appraisalPrice).toLocaleString("en-US"),
    ),
    ncbGradeLabel: rule.ncbGradeLabel,
    ncbGradeTone: rule.ncbGradeTone,
    bookStatusLabel: rule.bookStatusLabel,
    interestRateLabel: `(${formatRange(
      rule.monthlyRate,
      (value) => `${value.toFixed(2)}%`,
    )} ต่อเดือน)`,
    interestReductionLabel: `ลดต้นลดดอก ${formatRange(
      rule.annualReduction,
      (value) => `${value}%`,
    )} ต่อปี`,
    primaryActionLabel: rule.primaryActionLabel,
    primaryActionVariant: rule.primaryActionVariant,
    detail: toProductDetail(rule),
  }
}

function getVehicleTypeChip(context: ProductCatalogContext): string {
  const vehicleCollateralType = toVehicleCollateralType(context.collateralType)
  if (vehicleCollateralType === "motorcycle") return "มอเตอร์ไซค์"
  if (vehicleCollateralType === "truck") return "รถบรรทุก"
  const doorsLabel = carDoorsOptions.find(
    (option) => option.value === context.carInfo.doors,
  )?.label
  return doorsLabel ? `รถเก๋ง กระบะ ${doorsLabel}` : "รถเก๋ง กระบะ ตู้"
}

export function getProductCatalogData(
  context: ProductCatalogContext,
): ProductCatalogData {
  const rules =
    productRulesByCollateralType[toVehicleCollateralType(context.collateralType)]

  return {
    filterChips: [
      getVehicleTypeChip(context),
      loanPurposeOptions.find((option) => option.value === context.loanPurpose)
        ?.description ?? "จำนำทะเบียน",
      refinanceStatusOptions.find(
        (option) => option.value === context.refinanceStatus,
      )?.description ?? "ไม่ใช่รีไฟแนนซ์",
      // LoanCalBar keys its default บัตรติดล้อ checkbox off this exact literal.
      "บัตรติดล้อ",
    ],
    gradeFilterLabel: "ทุกเกรด",
    items: rules
      .filter((rule) => isRuleEligible(rule, context))
      .map((rule) => toCatalogItem(rule, context.appraisalPrice)),
  }
}

/**
 * Looks up a saved product ignoring eligibility, so a selection persisted against
 * an earlier vehicle still rehydrates instead of silently vanishing on reload.
 */
export function findProductCatalogItemById(
  productId: string,
  context: ProductCatalogContext,
): ProductCatalogItem | null {
  const rule = productRulesByCollateralType[
    toVehicleCollateralType(context.collateralType)
  ].find((candidate) => candidate.id === productId)
  return rule ? toCatalogItem(rule, context.appraisalPrice) : null
}

export const insuranceCompanyOptions: { value: string; label: string }[] = [
  { value: "viriyah", label: "วิริยะประกันภัย" },
  { value: "thipya", label: "ทิพยประกันภัย" },
  { value: "bkk-insurance", label: "กรุงเทพประกันภัย" },
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
