import { productRulesByCollateralType as catalogRulesByCollateralType } from "@/lib/product-catalog-data";
import type {
  BranchUser,
  FollowUpTask,
  NavItem,
  PerformanceStat,
  QuickAction,
} from "@/types/dashboard";
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
} from "@/types/ratebook";
import type {
  CardCustomerData,
  CustomerType,
  VerificationMethod,
} from "@/types/customer-form";
import type { ProductGuideData, ProductGuidePlan } from "@/types/product-guide";
import { formatRatePercent } from "@/lib/format";
import type {
  ProductCatalogData,
  ProductCatalogDetail,
  ProductCatalogInterestRow,
  ProductCatalogItem,
  ProductCatalogLtvGroup,
  ProductCatalogTag,
} from "@/types/product-catalog";
import { calculateProductLoanLimits, formatProductLoanLimits } from "@/lib/product-loan-limits";
import type { FollowUpEntry } from "@/types/lead-content";
import type { Gender, NcbGrade } from "@/types/customer-lead";

export const ncbGradeList = [
  { id: "104", name: "A01", code: "A01", parentCode: "NCB_GRADE" },
  { id: "105", name: "A02", code: "A02", parentCode: "NCB_GRADE" },
  { id: "106", name: "A03", code: "A03", parentCode: "NCB_GRADE" },
  { id: "107", name: "A04", code: "A04", parentCode: "NCB_GRADE" },
  { id: "108", name: "A05", code: "A05", parentCode: "NCB_GRADE" },
  { id: "109", name: "U01", code: "U01", parentCode: "NCB_GRADE" },
  { id: "110", name: "U02", code: "U02", parentCode: "NCB_GRADE" },
  { id: "111", name: "U03", code: "U03", parentCode: "NCB_GRADE" },
  { id: "112", name: "U04", code: "U04", parentCode: "NCB_GRADE" },
  { id: "113", name: "U05", code: "U05", parentCode: "NCB_GRADE" },
  { id: "114", name: "L01", code: "L01", parentCode: "NCB_GRADE" },
  { id: "115", name: "L02", code: "L02", parentCode: "NCB_GRADE" },
  { id: "116", name: "L03", code: "L03", parentCode: "NCB_GRADE" },
  { id: "117", name: "L04", code: "L04", parentCode: "NCB_GRADE" },
  { id: "118", name: "L05", code: "L05", parentCode: "NCB_GRADE" },
] satisfies { id: string; name: string; code: NcbGrade; parentCode: "NCB_GRADE" }[];

export const navItems: NavItem[] = [
  { href: "/", label: "หน้าแรก", icon: "home", active: true },
  { href: "/", label: "สินเชื่อ", icon: "credit-card" },
  { href: "/", label: "ประกัน", icon: "shield" },
  { href: "/", label: "CRM", icon: "users" },
  { href: "/", label: "งานติดตาม", icon: "calendar-check" },
  { href: "/", label: "eNCB", icon: "bar-chart" },
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
    href: "/",
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

// No branch/staff entity or auth context exists yet, so every opportunity is
// stamped with the same mock assignment until that's built for real.
export const MOCK_OPPORTUNITY_BRANCH_NAME = "สาขาสะพานควาย 1234";
export const MOCK_OPPORTUNITY_STAFF_NAME = "น.ส. สุกันยา สุริยันต์";
export const MOCK_OPPORTUNITY_STAFF_CODE = "L1610000047/799645";

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
  {
    value: "motorcycle",
    label: "มอเตอร์ไซค์",
    image: "/assets/collateral/motorcycle.png",
    imageClassName: "-scale-x-100",
  },
  {
    value: "car",
    label: "เก๋ง กระบะ ตู้",
    image: "/assets/collateral/car.png",
  },
  { value: "truck", label: "บรรทุก", image: "/assets/collateral/truck.png" },
  { value: "land", label: "ที่ดิน", image: "/assets/collateral/land.svg" },
];

export const refinanceStatusOptions: OptionCardData<RefinanceStatus>[] = [
  { value: "still-paying", label: "ยังผ่อนอยู่", description: "รีไฟแนนซ์" },
  { value: "paid-off", label: "ผ่อนหมดแล้ว", description: "ไม่ใช่รีไฟแนนซ์" },
];

// ไฟแนนซ์เดิมที่รับรีไฟแนนซ์ — จาก image_figma/RateBook/car-precreen-refinance.png
// หมายเหตุจาก Figma (ยังไม่แสดงใน UI):
// 1. ไฟแนนซ์ลำดับที่ 20–23 จัดได้เฉพาะช่องทาง Agent ที่ Refer ให้กับสาขาในจังหวัด ร้อยเอ็ด มุกดาหาร และกาฬสินธุ์ เท่านั้น
// 2. ขั้นตอนการทำงานและเงื่อนไขการพิจารณาสินเชื่อ อ้างอิงตาม Policy ของสินเชื่อรีไฟแนนซ์ แบบไม่โอนเล่มในปัจจุบันที่กำหนด
export const existingFinanceOptions: { value: string; label: string }[] = [
  { value: "tisco", label: "ธนาคาร ทิสโก้ จำกัด (มหาชน)" },
  { value: "thanachart", label: "ธนาคาร ธนชาต จำกัด (มหาชน)" },
  { value: "scb", label: "ธนาคาร ไทยพาณิชย์ จำกัด (มหาชน)" },
  {
    value: "tripetch-isuzu-leasing",
    label: "บริษัท ตรีเพชรอีซูซุลิสซิ่ง จำกัด",
  },
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
  {
    value: "toyota-leasing",
    label: "บริษัท โตโยต้า ลิสซิ่ง (ประเทศไทย) จำกัด",
  },
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
];

export const customerTypeOptions: { value: CustomerType; label: string }[] = [
  { value: "individual", label: "บุคคลธรรมดา" },
];

