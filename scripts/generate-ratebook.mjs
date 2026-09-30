// Generates public/ratebook/**.json + src/lib/ratebook-index.ts from Ratebook/*.xlsx.
//
// Run: npm run generate:ratebook
//
// Why a generator and not a runtime read: the vehicle cascade is driven from
// CarInfoForm.tsx, a client component, so the rows have to reach the browser.
// The five workbooks hold 85,520 rows -- far too much to bundle the way
// src/lib/mock.ts bundled its 55 hand-written models -- so they are split into
// one JSON per brand and fetched when that brand is picked. Only the brand list
// (src/lib/ratebook-index.ts) is bundled, so the first dropdown needs no fetch.
//
// Why no xlsx dependency: an .xlsx is a zip of XML. Reading the central
// directory and inflating two entries is ~70 lines, and the repo already
// hand-rolls its CSV reader in generate-product-catalog.mjs.
//
// Scope: Cartype 1/2/8 -> collateralType "car", Cartype 3 -> "motorcycle".
// Cartype5 (รถบรรทุก) is not read: its columns describe a different form
// (ยี่ห้อ -> จำนวนล้อ -> รุ่นแชสซี -> Model Type -> ปี -> ลักษณะตัวถัง, no
// สภาพรถ/ประตู/เกียร์), so trucks stay on the mock catalog for now.

import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isRatebookCarTypeCode } from "../src/lib/car-type.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(ROOT, "Ratebook");
const OUT_DIR = join(ROOT, "public/ratebook");
const INDEX_FILE = join(ROOT, "src/lib/ratebook-index.ts");

/** Printed into the generated files so a stale build is obvious. */
export const PERIOD = "202601";

export const CAR_SOURCES = [
  { cartype: 1, file: `Cartype1(เก๋ง) ${PERIOD}.xlsx` },
  { cartype: 2, file: `Cartype2(กระบะ) ${PERIOD}.xlsx` },
  { cartype: 8, file: `Cartype8(รถตู้) ${PERIOD}.xlsx` },
];
export const MOTORCYCLE_SOURCE = {
  cartype: 3,
  file: `Cartype3(มอไซค์) ${PERIOD}.xlsx`,
};

// Tuple slots shared with src/lib/ratebook.ts -- keep both in step.
export const CONDITIONS = ["original", "gas", "modified"];
export const TRANSMISSIONS = ["manual", "auto"];

// ---------------------------------------------------------------------------
// zip + xlsx reading
// ---------------------------------------------------------------------------

const ZIP64_MARKER = 0xffffffff;

/** Inflates the named entries of a zip. Enough for xlsx: stored or deflated, no zip64. */
export function unzipEntries(filePath, wanted) {
  const buf = readFileSync(filePath);

  let eocd = -1;
  const floor = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= floor; i -= 1) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error(`${filePath}: no zip end-of-central-directory`);

  const entryCount = buf.readUInt16LE(eocd + 10);
  let offset = buf.readUInt32LE(eocd + 16);
  if (offset === ZIP64_MARKER) throw new Error(`${filePath}: zip64 is not supported`);

  const found = new Map();
  for (let i = 0; i < entryCount; i += 1) {
    if (buf.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`${filePath}: bad central-directory header at ${offset}`);
    }
    const method = buf.readUInt16LE(offset + 10);
    const compressedSize = buf.readUInt32LE(offset + 20);
    const nameLength = buf.readUInt16LE(offset + 28);
    const extraLength = buf.readUInt16LE(offset + 30);
    const commentLength = buf.readUInt16LE(offset + 32);
    const localOffset = buf.readUInt32LE(offset + 42);
    const name = buf.toString("utf8", offset + 46, offset + 46 + nameLength);
    offset += 46 + nameLength + extraLength + commentLength;

    if (!wanted.has(name)) continue;
    if (compressedSize === ZIP64_MARKER || localOffset === ZIP64_MARKER) {
      throw new Error(`${filePath}: ${name} needs zip64`);
    }
    if (buf.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`${filePath}: bad local header for ${name}`);
    }
    const start =
      localOffset + 30 + buf.readUInt16LE(localOffset + 26) + buf.readUInt16LE(localOffset + 28);
    const raw = buf.subarray(start, start + compressedSize);
    if (method !== 0 && method !== 8) {
      throw new Error(`${filePath}: ${name} uses compression method ${method}`);
    }
    found.set(name, method === 0 ? raw : inflateRawSync(raw));
  }

  for (const name of wanted) {
    if (!found.has(name)) throw new Error(`${filePath}: missing zip entry ${name}`);
  }
  return found;
}

