import {
  ratebookBrandsByCollateralType,
  type RatebookBrand,
} from "@/lib/ratebook-index";
import type { CollateralType, LoanPurpose } from "@/types/ratebook";
import { isRatebookCarTypeCode, type RatebookCarTypeCode } from "@/lib/car-type";

export type RatebookCollateralType = keyof typeof ratebookBrandsByCollateralType;

// Mirrors the dictionaries and tuple layout written by
// scripts/generate-ratebook.mjs -- change both together.
// tuple[0] is the workbook's CARTYPE code, not a dictionary index.
const CONDITIONS = ["original", "gas", "modified"];
const TRANSMISSIONS = ["manual", "auto"];

/** One ratebook line: a vehicle at a price, for one LOANTYPE. */
export type RatebookRow = {
  /** Ratebook Code (มอเตอร์ไซค์: Model AFS). Unique within a brand, and the
   *  value the รุ่นย่อย dropdown is keyed on. */
  code: string;
  carType: RatebookCarTypeCode;
  model: string;
  /** ลักษณะแค็บ where the workbook has one, otherwise the base `Type`. */
  bodyType: string;
  condition: string;
  doors: string;
  year: string;
  transmission: string;
  subModel: string;
  /** `Model Description` -- the only column separating some otherwise identical
   *  rows (BENZ S280 2005: "(LWB)" 126,000 vs "(LWB,SPCV)" 139,000). */
  description: string;
  engineCc: string;
  loanTypeId: number;
  ratebookPrice: number;
  appraisalPrice: number;
};

type BrandFile = {
  m: string[];
  b: string[];
  s: string[];
  d: string[];
  k: string[];
  r: number[][];
};

export function isRatebookCollateralType(
  collateralType?: CollateralType | null,
): collateralType is RatebookCollateralType {
  return collateralType === "car" || collateralType === "motorcycle";
}

export function getRatebookBrands(
  collateralType: RatebookCollateralType,
): { value: string; label: string }[] {
  return ratebookBrandsByCollateralType[collateralType].map((brand) => ({
    value: brand.value,
    label: brand.value,
  }));
}

/** อยากได้เงิน = จำนำทะเบียน (1), อยากซื้อรถ = ดีลเลอร์ (2). */
export function resolveLoanTypeId(loanPurpose?: LoanPurpose | null): number {
  return loanPurpose === "buy-car" ? 2 : 1;
}

/**
 * Not every vehicle is sold under every LOANTYPE -- รถตู้ has no ดีลเลอร์ rows
 * at all -- so a brand with nothing for the asked-for loan type falls back to
 * จำนำทะเบียน rather than leaving the form with no รุ่น to pick.
 */
export function availableLoanTypeId(
  rows: RatebookRow[],
  preferred: number,
): number {
  if (rows.some((row) => row.loanTypeId === preferred)) return preferred;
  if (rows.some((row) => row.loanTypeId === 1)) return 1;
  return rows[0]?.loanTypeId ?? preferred;
}

function decodeBrandFile(file: BrandFile): RatebookRow[] {
  return file.r.map((tuple, index) => {
    const carType = String(tuple[0]);
    if (!isRatebookCarTypeCode(carType)) {
      throw new Error(`ratebook row ${index}: unsupported CARTYPE ${carType}`);
    }
    return {
      carType,
      model: file.m[tuple[1]] ?? "",
      bodyType: file.b[tuple[2]] ?? "",
      condition: tuple[3] < 0 ? "" : (CONDITIONS[tuple[3]] ?? ""),
      doors: tuple[4] > 0 ? String(tuple[4]) : "",
      year: String(tuple[5]),
      transmission: tuple[6] < 0 ? "" : (TRANSMISSIONS[tuple[6]] ?? ""),
      subModel: file.s[tuple[7]] ?? "",
      description: file.d[tuple[8]] ?? "",
      engineCc: tuple[9] > 0 ? String(tuple[9]) : "",
      loanTypeId: tuple[10],
      ratebookPrice: tuple[11],
      appraisalPrice: tuple[12],
      code: file.k[index] ?? "",
    };
  });
}

// One in-flight or settled request per brand file. Keyed by path, so switching
// back to a brand already looked at costs nothing.
const brandRequests = new Map<string, Promise<RatebookRow[]>>();