/** Approved motorcycle refinance companies supplied by the business. Shared companies keep their IDs. */
export const motorcycleExistingFinanceOptions: { value: string; label: string }[] = [
  { value: "summit-capital-leasing", label: "บริษัท ซัมมิท แคปปิตอล ลีสซิ่ง จำกัด" },
  { value: "cimb-thai-auto", label: "บริษัท ซีไอเอ็มบี ไทย ออโต้ จำกัด" },
  { value: "t-leasing", label: "บริษัท ที ลีสซิ่ง จำกัด" },
  { value: "next-capital", label: "บริษัท เน็คซ์ แคปปิตอล จำกัด (มหาชน)" },
  { value: "ayudhya-capital-auto-lease", label: "บริษัท อยุธยา แคปปิตอล ออโต้ ลีส จำกัด (มหาชน)" },
  { value: "s11-group", label: "บริษัท เอส 11 กรุ๊ป จำกัด (มหาชน)" },
  { value: "highway", label: "บริษัท ไฮเวย์ จำกัด" },
];

export function getExistingFinanceOptions(collateralType: CollateralType | null) {
  return collateralType === "motorcycle"
    ? motorcycleExistingFinanceOptions
    : existingFinanceOptions;
}

export const verificationMethodOptions: {
  value: VerificationMethod;
  label: string;
}[] = [
  { value: "card", label: "เสียบบัตรประชาชน" },
  { value: "manual", label: "กรอกข้อมูลเอง" },
];

function subModels(entries: [string, string][]): VehicleSubModelOption[] {
  return entries.map(([value, label]) => ({ value, label }));
}

function model(
  value: string,
  label: string,
  entries: [string, string][],
  basePrice: number,
  spec: VehicleModelSpec,
): VehicleModelOption {
  return { value, label, subModels: subModels(entries), basePrice, ...spec };
}

function brand(
  value: string,
  label: string,
  models: VehicleModelOption[],
): VehicleBrandOption {
  return { value, label, models };
}

/**
 * The hand-written catalog, now only what the ratebook does not cover:
 * `truck` (Cartype5 describes a different form -- ยี่ห้อ → จำนวนล้อ → รุ่นแชสซี
 * → ปี → ลักษณะตัวถัง, with no สภาพรถ/ประตู/เกียร์) and `car`, which ที่ดิน still
 * falls back to because it has no collateral form of its own yet.
 * รถยนต์ and มอเตอร์ไซค์ read Ratebook/*.xlsx through src/lib/ratebook.ts.
 */
const vehicleCatalogByCollateralType: Partial<
  Record<VehicleCollateralType, VehicleBrandOption[]>