function decodeXmlText(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&");
}

/**
 * Reads the workbook's only sheet as `{ header, rows }`, both keyed by column
 * letter. Cells are strings -- every column the app needs is either text or a
 * plain integer, so no number formatting is applied.
 */
export function readWorkbook(filePath) {
  const entries = unzipEntries(
    filePath,
    new Set(["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml"]),
  );

  const shared = [];
  const sharedXml = entries.get("xl/sharedStrings.xml").toString("utf8");
  const siPattern = /<si>([\s\S]*?)<\/si>/g;
  let si;
  while ((si = siPattern.exec(sharedXml))) {
    let text = "";
    const tPattern = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let t;
    while ((t = tPattern.exec(si[1]))) text += decodeXmlText(t[1]);
    shared.push(text);
  }

  const sheetXml = entries.get("xl/worksheets/sheet1.xml").toString("utf8");
  const parsed = [];
  const rowPattern = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let rowMatch;
  while ((rowMatch = rowPattern.exec(sheetXml))) {
    const cells = {};
    // `(?:\/>|>...<\/c>)` so self-closing (empty) cells do not swallow the next one.
    const cellPattern = /<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    let cellMatch;
    while ((cellMatch = cellPattern.exec(rowMatch[2]))) {
      const type = /t="([^"]+)"/.exec(cellMatch[2] ?? "")?.[1] ?? "n";
      const body = cellMatch[3] ?? "";
      let value;
      if (type === "inlineStr") {
        value = decodeXmlText(/<t[^>]*>([\s\S]*?)<\/t>/.exec(body)?.[1] ?? "");
      } else {
        value = decodeXmlText(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? "");
        if (type === "s") value = shared[Number(value)] ?? "";
      }
      cells[cellMatch[1]] = value.trim();
    }
    parsed.push({ excelRow: Number(rowMatch[1]), cells });
  }

  const header = parsed[0]?.cells ?? {};
  const rows = parsed
    .slice(1)
    .filter((row) => Object.values(row.cells).some((value) => value !== ""));
  return { header, rows };
}