export function loadBrandRows(
  collateralType: RatebookCollateralType,
  brandValue?: string,
): Promise<RatebookRow[]> {
  const brand: RatebookBrand | undefined = ratebookBrandsByCollateralType[
    collateralType
  ].find((entry) => entry.value === brandValue);
  if (!brand) return Promise.resolve([]);

  const path = `${collateralType}/${brand.file}`;
  let request = brandRequests.get(path);
  if (!request) {
    request = fetch(`/ratebook/${path}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`ratebook ${path}: HTTP ${response.status}`);
        }
        return response.json() as Promise<BrandFile>;
      })
      .then(decodeBrandFile)
      .catch((error: unknown) => {
        // Let the next attempt retry instead of caching the failure.
        brandRequests.delete(path);
        throw error;
      });
    brandRequests.set(path, request);
  }
  return request;
}

// ---------------------------------------------------------------------------
// cascade
// ---------------------------------------------------------------------------

/** Row fields the user picks, in the order the form asks for them. */
export type RatebookField =
  | "model"
  | "year"
  | "condition"
  | "doors"
  | "transmission"
  | "bodyType"
  | "code";

const CAR_FIELDS: RatebookField[] = [
  "model",
  "year",
  "condition",
  "doors",
  "transmission",
  "bodyType",
  "code",
];

// มอเตอร์ไซค์ rows carry no สภาพรถ, ประตู, เกียร์ or ตัวถัง.
const MOTORCYCLE_FIELDS: RatebookField[] = ["model", "year", "code"];

export function ratebookFields(
  collateralType: RatebookCollateralType,
): RatebookField[] {
  return collateralType === "motorcycle" ? MOTORCYCLE_FIELDS : CAR_FIELDS;
}

export type RatebookSelection = Partial<Record<RatebookField, string>>;

/**
 * Rows still reachable once every field *before* `upTo` has been answered --
 * so each dropdown only offers values that exist, and the last one leaves
 * exactly one row. Omit `upTo` to apply the whole selection.
 */
export function filterRows(
  rows: RatebookRow[],
  collateralType: RatebookCollateralType,
  loanTypeId: number,
  selection: RatebookSelection,
  upTo?: RatebookField,
): RatebookRow[] {
  const fields = ratebookFields(collateralType);
  const limit = upTo === undefined ? fields.length : fields.indexOf(upTo);
  const applied = fields.slice(0, limit < 0 ? fields.length : limit);
  return rows.filter(
    (row) =>
      row.loanTypeId === loanTypeId &&
      applied.every((field) => {
        const chosen = selection[field];
        return !chosen || row[field] === chosen;
      }),
  );
}

export function resolveRow(
  rows: RatebookRow[],
  loanTypeId: number,
  code?: string,
): RatebookRow | undefined {
  if (!code) return undefined;
  return rows.find((row) => row.code === code && row.loanTypeId === loanTypeId);
}

// ---------------------------------------------------------------------------
// labels
// ---------------------------------------------------------------------------

// The workbook writes body styles in English; cab styles are already Thai and
// pass straight through.
const BODY_TYPE_LABELS: Record<string, string> = {
  SEDAN: "ซีดาน",
  WAGON: "สเตชันแวกอน",
  COUPE: "คูเป้",
  CONVERTIBLE: "เปิดประทุน",
  CABRIOLET: "คาบริโอเลต์",
  HATCHBACK: "แฮทช์แบ็ก",
  PICKUP: "กระบะ",
  VAN: "ตู้",
};

export function bodyTypeLabel(value: string): string {
  return BODY_TYPE_LABELS[value] ?? value;
}

function distinct(rows: RatebookRow[], field: RatebookField): string[] {
  return [...new Set(rows.map((row) => row[field]))].filter(
    (value) => value !== "",
  );
}

/**
 * Distinct values of a free-form field (รุ่น, ปี, ตัวถัง): newest year first,
 * otherwise alphabetical.
 */
export function toOptions(
  rows: RatebookRow[],
  field: RatebookField,
  label: (value: string) => string,
): { value: string; label: string }[] {
  const values = distinct(rows, field);
  values.sort((a, b) =>
    field === "year" ? Number(b) - Number(a) : a.localeCompare(b, "th"),
  );
  return values.map((value) => ({ value, label: label(value) }));
}

/**
 * Whichever of a known list the rows actually offer, keeping that list's order
 * and wording -- สภาพรถ reads เดิม → แก๊ส → แต่งซิ่ง, not alphabetically by slug.
 */
export function toKnownOptions(
  rows: RatebookRow[],
  field: RatebookField,
  known: { value: string; label: string }[],
): { value: string; label: string }[] {
  const available = new Set(distinct(rows, field));
  return known.filter((option) => available.has(option.value));
}

/**
 * รุ่นย่อย. Keyed on the ratebook Code because a Sub-Model can cover several
 * priced rows; those get their `Model Description` appended so the two are
 * telling apart on screen.
 */
export function toSubModelOptions(
  rows: RatebookRow[],
): { value: string; label: string }[] {
  const shared = new Map<string, number>();
  for (const row of rows) {
    shared.set(row.subModel, (shared.get(row.subModel) ?? 0) + 1);
  }
  return rows
    .map((row) => ({
      value: row.code,
      label:
        (shared.get(row.subModel) ?? 0) > 1 && row.description
          ? `${row.subModel} · ${row.description}`
          : row.subModel,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "th"));
}