> = {
  car: [
    brand("toyota", "Toyota", [
      model(
        "vios",
        "Vios",
        [
          ["1.5-j", "1.5 J"],
          ["1.5-e", "1.5 E"],
          ["1.5-g", "1.5 G"],
        ],
        600000,
        {
          carTypeByDoors: { "4": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan"],
        },
      ),
      model(
        "yaris",
        "Yaris",
        [
          ["entry", "1.2 Entry"],
          ["sport", "1.2 Sport"],
          ["premium", "1.2 Premium"],
        ],
        580000,
        {
          carTypeByDoors: { "4": "sedan", "5": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan", "hatchback"],
        },
      ),
      model(
        "fortuner",
        "Fortuner",
        [
          ["standard", "2.4 Standard"],
          ["legender", "2.8 Legender"],
        ],
        1350000,
        {
          carTypeByDoors: { "5": "suv" },
          transmissions: ["auto"],
          bodyTypes: ["suv"],
        },
      ),
      model(
        "hilux-revo",
        "Hilux Revo",
        [
          ["standard-cab", "Standard Cab"],
          ["smart-cab", "Smart Cab"],
          ["double-cab", "Double Cab"],
        ],
        700000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
    ]),
    brand("honda", "Honda", [
      model(
        "city",
        "City",
        [
          ["s", "S"],
          ["v", "V"],
          ["sv", "SV"],
        ],
        650000,
        {
          carTypeByDoors: { "4": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan"],
        },
      ),
      model(
        "civic",
        "Civic",
        [
          ["el", "EL"],
          ["rs", "RS"],
          ["hatchback-rs", "Hatchback RS"],
        ],
        950000,
        {
          carTypeByDoors: { "4": "sedan", "5": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan", "hatchback"],
        },
      ),
      model(
        "cr-v",
        "CR-V",
        [
          ["e", "E"],
          ["el", "EL"],
          ["se", "SE"],
        ],
        1300000,
        {
          carTypeByDoors: { "5": "suv" },
          transmissions: ["auto"],
          bodyTypes: ["suv"],
        },
      ),
    ]),
    brand("isuzu", "Isuzu", [
      model(
        "d-max",
        "D-Max",
        [
          ["spark", "Spark"],
          ["hi-lander", "Hi-Lander"],
          ["v-cross", "V-Cross"],
        ],
        650000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
      model(
        "mu-x",
        "MU-X",
        [
          ["standard", "Standard"],
          ["ultimate", "Ultimate"],
        ],
        1300000,
        {
          carTypeByDoors: { "5": "suv" },
          transmissions: ["auto"],
          bodyTypes: ["suv"],
        },
      ),
    ]),
    brand("nissan", "Nissan", [
      model(
        "almera",
        "Almera",
        [
          ["e", "E"],
          ["v", "V"],
          ["vl", "VL"],
        ],
        550000,
        {
          carTypeByDoors: { "4": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan"],
        },
      ),
      model(
        "navara",
        "Navara",
        [
          ["calibre", "Calibre"],
          ["pro-4x", "Pro-4X"],
        ],
        700000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
    ]),
    brand("mazda", "Mazda", [
      model(
        "mazda2",
        "Mazda2",
        [
          ["s", "S"],
          ["sports-high", "Sports High"],
        ],
        550000,
        {
          carTypeByDoors: { "4": "sedan", "5": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan", "hatchback"],
        },
      ),
      model(
        "cx-5",
        "CX-5",
        [
          ["c", "C"],
          ["sp", "SP"],
        ],
        1200000,
        {
          carTypeByDoors: { "5": "suv" },
          transmissions: ["auto"],
          bodyTypes: ["suv"],
        },
      ),
      model(
        "bt-50",
        "BT-50",
        [
          ["standard-cab", "Standard Cab"],
          ["double-cab", "Double Cab"],
        ],
        700000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
    ]),
    brand("ford", "Ford", [
      model(
        "ranger",
        "Ranger",
        [
          ["xl", "XL"],
          ["xlt", "XLT"],
          ["wildtrak", "Wildtrak"],
        ],
        750000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
      model(
        "everest",
        "Everest",
        [
          ["ambiente", "Ambiente"],
          ["titanium", "Titanium"],
        ],
        1400000,
        {
          carTypeByDoors: { "5": "suv" },
          transmissions: ["auto"],
          bodyTypes: ["suv"],
        },
      ),
    ]),
    brand("mitsubishi", "Mitsubishi", [
      model(
        "triton",
        "Triton",
        [
          ["glx", "GLX"],
          ["gls", "GLS"],
          ["athlete", "Athlete"],
        ],
        650000,
        {
          carTypeByDoors: { "2": "pickup", "4": "pickup" },
          transmissions: ["manual", "auto"],
          bodyTypes: ["pickup"],
        },
      ),
      model(
        "xpander",
        "Xpander",
        [
          ["gls", "GLS"],
          ["ultimate", "Ultimate"],
        ],
        800000,
        {
          carTypeByDoors: { "5": "van" },
          transmissions: ["auto"],
          bodyTypes: ["van"],
        },
      ),
    ]),
    brand("suzuki", "Suzuki", [
      model(
        "swift",
        "Swift",
        [
          ["ga", "GA"],
          ["gl", "GL"],
        ],
        550000,
        {
          carTypeByDoors: { "5": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["hatchback"],
        },
      ),
      model(
        "ciaz",
        "Ciaz",
        [
          ["gl", "GL"],
          ["glx", "GLX"],
        ],
        550000,
        {
          carTypeByDoors: { "4": "sedan" },
          transmissions: ["auto"],
          bodyTypes: ["sedan"],
        },
      ),
    ]),
  ],
  truck: [
    brand("isuzu", "Isuzu", [
      model(
        "ftr",
        "FTR",
        [
          ["4x2", "4x2"],
          ["6x2", "6x2"],
        ],
        2200000,
        {
          carTypeByDoors: { "2": "6-wheel" },
          transmissions: ["manual"],
          bodyTypes: ["cab-chassis", "flatbed", "box"],
        },
      ),
      model(
        "fvr",
        "FVR",
        [
          ["6x2", "6x2"],
          ["6x4", "6x4"],
        ],
        2800000,
        {
          carTypeByDoors: { "2": "10-wheel" },
          transmissions: ["manual"],
          bodyTypes: ["cab-chassis", "flatbed", "box"],
        },
      ),
      model("elf", "ELF", [["standard", "Standard"]], 1400000, {
        carTypeByDoors: { "2": "4-wheel" },
        transmissions: ["manual"],
        bodyTypes: ["cab-chassis", "box"],
      }),
    ]),
    brand("hino", "Hino", [
      model(
        "300-series",
        "300 Series",
        [
          ["standard", "Standard"],
          ["wide-cab", "Wide Cab"],
        ],
        1600000,
        {
          carTypeByDoors: { "2": "4-wheel" },
          transmissions: ["manual"],
          bodyTypes: ["cab-chassis", "box"],
        },
      ),
      model(
        "500-series",
        "500 Series",
        [
          ["4x2", "4x2"],
          ["6x2", "6x2"],
        ],
        2900000,
        {
          carTypeByDoors: { "2": "6-wheel" },
          transmissions: ["manual"],
          bodyTypes: ["cab-chassis", "flatbed", "box"],
        },
      ),
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
      model(
        "fm",
        "FM",
        [
          ["4x2", "4x2"],
          ["6x4", "6x4"],
        ],
        4800000,
        {
          carTypeByDoors: { "2": "10-wheel" },
          transmissions: ["auto"],
          bodyTypes: ["flatbed", "tanker"],
        },
      ),
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
};

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
};

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
};

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
};

export function toVehicleCollateralType(
  collateralType?: CollateralType | null,
): VehicleCollateralType {
  return collateralType === "motorcycle" || collateralType === "truck"
    ? collateralType
    : "car";
}

export function getVehicleBrands(
  collateralType?: CollateralType | null,
): VehicleBrandOption[] {
  return (
    vehicleCatalogByCollateralType[toVehicleCollateralType(collateralType)] ?? []
  );
}

export function getVehicleModels(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
): VehicleModelOption[] {
  return (
    getVehicleBrands(collateralType).find(
      (option) => option.value === brandValue,
    )?.models ?? []
  );
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
  );
}

export function getVehicleModelSpec(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
): VehicleModelSpec | undefined {
  return getVehicleModels(collateralType, brandValue).find(
    (option) => option.value === modelValue,
  );
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
    getVehicleModelSpec(collateralType, brandValue, modelValue)
      ?.carTypeByDoors ?? {};
  return carDoorsOptions.filter((option) => option.value in carTypeByDoors);
}

// ประเภทรถ is a fact about the vehicle, not a question for the user: the รุ่น's own
// จำนวนประตู → ประเภทรถ table decides it. Undefined until both are known.
export function getVehicleCarType(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
  modelValue?: string,
  doors?: string,
): string | undefined {
  return getVehicleModelSpec(collateralType, brandValue, modelValue)
    ?.carTypeByDoors[doors ?? ""];
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
  );
}


export const carYearOptions: { value: string; label: string }[] = Array.from(
  { length: 15 },
  (_, index) => {
    const year = 2024 - index;
    return { value: String(year), label: `${year} (${year + 543})` };
  },
);

export const carConditionOptions: { value: string; label: string }[] = [
  { value: "original", label: "สภาพเดิม" },
  { value: "gas", label: "ติดตั้งแก๊ส/เคยติดตั้งแก๊ส" },
  { value: "modified", label: "แต่งซิ่ง/ติดเครื่องเสียงพิเศษ" },
];

export const carDoorsOptions: { value: string; label: string }[] = [
  { value: "2", label: "2 ประตู" },
  // รถตู้ lists 3-door bodies, so the ratebook needs this one too.
  { value: "3", label: "3 ประตู" },
  { value: "4", label: "4 ประตู" },
  { value: "5", label: "5 ประตู" },
];

export const carTransmissionOptions: { value: string; label: string }[] = [
  { value: "manual", label: "เกียร์ธรรมดา" },
  { value: "auto", label: "เกียร์อัตโนมัติ" },
];

export const mockCardCustomer: CardCustomerData = {
  name: "สดใส สะอาดเอี่ยม",
  idCardNumber: "1-2345-67890-12-3",
  gender: "male",
  birthDate: "1990-05-20",
};

/** The card a keyed-in customer inserts later (sidebar "Dipchip" / "ตรวจ eNCB") — a different person from `mockCardCustomer`. */
export const mockKeyInCardCustomer: CardCustomerData = {
  name: "สมชาย ใจดี",
  idCardNumber: "3-2345-67890-32-1",
  gender: "male",
  birthDate: "1990-05-20",
};

/** Fixed values for the "ตรวจ eNCB" walkthrough: it always returns this grade, and its OTP preview shows this phone. */
export const mockEncbCheck: {
  ncbGrade: NcbGrade;
  otpPhone: string;
} = {
  ncbGrade: "A02",
  otpPhone: "0875092348",
};

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

export const GENDER_LABELS: Record<Gender, string> = {
  male: "ชาย",
  female: "หญิง",
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

function roundToNearestThousand(amount: number): number {
  return Math.round(amount / 1000) * 1000;
}

/**
 * ราคาประเมิน is no longer estimated: รถยนต์ and มอเตอร์ไซค์ read it off the
 * ratebook row the user picked, and รถบรรทุก still gets the old depreciation
 * estimate from vehicle-options.ts. Everything below is derived from it.
 */
const MOTORCYCLE_EASY_APPROVAL_MAX_AMOUNT = 50000;
const CAR_EASY_APPROVAL_MAX_AMOUNT = 500000;

/** 70% LTV, unless that exceeds `cap` — then the cap, with %LTV recomputed as cap ÷ ราคาประเมิน. */
function getCappedEasyApprovalAmount(
  appraisalPrice: number,
  cap: number,
): Pick<ProductGuidePlan, "maxAmount" | "maxLtvLabel"> {
  const amount = roundToNearestThousand(appraisalPrice * 0.7);
  if (amount <= cap || appraisalPrice <= 0) {
    return { maxAmount: amount, maxLtvLabel: "ไม่เกิน 70% LTV" };
  }
  const ltvPercent = (cap / appraisalPrice) * 100;
  return {
    maxAmount: cap,
    maxLtvLabel: `ไม่เกิน ${formatRatePercent(ltvPercent)}% LTV`,
  };
}

function getMotorcycleGuidePlans(
  appraisalPrice: number,
  refinanceStatus: RefinanceStatus | null,
): ProductGuidePlan[] {
  const fullAmountPlan: ProductGuidePlan = {
    title: "รับเงินเต็ม อนุมัติไว",
    maxLtvLabel: "ไม่เกิน 100% LTV",
    maxAmount: appraisalPrice,
    bullets:
      refinanceStatus === "still-paying"
        ? [
            "ถ้าไม่ใช่เกรด NCB A01-A04, U02 ค่างวดใหม่ต้องลดลงอย่างน้อย 20% จากค่างวดเก่า",
            "ทำบัตรติดล้อ (A01-A04, U02)",
          ]
        : ["รับ NCB ทุกเกรด", "วันครอบครองขั้นต่ำ ขึ้นอยู่กับ NCB Grade"],
  };
  const highLimitPlan: ProductGuidePlan = {
    title: "วงเงินสูง อนุมัติไว",
    maxLtvLabel: "101% - 130% LTV",
    maxAmount: roundToNearestThousand(appraisalPrice * 1.3),
    bullets: ["รับเฉพาะ NCB เกรด A01-A04, U02"],
  };

  if (refinanceStatus === "still-paying") return [fullAmountPlan, highLimitPlan];
  return [
    {
      title: "Pawn Shop อนุมัติง่าย เงื่อนไขน้อย",
      ...getCappedEasyApprovalAmount(
        appraisalPrice,
        MOTORCYCLE_EASY_APPROVAL_MAX_AMOUNT,
      ),
      bulletsHeading: "ลูกค้าต้องไม่เข้าเงื่อนไข ทั้ง 3 ข้อ พร้อมกัน",
      bullets: [
        "ไม่ใช่ A01-A04, U02",
        "ไม่ใช่ ข้าราชการ พนักงานเอกชน พนักงานรัฐวิสาหกิจ",
        "ครอบครองน้อยกว่า 45 วัน",
      ],
    },
    fullAmountPlan,
    highLimitPlan,
  ];
}

export function getProductGuideData(
  appraisalPrice: number = 0,
  collateralType: CollateralType | null = null,
  refinanceStatus: RefinanceStatus | null = null,
): ProductGuideData {
  const isCar = collateralType === "car";
  const isMotorcycle = collateralType === "motorcycle";
  const minLtvPercent =
    isMotorcycle && refinanceStatus === "still-paying" ? 100 : 70;
  const maxLtvPercent = isMotorcycle ? 130 : 160;
  return {
    appraisalPrice,
    approvedRange: {
      min: roundToNearestThousand((appraisalPrice * minLtvPercent) / 100),
      max: roundToNearestThousand((appraisalPrice * maxLtvPercent) / 100),
    },
    approvedLtvBadges: [`${minLtvPercent}% LTV`, `${maxLtvPercent}% LTV`],
    plans: isMotorcycle
      ? getMotorcycleGuidePlans(appraisalPrice, refinanceStatus)
      : [
      {
        title: "Pawn Shop อนุมัติง่าย LTV ต่ำ",
        ...(isCar
          ? getCappedEasyApprovalAmount(
              appraisalPrice,
              CAR_EASY_APPROVAL_MAX_AMOUNT,
            )
          : {
              maxLtvLabel: "ไม่เกิน 70% LTV",
              maxAmount: roundToNearestThousand(appraisalPrice * 0.7),
            }),
        bullets: isCar
          ? [
              "Max 70% LTV เฉพาะ NCB เกรด A01-A03",
              "วันครอบครองอย่างน้อย 60-210 วัน ขึ้นอยู่กับเกรด NCB Grade",
            ]
          : [
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
        bullets: isCar
          ? ["รับเฉพาะ NCB เกรด A01, A02", "ต้องมีเอกสารแสดงรายได้", "งานนอกอำนาจ"]
          : ["NCB A01-A02", "เอกสารแสดงรายได้", "งานนอกอำนาจ"],
      },
    ],
  };
}

/** A single value, or a low-high band rendered as "low - high". */
type NumberOrRange = number | { min: number; max: number };

type ProductRule = {
  id: string;
  title: string;
  tags: ProductCatalogTag[];
  /** Percent of the appraisal price; also what the approved amount is derived from. */
  ltv: NumberOrRange;
  /** Percent per month. */
  monthlyRate: NumberOrRange;
  /** ลดต้นลดดอก, percent per year. */
  annualReduction: NumberOrRange;
  /** CSV "Interest Type". Flat products are labelled ดอกเบี้ยคงที่, not ลดต้นลดดอก. */
  interestType?: "effective" | "flat";
  ncbGradeLabel: string;
  ncbGradeTone: ProductCatalogItem["ncbGradeTone"];
  bookStatusLabel: string;
  primaryActionLabel: string;
  primaryActionVariant: ProductCatalogItem["primaryActionVariant"];
  /** CSV "Nationality". Omitted means Thai — every kept row is Thai except mc-no-transfer. */
  nationality?: "Thai" | "Other";
  minAppraisalPrice?: number;
  requiresTopTierBrand?: boolean;
};

// Brands whose resale value is strong enough for the premium products. Everything
// else in the catalog only qualifies for that collateral type's baseline product.
const topTierBrandsByCollateralType: Record<VehicleCollateralType, string[]> = {
  car: ["toyota", "honda", "isuzu"],
  motorcycle: ["honda", "yamaha"],
  truck: ["isuzu", "hino", "fuso"],
};

// Product programs transcribed from csv/List product program_140726(Car|MC|Truck|Land).csv.
// Rows kept: Program status = Normalized, plus the two Car TEST programs the prototype
// already shipped (วงเงินสูง 80–130%, อนุมัติง่าย 70%) so saved selections still resolve.
// ltv ← Min/Max %LTV · monthlyRate ← Min/Max Interest (Month) · annualReduction ←
// Min/Max Interest (Year) · bookStatusLabel ← Sub category ("… Loan" = ไม่โอนเล่ม,
// "… HP" = โอนเล่ม) · interestType ← Interest Type.
//
// minAppraisalPrice and requiresTopTierBrand have no CSV counterpart (Car Brand is "All"
// on nearly every row). They stay hand-tuned so the catalog still narrows as the vehicle
// is filled in; deriving them from Min Amount ÷ Max %LTV would put every gate under
// ~10,000 baht and show every card at all times.
//
// The CSV Tag column is only filled in for Car (13 of 55 rows) and empty for MC, Truck and
// Land, so tags below follow one derivation table, using the app's existing wording:
//
//   ดอกเบี้ยถูก     green   Min Interest (Year) in the type's cheapest band
//                           (Car ≤13%, MC ≤13.44%, Truck ≤15%, Land ≤9%)   [CSV "ดอกถูก"]
//   นอกอำนาจ        red     NCB Grade limited to A01/A02 AND Required Income Document = Yes
//   ใช้เอกสารรายได้  purple  Required Income Document = Yes
//   รับทุกเกรด      purple  NCB Grade = All                             [CSV "รับทุก Grade"]
//   อนุมัติไว        amber   name contains "อนุมัติง่าย", or no income doc and no guarantor
//   <n>% LTV        pink    Max %LTV ≤ 80                            [CSV "LTV 60%/70%"]
//   วงเงินสูง        amber   Max %LTV ≥ 130
//   ดอกเบี้ยคงที่    pink    Interest Type = Flat
//   ไม่ต้องค้ำ       green   Required Guarantor = No on a program that normally needs one
//   ต้องมีผู้ค้ำ      red     Required Guarantor = Yes
//   ผ่อนนาน         purple  Max Tenor ≥ 72
//
// "(M Dealer)" programs (Program Type = Dealer New/Used) are intentionally left out.
const productRulesByCollateralType: Record<CollateralType, ProductRule[]> = {
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
      id: "no-transfer-normal-risk",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงปกติ",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltv: 80,
      monthlyRate: { min: 0.94, max: 1.13 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "high-limit-normal-risk",
      title: "โครงการวงเงินสูง ความเสี่ยงปกติ เก๋ง กระบะ",
      tags: [
        { label: "รับทุกเกรด", tone: "purple" },
        { label: "วงเงินสูง", tone: "amber" },
      ],
      ltv: { min: 80, max: 130 },
      monthlyRate: { min: 0.94, max: 1.13 },
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
      title: "โครงการอนุมัติง่าย LTV ต่ำ เก๋ง กระบะ",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "70% LTV", tone: "pink" },
      ],
      ltv: 70,
      monthlyRate: { min: 0.94, max: 1.13 },
      annualReduction: { min: 20, max: 24 },
      ncbGradeLabel: "A01 - A03",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "easy-approval-non-a",
      title: "โครงการอนุมัติง่าย LTV ต่ำ เก๋ง กระบะ",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "60% LTV", tone: "pink" },
      ],
      ltv: 60,
      monthlyRate: { min: 0.98, max: 1.13 },
      annualReduction: { min: 21, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "transfer-book",
      title: "ผลิตภัณฑ์แบบโอนเล่ม เก๋ง กระบะ",
      tags: [
        { label: "วงเงินสูง", tone: "amber" },
        { label: "รับทุกเกรด", tone: "purple" },
        { label: "ดอกเบี้ยคงที่", tone: "pink" },
      ],
      ltv: 130,
      monthlyRate: { min: 0.65, max: 2.05 },
      annualReduction: { min: 7.8, max: 24.0 },
      interestType: "flat",
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 200000,
    },
  ],
  motorcycle: [
    {
      id: "mc-no-transfer",
      title: "ผลิตภัณฑ์ไม่โอนเล่ม สำหรับกลุ่มบัตรขึ้นต้น 0, 6",
      tags: [{ label: "รับทุกเกรด", tone: "purple" }],
      ltv: 100,
      monthlyRate: 1.13,
      annualReduction: 24,
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
      nationality: "Other",
    },
    {
      id: "mc-high-limit",
      title: "โครงการวงเงินสูง สำหรับลูกค้าเกรดดี",
      tags: [
        { label: "วงเงินสูง", tone: "amber" },
        { label: "รับทุกเกรด", tone: "purple" },
      ],
      ltv: 130,
      monthlyRate: 1.13,
      annualReduction: 24,
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
      title: "โครงการอนุมัติง่าย LTV ต่ำ",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "60% LTV", tone: "pink" },
        { label: "รับทุกเกรด", tone: "purple" },
      ],
      ltv: 60,
      monthlyRate: 1.13,
      annualReduction: 24,
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    // Motorcycle HP. LoanCalBar's book-status default is the first bookStatusLabel in
    // this list, so the ungated ไม่โอนเล่ม rules above must stay first.
    {
      id: "mc-transfer-book",
      title: "สินเชื่อทะเบียนรถจักรยานยนต์ แบบโอนเล่ม",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "รับทุกเกรด", tone: "purple" },
        { label: "ดอกเบี้ยคงที่", tone: "pink" },
      ],
      ltv: 100,
      monthlyRate: { min: 1.06, max: 1.12 },
      annualReduction: { min: 12.72, max: 13.44 },
      interestType: "flat",
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
  ],
  truck: [
    {
      id: "truck-no-transfer",
      title: "สินเชื่อทะเบียนรถบรรทุก เป้า D",
      tags: [
        { label: "นอกอำนาจ", tone: "red" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
        { label: "วงเงินสูง", tone: "amber" },
      ],
      ltv: 120,
      monthlyRate: 0.89,
      annualReduction: 18,
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "ตรวจ eNCB",
      primaryActionVariant: "outline",
      minAppraisalPrice: 800000,
      requiresTopTierBrand: true,
    },
    {
      id: "truck-target-e",
      title: "สินเชื่อทะเบียนรถบรรทุก เป้า E",
      tags: [{ label: "ใช้เอกสารรายได้", tone: "purple" }],
      ltv: 100,
      monthlyRate: { min: 0.98, max: 1.03 },
      annualReduction: { min: 21, max: 22 },
      ncbGradeLabel: "Non A01-A02",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "truck-high-limit",
      title: "สินเชื่อทะเบียนรถบรรทุก เป้า D (วงเงิน 2 ล้านขึ้นไป)",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "วงเงินสูง", tone: "amber" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
      ],
      ltv: 150,
      monthlyRate: { min: 0.42, max: 0.7 },
      annualReduction: { min: 9, max: 15 },
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 1000000,
      requiresTopTierBrand: true,
    },
    {
      id: "truck-easy-approval",
      title: "สินเชื่อทะเบียนรถบรรทุก เป้า E PAWNSHOP",
      tags: [
        { label: "รับทุกเกรด", tone: "purple" },
        { label: "80% LTV", tone: "pink" },
      ],
      ltv: 80,
      monthlyRate: { min: 1.03, max: 1.13 },
      annualReduction: { min: 22, max: 24 },
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "ไม่โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "truck-transfer-book",
      title: "สินเชื่อทะเบียนรถบรรทุก เป้า D - แบบโอนเล่ม",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
        { label: "ดอกเบี้ยคงที่", tone: "pink" },
      ],
      ltv: 120,
      monthlyRate: 0.8,
      annualReduction: 9.6,
      interestType: "flat",
      ncbGradeLabel: "A01, A02",
      ncbGradeTone: "blue",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "truck-c2c",
      title: "รถบรรทุกซื้อขาย R Dealer",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "รับทุกเกรด", tone: "purple" },
        { label: "ต้องมีผู้ค้ำ", tone: "red" },
        { label: "ผ่อนนาน", tone: "purple" },
      ],
      ltv: 100,
      monthlyRate: { min: 0.54, max: 1.04 },
      annualReduction: { min: 6.48, max: 12.48 },
      interestType: "flat",
      ncbGradeLabel: "ทุกเกรด",
      ncbGradeTone: "green",
      bookStatusLabel: "โอนเล่ม",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 200000,
    },
  ],
  // Land has no brand/model, so no requiresTopTierBrand gates. bookStatusLabel carries
  // จำนำ / จำนอง instead of a book transfer, which keeps LoanCalBar on the effective-rate
  // branch — matching Interest Type = Effective on every Land row.
  land: [
    {
      id: "land-pawn",
      title: "สินเชื่อเพื่อคนมีที่ดิน (จำนำ)",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "ไม่ต้องค้ำ", tone: "green" },
        { label: "70% LTV", tone: "pink" },
      ],
      ltv: 70,
      monthlyRate: 0.7,
      annualReduction: 15,
      ncbGradeLabel: "ยกเว้น L05",
      ncbGradeTone: "green",
      bookStatusLabel: "จำนำ",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "land-mortgage",
      title: "สินเชื่อเพื่อคนมีที่ดิน (จำนอง)",
      tags: [
        { label: "อนุมัติไว", tone: "amber" },
        { label: "ไม่ต้องค้ำ", tone: "green" },
        { label: "ผ่อนนาน", tone: "purple" },
      ],
      ltv: 70,
      monthlyRate: 0.7,
      annualReduction: 15,
      ncbGradeLabel: "ยกเว้น L05",
      ncbGradeTone: "green",
      bookStatusLabel: "จำนอง",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
    },
    {
      id: "land-mortgage-high",
      title: "สินเชื่อเพื่อคนมีที่ดิน (จำนอง) วงเงินสูง",
      tags: [
        { label: "ดอกเบี้ยถูก", tone: "green" },
        { label: "ใช้เอกสารรายได้", tone: "purple" },
        { label: "ต้องมีผู้ค้ำ", tone: "red" },
        { label: "ผ่อนนาน", tone: "purple" },
      ],
      ltv: { min: 50, max: 95 },
      monthlyRate: { min: 0.42, max: 0.7 },
      annualReduction: { min: 9, max: 15 },
      ncbGradeLabel: "ยกเว้น L05, U05",
      ncbGradeTone: "blue",
      bookStatusLabel: "จำนอง",
      primaryActionLabel: "เลือก",
      primaryActionVariant: "filled",
      minAppraisalPrice: 210000,
    },
  ],
};

// LeadLoanInfoCard still reads the monthly rate from its formatted label.
function formatRange(
  spec: NumberOrRange,
  format: (value: number) => string,
): string {
  return typeof spec === "number"
    ? format(spec)
    : `${format(spec.min)} - ${format(spec.max)}`;
}

export type ProductCatalogContext = {
  carInfo: CarInfo;
  collateralType?: CollateralType | null;
  loanPurpose?: LoanPurpose | null;
  refinanceStatus?: RefinanceStatus | null;
  appraisalPrice: number;
};

function isTopTierBrand(
  collateralType: CollateralType | null | undefined,
  brandValue?: string,
): boolean {
  // Land collateral has no brand to judge, so a brand gate can never exclude it.
  if (collateralType === "land") return true;
  // รถยนต์/มอเตอร์ไซค์ brand values come from the ratebook in upper case
  // (e.g. "TOYOTA"); รถบรรทุก's mock catalog uses lower case slugs.
  const normalized = (brandValue ?? "").toLowerCase();
  return topTierBrandsByCollateralType[toVehicleCollateralType(collateralType)].some(
    (brand) => brand.toLowerCase() === normalized,
  );
}

function isRuleEligible(
  rule: ProductRule,
  context: ProductCatalogContext,
): boolean {
  if ((rule.nationality ?? "Thai") !== "Thai") return false;
  if (
    rule.minAppraisalPrice != null &&
    context.appraisalPrice < rule.minAppraisalPrice
  ) {
    return false;
  }
  if (
    rule.requiresTopTierBrand &&
    !isTopTierBrand(context.collateralType, context.carInfo.brand)
  ) {
    return false;
  }
  return true;
}

const ALL_NCB_GRADES_LABEL = "ทุกเกรด";

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
];

