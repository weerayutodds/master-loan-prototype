// Generates src/lib/product-catalog-data.ts from csv/List product program_140726(*).csv.
//
// Run: npm run generate:catalog
//
// Why a generator and not a runtime read: getProductCatalogData is called from
// RatebookForm.tsx, which is a client component, so the rules have to be in the
// client bundle. Reading csv/ with fs at request time is not an option.
//
// Why a generator and not hand-transcription: the CSVs carry 99 Normalized rows.
// The previous hand-written table covered 20 of them, and its tags had drifted
// from the derivation rules written in its own comment. Deriving everything here
// means the data cannot drift from the CSV again.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = join(ROOT, "src/lib/product-catalog-data.ts");

export const SOURCES = [
  { collateralType: "car", file: "List product program_140726(Car).csv" },
  { collateralType: "motorcycle", file: "List product program_140726(MC).csv" },
  { collateralType: "truck", file: "List product program_140726(Truck).csv" },
  { collateralType: "land", file: "List product program_140726(Land).csv" },
];

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

/** Minimal RFC4180 reader: the files quote any field containing a comma. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      // Close the row on \n, and on a bare \r (old Mac line endings).
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

export function readRows({ collateralType, file }) {
  const text = readFileSync(join(ROOT, "csv", file), "utf8").replace(/^﻿/, "");
  const [header, ...body] = parseCsv(text);
  const keys = header.map((key) => key.trim());

  return body.map((cells, index) => {
    const record = {};
    keys.forEach((key, keyIndex) => {
      record[key] = (cells[keyIndex] ?? "").trim();
    });
    // Line number as seen in an editor, so findings can cite "Car.csv:8".
    return { collateralType, file, line: index + 2, csv: record };
  });
}

// ---------------------------------------------------------------------------
// Field readers. CSV uses "-", "No" and "" interchangeably for "not applicable".
// ---------------------------------------------------------------------------

const BLANK = new Set(["", "-", "--", "no", "n/a"]);

function isBlank(value) {
  return BLANK.has(String(value ?? "").trim().toLowerCase());
}

function readNumber(value) {
  if (isBlank(value)) return null;
  const parsed = Number(String(value).replace(/[,%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function readBoolean(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "yes") return true;
  if (normalized === "no") return false;
  return null;
}

function readText(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" || trimmed === "-" ? null : trimmed.replace(/\s+/g, " ");
}

/** A single value collapses to a number; a real band becomes {min,max}. */
function readSpan(minRaw, maxRaw) {
  const min = readNumber(minRaw);
  const max = readNumber(maxRaw);
  if (min == null && max == null) return null;
  if (min == null) return max;
  if (max == null) return min;
  return min === max ? max : { min, max };
}

function readRange(minRaw, maxRaw) {
  const min = readNumber(minRaw);
  const max = readNumber(maxRaw);
  return min == null && max == null ? null : { min, max };
}

function spanMax(span) {
  if (span == null) return null;
  return typeof span === "number" ? span : span.max;
}

function spanMin(span) {
  if (span == null) return null;
  return typeof span === "number" ? span : span.min;
}

// ---------------------------------------------------------------------------
// Enum normalisation
// ---------------------------------------------------------------------------

const PROGRAM_TYPES = {
  new: "new",
  topup: "topup",
  "top up": "topup",
  refinance: "refinance",
  "dealer (new)": "dealer-new",
  "dealer (used)": "dealer-used",
  c2c: "c2c",
  // Truck.csv:97 spells this "Dealer" while its Juristic twin on :98 spells the
  // same product "C2C". Same product, inconsistent data entry -- treat as C2C.
  dealer: "c2c",
};

function readProgramType({ csv, file, line }) {
  const key = csv["Program Type"].trim().toLowerCase();
  const mapped = PROGRAM_TYPES[key];
  if (!mapped) throw new Error(`${file}:${line} unknown Program Type ${JSON.stringify(csv["Program Type"])}`);
  return mapped;
}

function readCategory({ csv, file, line }) {
  const key = csv.Category.trim().toLowerCase();
  if (key === "term loan") return "term-loan";
  if (key === "tlc") return "tlc";
  throw new Error(`${file}:${line} unknown Category ${JSON.stringify(csv.Category)}`);
}