function assertHeader(file, header, expected) {
  for (const [column, label] of Object.entries(expected)) {
    if (header[column] !== label) {
      throw new Error(
        `${file}: column ${column} should be "${label}" but is "${header[column] ?? ""}" -- ` +
          `the workbook layout changed, re-check the mapping in this script`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// normalising
// ---------------------------------------------------------------------------

/**
 * The parenthetical in `Type` is the only thing that separates สภาพรถ, and it
 * lines up 1:1 with LOANTYPE_ID: the three จำนำทะเบียน conditions never carry a
 * ดีลเลอร์ suffix and vice versa. Verified against all 62,056 car rows.
 */
export const CONDITION_BY_TYPE_SUFFIX = new Map([
  ["", { condition: "original", loanTypeId: 1 }],
  ["ติดตั้งแก๊ส/เคยติดตั้งแก๊ส", { condition: "gas", loanTypeId: 1 }],
  ["รถแต่งซิ่ง/รถติดเครื่องเสียงพิเศษ", { condition: "modified", loanTypeId: 1 }],
  ["ซื้อขายดีลเลอร์", { condition: "original", loanTypeId: 2 }],
  ["ซื้อขายดีลเลอร์รถแต่งซิ่ง/รถติดเครื่องเสียงพิเศษ", { condition: "modified", loanTypeId: 2 }],
]);

// Body styles remain separate from CARTYPE: a PICKUP can belong to 1 or 2.
const CAR_BODY_TYPES = new Set([
  "SEDAN", "WAGON", "COUPE", "CONVERTIBLE", "CABRIOLET", "HATCHBACK", "PICKUP", "VAN",
]);

function readCarType(value, expected, where) {
  if (!isRatebookCarTypeCode(value) || Number(value) !== expected) {
    throw new Error(`${where}: CARTYPE is ${value}, expected ${expected}`);
  }
  return Number(value);
}

export function splitCarType(value) {
  const match = /^([^(]*)(?:\((.*)\))?$/.exec(value);
  return { base: (match?.[1] ?? value).trim(), suffix: (match?.[2] ?? "").trim() };
}

export function brandSlug(brand) {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

// ---------------------------------------------------------------------------
// reading each collateral type
// ---------------------------------------------------------------------------

function readCarRows(report) {
  const out = [];
  for (const source of CAR_SOURCES) {
    const path = join(SRC_DIR, source.file);
    const { header, rows } = readWorkbook(path);
    assertHeader(source.file, header, {
      B: "Code",
      C: "Brand",
      D: "Model",
      E: "Type",
      F: "Door",
      G: "Year",
      I: "Gear",
      J: "Sub-Model",
      K: "Model Description",
      M: "แรงม้า", // mislabelled in the source: it holds engine cc
      O: "Rate Book",
      R: "ราคาประเมิน",
      W: "CARTYPE",
      X: "LOANTYPE_ID",
    });

    let dropped = 0;
    for (const { excelRow, cells } of rows) {
      const where = `${source.file} row ${excelRow}`;

      const carType = readCarType(cells.W, source.cartype, where);
      const { base, suffix } = splitCarType(cells.E);
      const mapped = CONDITION_BY_TYPE_SUFFIX.get(suffix);
      if (!mapped) throw new Error(`${where}: unknown Type suffix "${suffix}" in "${cells.E}"`);
      if (mapped.loanTypeId !== Number(cells.X)) {
        throw new Error(
          `${where}: Type "${cells.E}" implies LOANTYPE ${mapped.loanTypeId} but the row says ${cells.X}`,
        );
      }

      const appraisalPrice = toInteger(cells.R);
      const ratebookPrice = toInteger(cells.O);
      if (appraisalPrice <= 0) {
        dropped += 1;
        continue;
      }

      const doors = Number(/^(\d+)/.exec(cells.F)?.[1] ?? 0);
      const gear = cells.I === "Auto" ? "auto" : cells.I === "Manual" ? "manual" : "";
      if (!gear) throw new Error(`${where}: unknown Gear "${cells.I}"`);

      if (!CAR_BODY_TYPES.has(base)) throw new Error(`${where}: unknown Type "${base}" in "${cells.E}"`);

      out.push({
        collateralType: "car",
        carType,
        code: cells.B,
        brand: cells.C,
        model: cells.D,
        // Display the workbook's Type verbatim after removing its condition suffix.
        bodyType: base,
        condition: mapped.condition,
        doors,
        year: Number(cells.G),
        transmission: gear,
        subModel: cells.J,
        // The only column that separates some otherwise identical rows: BENZ S280
        // 2005 has "(LWB) 05AIMR" at 126,000 and "(LWB,SPCV) 05CCMR" at 139,000
        // under the same Sub-Model. Used to disambiguate รุ่นย่อย labels.
        description: cells.K,
        engineCc: toInteger(cells.M),
        loanTypeId: mapped.loanTypeId,
        ratebookPrice,
        appraisalPrice,
      });
    }
    report.push({ file: source.file, read: rows.length, dropped, kept: rows.length - dropped });
  }
  return out;
}

function readMotorcycleRows(report) {
  const source = MOTORCYCLE_SOURCE;
  const path = join(SRC_DIR, source.file);
  const { header, rows } = readWorkbook(path);
  // Cartype3 orders its columns differently from the car workbooks.
  assertHeader(source.file, header, {
    D: "Model AFS",
    C: "Brand",
    E: "Model",
    F: "Rate Book",
    G: "Year",
    H: "Type",
    R: "ราคาประเมิน",
    W: "CARTYPE",
    X: "LOANTYPE_ID",
  });

  const out = [];
  let dropped = 0;
  for (const { excelRow, cells } of rows) {
    const where = `${source.file} row ${excelRow}`;
    const carType = readCarType(cells.W, source.cartype, where);

    const appraisalPrice = toInteger(cells.R);
    // LOANTYPE 5 (ดีลเลอร์ป้ายแดง) ships 352 rows with no Model, Type or price.
    if (!cells.E || !cells.H || appraisalPrice <= 0) {
      dropped += 1;
      continue;
    }

    out.push({
      collateralType: "motorcycle",
      carType,
      code: cells.D,
      brand: cells.C,
      model: cells.E,
      bodyType: "",
      condition: "",
      doors: 0,
      year: Number(cells.G),
      transmission: "",
      subModel: cells.H,
      description: "",
      engineCc: 0,
      loanTypeId: Number(cells.X),
      ratebookPrice: toInteger(cells.F),
      appraisalPrice,
    });
  }
  report.push({ file: source.file, read: rows.length, dropped, kept: rows.length - dropped });
  return out;
}

// ---------------------------------------------------------------------------
// encoding
// ---------------------------------------------------------------------------

function indexInto(list, lookup, value) {
  if (value === "") return -1;
  let index = lookup.get(value);
  if (index === undefined) {
    index = list.length;
    list.push(value);
    lookup.set(value, index);
  }
  return index;
}

function encodeBrand(rows) {
  const models = [];
  const bodyTypes = [];
  const subModels = [];
  const descriptions = [];
  const modelIndex = new Map();
  const bodyIndex = new Map();
  const subIndex = new Map();
  const descriptionIndex = new Map();

  const sorted = [...rows].sort(
    (a, b) =>
      a.model.localeCompare(b.model) ||
      a.year - b.year ||
      a.loanTypeId - b.loanTypeId ||
      a.condition.localeCompare(b.condition) ||
      a.doors - b.doors ||
      a.bodyType.localeCompare(b.bodyType) ||
      a.transmission.localeCompare(b.transmission) ||
      a.subModel.localeCompare(b.subModel) ||
      a.description.localeCompare(b.description) ||
      a.code.localeCompare(b.code),
  );

  const tuples = sorted.map((row) => [
    row.carType,
    indexInto(models, modelIndex, row.model),
    indexInto(bodyTypes, bodyIndex, row.bodyType),
    row.condition === "" ? -1 : CONDITIONS.indexOf(row.condition),
    row.doors,
    row.year,
    row.transmission === "" ? -1 : TRANSMISSIONS.indexOf(row.transmission),
    indexInto(subModels, subIndex, row.subModel),
    indexInto(descriptions, descriptionIndex, row.description),
    row.engineCc,
    row.loanTypeId,
    row.ratebookPrice,
    row.appraisalPrice,
  ]);

  return {
    m: models,
    b: bodyTypes,
    s: subModels,
    d: descriptions,
    k: sorted.map((row) => row.code),
    r: tuples,
  };
}

/** One row per line keeps the diff readable without paying for pretty-printing. */
function stringifyBrandFile(payload) {
  const parts = [
    `"m":${JSON.stringify(payload.m)}`,
    `"b":${JSON.stringify(payload.b)}`,
    `"s":${JSON.stringify(payload.s)}`,
    `"d":${JSON.stringify(payload.d)}`,
    `"k":${JSON.stringify(payload.k)}`,
    `"r":[\n${payload.r.map((tuple) => JSON.stringify(tuple)).join(",\n")}\n]`,
  ];
  return `{\n${parts.join(",\n")}\n}\n`;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function groupByBrand(rows) {
  const byBrand = new Map();
  for (const row of rows) {
    if (!byBrand.has(row.brand)) byBrand.set(row.brand, []);
    byBrand.get(row.brand).push(row);
  }
  return [...byBrand].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * The รุ่นย่อย dropdown is keyed on the ratebook Code and labelled with
 * Sub-Model, falling back to "Sub-Model · Model Description" when one
 * Sub-Model covers several rows. Both of those have to stay unambiguous.
 */
function assertResolvable(collateralType, rows) {
  const codes = new Map();
  for (const row of rows) {
    const key = `${row.brand}|${row.code}`;
    if (codes.has(key)) {
      throw new Error(
        `${collateralType}: ${row.brand} reuses Code "${row.code}" ` +
          `(${codes.get(key).model} ${codes.get(key).year} vs ${row.model} ${row.year})`,
      );
    }
    codes.set(key, row);
  }

  const labels = new Map();
  for (const row of rows) {
    const key = [
      row.loanTypeId,
      row.brand,
      row.model,
      row.year,
      row.condition,
      row.doors,
      row.bodyType,
      row.transmission,
      row.subModel,
      row.description,
    ].join("|");
    if (labels.has(key)) {
      throw new Error(
        `${collateralType}: ${row.brand} ${row.model} ${row.year} offers two รุ่นย่อย ` +
          `that would read identically ("${row.subModel}" / "${row.description}"): ` +
          `${labels.get(key).code} and ${row.code}`,
      );
    }
    labels.set(key, row);
  }
}

function main() {
  const report = [];
  const carRows = readCarRows(report);
  const motorcycleRows = readMotorcycleRows(report);

  console.log("Ratebook sources:");
  for (const line of report) {
    console.log(
      `  ${line.file.padEnd(34)} read=${String(line.read).padStart(6)} ` +
        `kept=${String(line.kept).padStart(6)} dropped=${String(line.dropped).padStart(4)}`,
    );
  }

  const index = {};
  const outputFiles = [];
  for (const [collateralType, rows] of [
    ["car", carRows],
    ["motorcycle", motorcycleRows],
  ]) {
    assertResolvable(collateralType, rows);
    const brands = [];
    let bytes = 0;
    for (const [brand, brandRows] of groupByBrand(rows)) {
      const slug = brandSlug(brand);
      if (brands.some((entry) => entry.file === slug)) {
        throw new Error(`${collateralType}: two brands share the slug "${slug}"`);
      }
      const text = stringifyBrandFile(encodeBrand(brandRows));
      outputFiles.push({ path: join(OUT_DIR, collateralType, `${slug}.json`), text });
      bytes += text.length;
      brands.push({ value: brand, file: slug, rows: brandRows.length });
    }
    index[collateralType] = brands;
    console.log(
      `  -> public/ratebook/${collateralType}/: ${brands.length} brands, ` +
        `${rows.length} rows, ${(bytes / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  const indexText = renderIndex(index);
  // Validate and encode every source before replacing the current dataset.
  rmSync(OUT_DIR, { recursive: true, force: true });
  for (const { path, text } of outputFiles) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  writeFileSync(INDEX_FILE, indexText);
  console.log(`  -> src/lib/ratebook-index.ts`);
}

function renderIndex(index) {
  const entries = Object.entries(index)
    .map(([collateralType, brands]) => {
      const lines = brands
        .map((brand) => `    { value: ${JSON.stringify(brand.value)}, file: ${JSON.stringify(brand.file)} },`)
        .join("\n");
      return `  ${collateralType}: [\n${lines}\n  ],`;
    })
    .join("\n");

  return `// GENERATED FILE -- DO NOT EDIT BY HAND.
//
// Source: Ratebook/Cartype{1,2,3,8}(*) ${PERIOD}.xlsx
// Regenerate: npm run generate:ratebook
//
// Only the brand list is bundled. The rows for a brand live in
// public/ratebook/<collateralType>/<file>.json and are fetched by
// loadBrandRows() in src/lib/ratebook.ts when that brand is picked.

export type RatebookBrand = {
  /** Stored verbatim in customer_lead_opportunity.car_brand and shown as-is. */
  value: string;
  /** Basename under public/ratebook/<collateralType>/. */
  file: string;
};

export const RATEBOOK_PERIOD = ${JSON.stringify(PERIOD)};

export const ratebookBrandsByCollateralType: Record<
  "car" | "motorcycle",
  RatebookBrand[]
> = {
${entries}
};
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