const allGradeInterestRows: ProductCatalogInterestRow[] = [
  { ncbGrade: "A01 - A03", rates: ["20.00%", "21.00%", "22.00%"] },
  { ncbGrade: "A04 - A05", rates: ["21.00%", "22.00%", "24.00%"] },
  { ncbGrade: "U01 - U05", rates: ["23.00%", "23.00%", "24.00%"] },
  { ncbGrade: "L01, L05", rates: ["23.00%", "23.00%", "24.00%"] },
];

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
    { label: "อายุ", value: "20 - 68 ปี" },
    { label: "เกรด NCB", value: "ทุกเกรด" },
    { label: "ระยะอาศัยที่อยู่ปัจจุบัน", value: "1- 99 ปี" },
    { label: "ผู้ค้ำประกัน", value: "ไม่จำเป็น", tone: "success" },
  ],
};

// The card shows the terse "Non A01-A03"; the drawer spells it out in Thai.
function toBorrowerNcbGradeLabel(ncbGradeLabel: string): string {
  if (ncbGradeLabel.startsWith("Non ")) {
    return `ทุกเกรดยกเว้น ${ncbGradeLabel.slice("Non ".length)}`;
  }
  return ncbGradeLabel;
}

// "ประเภทจดทะเบียน" (รย. book type) differs by vehicle: มอเตอร์ไซค์ books are รย.12/รย.17,
// not the รย.1-3 used for รถยนต์/รถบรรทุก.
function getCollateralLabelAndRegistrationTypes(
  collateralType: CollateralType | null | undefined,
): { label: string; registrationTypes: string } {
  if (collateralType === "motorcycle") {
    return { label: "รถจักรยานยนต์", registrationTypes: "ร.ย.12, ร.ย.17" };
  }
  return { label: "รถยนต์", registrationTypes: "ร.ย.1, ร.ย.2, ร.ย.3" };
}