function readInterestType({ csv, file, line }) {
  const key = csv["Interest Type"].trim().toLowerCase();
  if (key === "effective") return "effective";
  if (key === "flat") return "flat";
  throw new Error(`${file}:${line} unknown Interest Type ${JSON.stringify(csv["Interest Type"])}`);
}

// Sub category doubles as the book-transfer status: "... Loan" keeps the book,
// "... HP" transfers it, and Land is pledged (จำนำ) or mortgaged (จำนอง).
const BOOK_STATUS = {
  "car loan": "ไม่โอนเล่ม",
  "motorcycle loan": "ไม่โอนเล่ม",
  "truck loan": "ไม่โอนเล่ม",
  "car hp": "โอนเล่ม",
  "motorcycle hp": "โอนเล่ม",
  "truck hp": "โอนเล่ม",
  "land loan": "จำนำ",
  "land mortgage": "จำนอง",
};

function readBookStatus({ csv, file, line }) {
  const key = csv["Sub category"].trim().toLowerCase();
  const mapped = BOOK_STATUS[key];
  if (!mapped) throw new Error(`${file}:${line} unknown Sub category ${JSON.stringify(csv["Sub category"])}`);
  return mapped;
}

const ALL_NCB_GRADES_LABEL = "ทุกเกรด";

/**
 * Keeps the CSV wording but in the app's voice: "All" is the existing
 * ทุกเกรด literal the catalog filters on, and "Exclude" reads as ยกเว้น.
 * Comma spacing is normalised so "A01,A02" and "A01, A02" stop being two values.
 */
function readNcbGradeLabel(raw) {
  const value = raw.trim().replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ");
  if (value.toLowerCase() === "all") return ALL_NCB_GRADES_LABEL;
  if (/^exclude /i.test(value)) return value.replace(/^exclude /i, "ยกเว้น ");
  if (/^not /i.test(value)) return value.replace(/^not /i, "ยกเว้น ");
  // A bare band reads better spaced; "Non A01-A03" is left alone on purpose.
  return value.replace(/^([AUL]\d{2})-([AUL]\d{2})$/, "$1 - $2");
}

/**
 * blue = the program only accepts a named set of good grades, or rules out more
 * than one. green = open to everyone, or only narrowly restricted.
 * No CSV column carries this; it reproduces the tone the hand-written table used.
 */
function readNcbGradeTone(label) {
  if (label === ALL_NCB_GRADES_LABEL) return "green";
  if (/^ยกเว้น /.test(label)) return label.split(",").length > 1 ? "blue" : "green";
  if (/^(Non|ยกเว้น)/i.test(label)) return "green";
  return /^[AUL]\d{2}/.test(label) ? "blue" : "green";
}

// ---------------------------------------------------------------------------
// Row selection
// ---------------------------------------------------------------------------