function toProductDetail(
  rule: ProductRule,
  collateralType: CollateralType | null | undefined,
): ProductCatalogDetail {
  const maxLtv = typeof rule.ltv === "number" ? rule.ltv : rule.ltv.max;
  const isAllGrades = rule.ncbGradeLabel === ALL_NCB_GRADES_LABEL;
  const { label: collateralLabel, registrationTypes } =
    getCollateralLabelAndRegistrationTypes(collateralType);
  return {
    ...productDetailTemplate,
    collateralLabel,
    collateralConditions: productDetailTemplate.collateralConditions.map((condition) =>
      condition.label === "ประเภทจดทะเบียน"
        ? { ...condition, value: registrationTypes }
        : condition,
    ),
    borrowerConditions: productDetailTemplate.borrowerConditions.map((condition) => {
      // "เกรด NCB" must match the grade shown on the product card, not the mock's blanket A01 - A05.
      if (condition.label === "เกรด NCB") {
        return { ...condition, value: toBorrowerNcbGradeLabel(rule.ncbGradeLabel) };
      }
      // มอเตอร์ไซค์ allows a wider borrower age range than รถยนต์/รถบรรทุก.
      if (condition.label === "อายุ" && collateralType === "motorcycle") {
        return { ...condition, value: "20 - 75 ปี" };
      }
      return condition;
    }),
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
      : [
          {
            ncbGrade: rule.ncbGradeLabel,
            rates: allGradeInterestRows[0].rates,
          },
        ],
  };
}