// Program status = Normalized is the live set. Five of the pinned rows below are
// TEST rather than Normalized; they are kept anyway because the prototype already
// ships them and a customer may have selected one -- dropping a row would strand
// its selected_product_id.
//
// selected_product_id (db/schema.sql) stores these ids, and
// findProductCatalogItemById rehydrates a saved selection from them, so every id
// that has ever shipped has to keep pointing at the same CSV row. `expect` is the
// product name on that row -- asserted so a re-exported CSV that shifts its rows
// fails loudly instead of quietly re-pointing an id at a different program.
const STABLE_IDS = [
  { collateralType: "car", line: 8, id: "no-transfer-low-risk", expect: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงต่ำ" },
  { collateralType: "car", line: 9, id: "no-transfer-normal-risk", expect: "ผลิตภัณฑ์ไม่โอนเล่ม ความเสี่ยงปกติ" },
  { collateralType: "car", line: 11, id: "high-limit-normal-risk", expect: "โครงการวงเงินสูง ความเสี่ยงปกติ เก๋ง กระบะ" },
  { collateralType: "car", line: 14, id: "easy-approval-low-ltv", expect: "โครงการอนุมัติง่าย LTV ต่ำ เก๋ง กระบะ" },
  { collateralType: "car", line: 15, id: "easy-approval-non-a", expect: "โครงการอนุมัติง่าย LTV ต่ำ เก๋ง กระบะ" },
  { collateralType: "car", line: 30, id: "transfer-book", expect: "ผลิตภัณฑ์แบบโอนเล่ม เก๋ง กระบะ" },
  { collateralType: "motorcycle", line: 4, id: "mc-dealer-used", expect: "โครงการรถซื้อขายมือ2 (M Dealer) - Branch model (Model 1)" },
  { collateralType: "motorcycle", line: 10, id: "mc-no-transfer", expect: "ผลิตภัณฑ์ไม่โอนเล่ม สำหรับกลุ่มคนที่บัตรประจำตัวขึ้นต้นด้วย 0,6" },
  { collateralType: "motorcycle", line: 17, id: "mc-easy-approval", expect: "โครงการอนุมัติง่าย LTV ต่ำ" },
  { collateralType: "motorcycle", line: 20, id: "mc-high-limit", expect: "โครงการวงเงินสูง  สำหรับลูกค้าเกรดดี" },
  { collateralType: "motorcycle", line: 23, id: "mc-transfer-book", expect: "สินเชื่อทะเบียนรถจักรยานยนต์ แบบโอนเล่ม" },
  { collateralType: "truck", line: 2, id: "truck-no-transfer", expect: "สินเชื่อทะเบียนรถบรรทุก เป้า D" },
  { collateralType: "truck", line: 3, id: "truck-target-e", expect: "สินเชื่อทะเบียนรถบรรทุก เป้า E" },
  { collateralType: "truck", line: 4, id: "truck-easy-approval", expect: "สินเชื่อทะเบียนรถบรรทุก เป้า E PAWNSHOP" },
  { collateralType: "truck", line: 34, id: "truck-high-limit", expect: "สินเชื่อทะเบียนรถบรรทุก เป้า D" },
  { collateralType: "truck", line: 46, id: "truck-transfer-book", expect: "สินเชื่อทะเบียนรถบรรทุก เป้า D - แบบโอนเล่ม" },
  { collateralType: "truck", line: 105, id: "truck-c2c", expect: "รถบรรทุกซื้อขาย R Dealer" },
  { collateralType: "land", line: 2, id: "land-pawn", expect: "สินเชื่อเพื่อคนมีที่ดิน (จำนำ)" },
  { collateralType: "land", line: 6, id: "land-mortgage", expect: "สินเชื่อเพื่อคนมีที่ดิน (จำนอง)" },
  { collateralType: "land", line: 7, id: "land-mortgage-high", expect: "สินเชื่อเพื่อคนมีที่ดิน (จำนอง)" },
];

// Gates with no CSV counterpart: Car Brand is "All" on nearly every row and
// Min Amount / Max %LTV would put every gate under ~10,000 baht, showing every
// card at all times. Hand-tuned so the catalog still narrows as the vehicle is
// filled in. Keyed by stable id.
const APPRAISAL_GATES = {
  "no-transfer-low-risk": { minAppraisalPrice: 200000, requiresTopTierBrand: true },
  "high-limit-normal-risk": { minAppraisalPrice: 300000, requiresTopTierBrand: true },
  "transfer-book": { minAppraisalPrice: 200000 },
  "mc-high-limit": { minAppraisalPrice: 60000, requiresTopTierBrand: true },
  "mc-dealer-used": { minAppraisalPrice: 40000, requiresTopTierBrand: true },
  "truck-no-transfer": { minAppraisalPrice: 800000, requiresTopTierBrand: true },
  "truck-high-limit": { minAppraisalPrice: 1000000, requiresTopTierBrand: true },
  "truck-c2c": { minAppraisalPrice: 200000 },
  "land-mortgage-high": { minAppraisalPrice: 210000 },
};

// Which card opens with an eNCB check instead of a straight เลือก. Required NCB is
// Yes on all but one row so it cannot drive this; these are the three the
// prototype already ships as outline. Everything else defaults to เลือก/filled.
const ENCB_FIRST_IDS = new Set(["no-transfer-low-risk", "mc-no-transfer", "truck-no-transfer"]);

/**
 * Keeps every Normalized row plus every pinned row, and asserts that each pinned
 * line still holds the product it was pinned against. `unseen` is shared across
 * files so a pin pointing past the end of its CSV is reported too.
 */
function selectRows(rows, pins, unseen) {
  return rows.filter((row) => {
    const key = `${row.collateralType}:${row.line}`;
    const pin = pins.get(key);

    if (pin) {
      const actual = row.csv["Product (ชื่อทางการ)"].trim();
      if (actual !== pin.expect) {
        throw new Error(
          `${row.file}:${row.line} is pinned to id ${JSON.stringify(pin.id)} but the row moved: expected ${JSON.stringify(pin.expect)}, found ${JSON.stringify(actual)}`,
        );
      }
      unseen.delete(key);
      return true;
    }

    return row.csv["Program status (Normalized / Test)"].trim().toLowerCase() === "normalized";
  });
}

// ---------------------------------------------------------------------------
// Tags
//
// The CSV Tag column is filled in on only 6 of 197 rows, so tags are derived.
// This is the table the hand-written catalog documented in a comment but applied
// inconsistently (13 rules disagreed with it); deriving it in code is what stops
// that from recurring. Two clauses are deliberately tightened -- see below.
// ---------------------------------------------------------------------------

/** Min Interest (Year) at or below this counts as cheap for the collateral type. */
const CHEAP_ANNUAL_RATE_CEILING = {
  car: 13,
  motorcycle: 13.44,
  truck: 15,
  land: 9,
};

/** Most severe first: cards stay readable, so only the top few tags survive. */
const TAG_PRIORITY = [
  "นอกอำนาจ",
  "ต้องมีผู้ค้ำ",
  "วงเงินสูง",
  "ดอกเบี้ยถูก",
  "ดอกเบี้ยคงที่",
  "รถมือสอง",
  "อนุมัติไว",
  "ไม่ต้องค้ำ",
  "รับทุกเกรด",
  "ใช้เอกสารรายได้",
  "ผ่อนนาน",
];

const MAX_TAGS = 4;

function deriveTags(rule, collateralType) {
  const tags = [];
  const add = (label, tone) => tags.push({ label, tone });

  const maxLtv = spanMax(rule.ltv);
  const minAnnual = spanMin(rule.annualReduction);
  const gradeIsRestrictedToA01A02 = /^A01(,| -) A02$/.test(rule.ncbGradeLabel);

  if (minAnnual != null && minAnnual <= CHEAP_ANNUAL_RATE_CEILING[collateralType]) {
    add("ดอกเบี้ยถูก", "green");
  }
  if (gradeIsRestrictedToA01A02 && rule.requiresIncomeDocument) {
    add("นอกอำนาจ", "red");
  }
  if (rule.requiresIncomeDocument) {
    add("ใช้เอกสารรายได้", "purple");
  }
  if (rule.ncbGradeLabel === ALL_NCB_GRADES_LABEL) {
    add("รับทุกเกรด", "purple");
  }
  // Tightened: the original "no income document and no guarantor" fires on most
  // rows in the file, which would tag nearly every card อนุมัติไว.
  if (rule.title.includes("อนุมัติง่าย") || rule.requiresNcb === false) {
    add("อนุมัติไว", "amber");
  }
  if (maxLtv != null && maxLtv <= 80) {
    add(`${maxLtv}% LTV`, "pink");
  }
  if (maxLtv != null && maxLtv >= 130) {
    add("วงเงินสูง", "amber");
  }
  if (rule.interestType === "flat") {
    add("ดอกเบี้ยคงที่", "pink");
  }
  // Scoped to land: it is the only collateral type where the CSV carries both a
  // guarantor-free and a guarantor-required variant, so "ไม่ต้องค้ำ" says something.
  if (collateralType === "land" && rule.requiresGuarantor === false) {
    add("ไม่ต้องค้ำ", "green");
  }
  if (rule.requiresGuarantor === true) {
    add("ต้องมีผู้ค้ำ", "red");
  }
  if (rule.maxTenor != null && rule.maxTenor >= 72) {
    add("ผ่อนนาน", "purple");
  }
  if (rule.programType === "dealer-used") {
    add("รถมือสอง", "amber");
  }

  const rank = (tag) => {
    const index = TAG_PRIORITY.indexOf(tag.label);
    // "<n>% LTV" carries a number, so it is matched by shape rather than literal.
    return index === -1 ? TAG_PRIORITY.indexOf("วงเงินสูง") + 0.5 : index;
  };

  return tags.sort((a, b) => rank(a) - rank(b)).slice(0, MAX_TAGS);
}

// ---------------------------------------------------------------------------
// Row -> rule
// ---------------------------------------------------------------------------

/**
 * Id for a row that has never shipped. Product names are Thai and several rows
 * share one (three programs are called "สินเชื่อทะเบียนรถบรรทุก เป้า D", differing
 * only in LTV and amount tier), so the id carries a short digest of the terms that
 * actually distinguish the row rather than a slug of its name. Derived from
 * content, not from row order, so re-exporting the CSV does not churn ids --
 * and selected_product_id keeps resolving. Shipped ids are pinned in STABLE_IDS.
 */
function contentId(rule) {
  const discriminator = [
    rule.title,
    rule.bookStatusLabel,
    rule.ncbGradeLabel,
    rule.customerType,
    JSON.stringify(rule.ltv),
    JSON.stringify(rule.monthlyRate),
    JSON.stringify(rule.annualReduction),
    rule.interestType,
    rule.minAmount,
    rule.maxAmount,
    rule.minTenor,
    rule.maxTenor,
  ].join("|");

  const digest = createHash("sha1").update(discriminator).digest("hex").slice(0, 8);
  return `${rule.category === "tlc" ? "tlc" : "tl"}-${rule.programType}-${digest}`;
}

function toRule(row, stableIds) {
  const { csv, collateralType, file, line } = row;

  const programType = readProgramType(row);
  const category = readCategory(row);
  const title = readText(csv["Product (ชื่อทางการ)"]) ?? "";
  if (title === "") throw new Error(`${file}:${line} missing product name`);

  const stableId = stableIds.get(`${collateralType}:${line}`);

  const rule = {
    // Filled in below: contentId needs the commercial terms to hash.
    id: stableId ?? "",
    title,
    csvSource: `${file.replace(/^List product program_140726|\.csv$/g, "")}:${line}`,
    category,
    programType,
    programStatus:
      csv["Program status (Normalized / Test)"].trim().toLowerCase() === "normalized"
        ? "normalized"
        : "test",

    ltv: readSpan(csv["Min %LTV"], csv["Max %LTV"]),
    monthlyRate: readSpan(csv["Min Interest (Month)"], csv["Max Interest (Month)"]),
    annualReduction: readSpan(csv["Min Interest (Year)"], csv["Max Interest (Year)"]),
    interestType: readInterestType(row),

    ncbGradeLabel: readNcbGradeLabel(csv["NCB Grade"]),
    bookStatusLabel: readBookStatus(row),

    vehicleOrLandType: readText(csv.Vehicle) ?? readText(csv["Land Type"]),
    titleDeedType: readText(csv["ประเภทเอกสารสิทธิ"]),
    allowedRegistration: readText(csv["Allowed รย."]),
    brands: readText(csv["Car Brand"]),
    assetAgeYears: readRange(csv["Min Asset Age (Year)"], csv["Max Asset Age (Year)"]),
    ownershipDays: readNumber(csv["Min Ownership Age (Day)"]),

    customerType: readText(csv["Customer Type"]),
    customerAgeYears: readRange(csv["Min Customer Age (Year)"], csv["Max Customer Age (Year)"]),
    nationality: readText(csv.Nationality)?.replace(/^THAI$/i, "Thai") ?? null,
    requiresGuarantor: readBoolean(csv["Required Guarantor"]),
    requiresIncomeDocument: readBoolean(csv["Required Income Document"]),
    requiresNcb: readBoolean(csv["Required NCB"]),

    minAmount: readNumber(csv["Min Amount"]),
    maxAmount: readNumber(csv["Max Amount"]),
    minTenor: readNumber(csv["Min Tenor"]),
    maxTenor: readNumber(csv["Max Tenor"]),

    remark: readText(csv.REMARK),
  };

  // A handful of CSV rows carry no commercial terms at all -- blank %LTV and blank
  // interest in both columns. There is no honest way to render a card for them
  // (no LTV means no approved amount, no rate means no interest label), so they
  // are reported and skipped. A pinned row must never fall in here.
  const missing = [
    rule.ltv == null && "%LTV",
    rule.monthlyRate == null && "Interest (Month)",
    rule.annualReduction == null && "Interest (Year)",
  ].filter(Boolean);

  if (missing.length > 0) {
    if (stableId) {
      throw new Error(`${file}:${line} is pinned to ${stableId} but has no ${missing.join(", ")}`);
    }
    return { skipped: { source: `${file}:${line}`, title, missing } };
  }

  rule.id = stableId ?? contentId(rule);
  rule.ncbGradeTone = readNcbGradeTone(rule.ncbGradeLabel);
  rule.tags = deriveTags(rule, collateralType);
  rule.primaryActionLabel = ENCB_FIRST_IDS.has(rule.id) ? "ตรวจ eNCB" : "เลือก";
  rule.primaryActionVariant = ENCB_FIRST_IDS.has(rule.id) ? "outline" : "filled";

  Object.assign(rule, APPRAISAL_GATES[rule.id] ?? {});

  return { rule };
}

/** Two rows describing the same program in every field we read collapse to one. */
function dedupe(rules) {
  const seen = new Map();
  for (const rule of rules) {
    // id and csvSource are what differ between twin rows, so they stay out of the key.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, csvSource, ...rest } = rule;
    const key = JSON.stringify(rest);
    if (!seen.has(key)) seen.set(key, rule);
  }
  return [...seen.values()];
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const KEY_ORDER = [
  "id",
  "title",
  "csvSource",
  "category",
  "programType",
  "programStatus",
  "tags",
  "ltv",
  "monthlyRate",
  "annualReduction",
  "interestType",
  "ncbGradeLabel",
  "ncbGradeTone",
  "bookStatusLabel",
  "primaryActionLabel",
  "primaryActionVariant",
  "vehicleOrLandType",
  "titleDeedType",
  "allowedRegistration",
  "brands",
  "assetAgeYears",
  "ownershipDays",
  "customerType",
  "customerAgeYears",
  "nationality",
  "requiresGuarantor",
  "requiresIncomeDocument",
  "requiresNcb",
  "minAmount",
  "maxAmount",
  "minTenor",
  "maxTenor",
  "remark",
  "minAppraisalPrice",
  "requiresTopTierBrand",
];

function literal(value, indent) {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${innerPad}${literal(item, indent + 1)}`);
    return `[\n${items.join(",\n")},\n${pad}]`;
  }

  const entries = Object.entries(value).filter(([, item]) => item !== undefined);
  if (entries.length === 0) return "{}";
  const inline = entries.every(([, item]) => item === null || typeof item !== "object");
  if (inline && entries.length <= 2) {
    return `{ ${entries.map(([key, item]) => `${key}: ${literal(item, indent)}`).join(", ")} }`;
  }
  const lines = entries.map(([key, item]) => `${innerPad}${key}: ${literal(item, indent + 1)},`);
  return `{\n${lines.join("\n")}\n${pad}}`;
}

function emitRule(rule) {
  const ordered = {};
  for (const key of KEY_ORDER) {
    if (rule[key] !== undefined) ordered[key] = rule[key];
  }
  const unknown = Object.keys(rule).filter((key) => !KEY_ORDER.includes(key));
  if (unknown.length > 0) throw new Error(`rule ${rule.id} has unemitted keys: ${unknown.join(", ")}`);
  return literal(ordered, 2);
}

const HEADER = `// GENERATED FILE -- DO NOT EDIT BY HAND.
//
// Source: csv/List product program_140726(Car|MC|Truck|Land).csv
// Regenerate: npm run generate:catalog
//
// Every field below is read straight from the CSV column of the same meaning:
//   ltv                  <- Min/Max %LTV
//   monthlyRate          <- Min/Max Interest (Month)
//   annualReduction      <- Min/Max Interest (Year)
//   interestType         <- Interest Type
//   ncbGradeLabel        <- NCB Grade
//   bookStatusLabel      <- Sub category ("... Loan" = keeps the book, "... HP" = transfers it)
//   category             <- Category (Term Loan / TLC, i.e. บัตรติดล้อ)
//   programType          <- Program Type
//   csvSource            <- which CSV row this rule came from, for tracing
//
// Three things have no CSV column and are set in scripts/generate-product-catalog.mjs:
// minAppraisalPrice / requiresTopTierBrand (hand-tuned display gates) and
// primaryActionLabel / primaryActionVariant (which card leads with an eNCB check).
// tags are derived from the CSV by deriveTags() in that script.
//
// Rows kept: every Program status = Normalized row, plus five TEST rows the
// prototype already ships. Row ids for those are pinned so a saved
// selected_product_id keeps resolving.

import type { ProductCatalogTag } from "@/types/product-catalog";
import type { CollateralType } from "@/types/ratebook";

/** A single value, or a low-high band rendered as "low - high". */
export type NumberOrRange = number | { min: number; max: number };

/** An open-ended CSV range: either end may be blank. */
export type OpenRange = { min: number | null; max: number | null };

/** Category in the CSV: TLC is the บัตรติดล้อ product line. */
export type ProgramCategory = "term-loan" | "tlc";

export type ProgramType =
  | "new"
  | "topup"
  | "refinance"
  | "dealer-new"
  | "dealer-used"
  | "c2c";

export type ProductRule = {
  id: string;
  title: string;
  csvSource: string;
  category: ProgramCategory;
  programType: ProgramType;
  programStatus: "normalized" | "test";
  tags: ProductCatalogTag[];
  /** Percent of the appraisal price; also what the approved amount is derived from. */
  ltv: NumberOrRange;
  /** Percent per month. */
  monthlyRate: NumberOrRange;
  /** ลดต้นลดดอก, percent per year. */
  annualReduction: NumberOrRange;
  /** Flat products are labelled ดอกเบี้ยคงที่, not ลดต้นลดดอก. */
  interestType: "effective" | "flat";
  ncbGradeLabel: string;
  ncbGradeTone: "blue" | "green";
  bookStatusLabel: string;
  primaryActionLabel: string;
  primaryActionVariant: "outline" | "filled";
  vehicleOrLandType: string | null;
  titleDeedType: string | null;
  allowedRegistration: string | null;
  brands: string | null;
  assetAgeYears: OpenRange | null;
  /** CSV "Min Ownership Age (Day)" -- days, not years. */
  ownershipDays: number | null;
  customerType: string | null;
  customerAgeYears: OpenRange | null;
  nationality: string | null;
  requiresGuarantor: boolean | null;
  requiresIncomeDocument: boolean | null;
  requiresNcb: boolean | null;
  minAmount: number | null;
  maxAmount: number | null;
  minTenor: number | null;
  maxTenor: number | null;
  remark: string | null;
  minAppraisalPrice?: number;
  requiresTopTierBrand?: boolean;
};
`;

function emit(rulesByCollateralType) {
  const blocks = Object.entries(rulesByCollateralType).map(([collateralType, rules]) => {
    const items = rules.map((rule) => `    ${emitRule(rule)},`).join("\n");
    return `  ${collateralType}: [\n${items}\n  ],`;
  });

  return `${HEADER}
export const productRulesByCollateralType: Record<CollateralType, ProductRule[]> = {
${blocks.join("\n")}
};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const pins = new Map(
    STABLE_IDS.map((entry) => [`${entry.collateralType}:${entry.line}`, entry]),
  );
  const stableIds = new Map([...pins].map(([key, entry]) => [key, entry.id]));
  const unseenPins = new Set(pins.keys());

  const rulesByCollateralType = {};
  const skipped = [];
  let selectedCount = 0;

  for (const source of SOURCES) {
    const selected = selectRows(readRows(source), pins, unseenPins);
    selectedCount += selected.length;

    const results = selected.map((row) => toRule(row, stableIds));
    skipped.push(...results.flatMap((result) => (result.skipped ? [result.skipped] : [])));
    const rules = dedupe(results.flatMap((result) => (result.rule ? [result.rule] : [])));

    const ids = new Set();
    for (const rule of rules) {
      if (ids.has(rule.id)) throw new Error(`duplicate rule id ${rule.id} (${rule.csvSource})`);
      ids.add(rule.id);
    }

    rulesByCollateralType[source.collateralType] = rules;
  }

  if (unseenPins.size > 0) {
    throw new Error(`pinned CSV rows not found: ${[...unseenPins].join(", ")}`);
  }

  const emitted = Object.values(rulesByCollateralType).flat();
  const emittedIds = new Set(emitted.map((rule) => rule.id));
  const missing = STABLE_IDS.filter((entry) => !emittedIds.has(entry.id));
  if (missing.length > 0) {
    throw new Error(`shipped rule ids dropped by dedupe: ${missing.map((entry) => entry.id).join(", ")}`);
  }

  writeFileSync(OUT_FILE, emit(rulesByCollateralType), "utf8");

  const counts = Object.entries(rulesByCollateralType)
    .map(([collateralType, rules]) => `${collateralType}=${rules.length}`)
    .join(" ");
  console.log(`selected ${selectedCount} CSV rows -> ${emitted.length} rules (${counts})`);
  for (const entry of skipped) {
    console.log(`  skipped ${entry.source} (no ${entry.missing.join(", ")}): ${entry.title}`);
  }
  console.log(`wrote ${OUT_FILE.replace(`${ROOT}/`, "")}`);
}

// Guarded so scripts/verify-product-catalog.mjs can reuse the readers above
// without regenerating the file.
if (import.meta.main) main();