function toCatalogItem(
  rule: ProductRule,
  appraisalPrice: number,
  collateralType: CollateralType | null | undefined,
): ProductCatalogItem {
  // Keep prototype copy/tags; borrow only the authoritative amount limits by stable ID.
  const catalogRule = catalogRulesByCollateralType[collateralType ?? "car"].find(
    (candidate) => candidate.id === rule.id,
  );
  if (!catalogRule) {
    throw new Error(`Missing product catalog amount limits for ${rule.id}`);
  }
  const maxLtvPercent = typeof rule.ltv === "number" ? rule.ltv : rule.ltv.max;
  const loanLimits = calculateProductLoanLimits({
    appraisalPrice,
    maxLtvPercent,
    minAmount: catalogRule.minAmount,
    maxAmount: catalogRule.maxAmount,
  });
  return {
    id: rule.id,
    appraisalPrice,
    maxLtvPercent,
    minAnnualInterestPercent:
      typeof rule.annualReduction === "number"
        ? rule.annualReduction
        : rule.annualReduction.min,
    loanLimits,
    minAmount: catalogRule.minAmount,
    maxAmount: catalogRule.maxAmount,
    title: rule.title,
    tags: rule.tags,
    ltvLabel: `${formatRange(rule.ltv, (value) => `${value}%`)} LTV`,
    approvedAmount: formatProductLoanLimits(
      loanLimits,
      typeof rule.ltv === "number" ? undefined : (appraisalPrice * rule.ltv.min) / 100,
    ),
    ncbGradeLabel: rule.ncbGradeLabel,
    ncbGradeTone: rule.ncbGradeTone,
    bookStatusLabel: rule.bookStatusLabel,
    interestRateLabel: `(${formatRange(
      rule.monthlyRate,
      (value) => `${value.toFixed(2)}%`,
    )} ต่อเดือน)`,
    interestReductionLabel: `${
      rule.interestType === "flat" ? "ดอกเบี้ยคงที่" : "ลดต้นลดดอก"
    } ${formatRange(
      rule.annualReduction,
      // 24.6 shows as 24 -- display-only, the underlying rate is untouched.
      (value) => `${value === 24.6 ? 24 : value}%`,
    )} ต่อปี`,
    primaryActionLabel: rule.primaryActionLabel,
    primaryActionVariant: rule.primaryActionVariant,
    detail: toProductDetail(rule, collateralType),
  };
}

function getVehicleTypeChip(context: ProductCatalogContext): string {
  if (context.collateralType === "land") return "ที่ดิน";
  const vehicleCollateralType = toVehicleCollateralType(context.collateralType);
  if (vehicleCollateralType === "motorcycle") return "มอเตอร์ไซค์";
  if (vehicleCollateralType === "truck") return "รถบรรทุก";
  const doorsLabel = carDoorsOptions.find(
    (option) => option.value === context.carInfo.doors,
  )?.label;
  return doorsLabel ? `รถเก๋ง กระบะ ${doorsLabel}` : "รถเก๋ง กระบะ ตู้";
}

export function getProductCatalogData(
  context: ProductCatalogContext,
): ProductCatalogData {
  // Keyed on the full CollateralType, not toVehicleCollateralType — land has its own set.
  const rules = productRulesByCollateralType[context.collateralType ?? "car"];

  return {
    filterChips: [
      getVehicleTypeChip(context),
      loanPurposeOptions.find((option) => option.value === context.loanPurpose)
        ?.description ?? "จำนำทะเบียน",
      refinanceStatusOptions.find(
        (option) => option.value === context.refinanceStatus,
      )?.description ?? "ไม่ใช่รีไฟแนนซ์",
    ],
    gradeFilterLabel: "ทุกเกรด",
    items: rules
      .filter((rule) => isRuleEligible(rule, context))
      .map((rule) => toCatalogItem(rule, context.appraisalPrice, context.collateralType))
      .filter((item) => item.loanLimits.status === "available"),
  };
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
    context.collateralType ?? "car"
  ].find((candidate) => candidate.id === productId);
  return rule ? toCatalogItem(rule, context.appraisalPrice, context.collateralType) : null;
}

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
];
