// Checks src/lib/product-catalog-data.ts against the CSVs it was generated from.
//
// Run: npm run verify:catalog
//
// Three separate checks:
//   1. every emitted rule matches the raw strings on its own csvSource row
//   2. every Normalized CSV row is accounted for -- emitted, deduped, or skipped
//   3. the 20 rules the prototype shipped before the generator existed still carry
//      the exact values they had, so a saved selected_product_id resolves to the
//      same offer the customer saw
//
// Expectations are re-derived here from the raw CSV cell text rather than by
// calling the generator's readers, so a wrong derivation in the generator shows up
// as a mismatch instead of being reproduced on both sides. The CSV *parser* is
// shared -- this does not test the parser.

import { readRows, SOURCES } from "./generate-product-catalog.mjs";
import { productRulesByCollateralType } from "../src/lib/product-catalog-data.ts";

const failures = [];

function check(label, actual, expected) {
  const same = JSON.stringify(actual) === JSON.stringify(expected);
  if (!same) {
    failures.push(`${label}\n      expected ${JSON.stringify(expected)}\n      actual   ${JSON.stringify(actual)}`);
  }
}

// --- helpers that read the raw cell text independently of the generator --------

/** "92%" -> 92 · "2,000,000" -> 2000000 · "-" / "" / "No" -> null */
function num(raw) {
  const text = String(raw ?? "").trim();
  if (text === "" || text === "-" || text === "--" || /^no$/i.test(text)) return null;
  const value = Number(text.replace(/[,%\s]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function span(minRaw, maxRaw) {
  const min = num(minRaw);
  const max = num(maxRaw);
  if (min === null && max === null) return null;
  if (min === null) return max;
  if (max === null) return min;
  return min === max ? max : { min, max };
}

function yesNo(raw) {
  const text = String(raw ?? "").trim().toLowerCase();
  return text === "yes" ? true : text === "no" ? false : null;
}

// --- load every CSV row, keyed the way csvSource spells it --------------------

const rowsBySource = new Map();
const normalizedKeys = new Set();

for (const source of SOURCES) {
  for (const row of readRows(source)) {
    const shortFile = source.file.replace(/^List product program_140726|\.csv$/g, "");
    const key = `${shortFile}:${row.line}`;
    rowsBySource.set(key, row);
    if (row.csv["Program status (Normalized / Test)"].trim().toLowerCase() === "normalized") {
      normalizedKeys.add(key);
    }
  }
}

// --- check 1: every emitted rule matches its own CSV row ----------------------

const emitted = Object.entries(productRulesByCollateralType).flatMap(([collateralType, rules]) =>
  rules.map((rule) => ({ collateralType, rule })),
);

for (const { collateralType, rule } of emitted) {
  const row = rowsBySource.get(rule.csvSource);
  if (!row) {
    failures.push(`${rule.id}: csvSource ${rule.csvSource} does not exist`);
    continue;
  }

  const csv = row.csv;
  const at = (field) => `${rule.id} (${rule.csvSource}) ${field}`;

  check(at("collateralType"), collateralType, row.collateralType);
  check(at("title"), rule.title, csv["Product (ชื่อทางการ)"].trim().replace(/\s+/g, " "));
  check(at("ltv"), rule.ltv, span(csv["Min %LTV"], csv["Max %LTV"]));
  check(at("monthlyRate"), rule.monthlyRate, span(csv["Min Interest (Month)"], csv["Max Interest (Month)"]));
  check(at("annualReduction"), rule.annualReduction, span(csv["Min Interest (Year)"], csv["Max Interest (Year)"]));
  check(at("interestType"), rule.interestType, csv["Interest Type"].trim().toLowerCase());
  check(at("category"), rule.category, csv.Category.trim().toLowerCase() === "tlc" ? "tlc" : "term-loan");
  check(at("minAmount"), rule.minAmount, num(csv["Min Amount"]));
  check(at("maxAmount"), rule.maxAmount, num(csv["Max Amount"]));
  check(at("minTenor"), rule.minTenor, num(csv["Min Tenor"]));
  check(at("maxTenor"), rule.maxTenor, num(csv["Max Tenor"]));
  check(at("requiresGuarantor"), rule.requiresGuarantor, yesNo(csv["Required Guarantor"]));
  check(at("requiresIncomeDocument"), rule.requiresIncomeDocument, yesNo(csv["Required Income Document"]));
  check(at("requiresNcb"), rule.requiresNcb, yesNo(csv["Required NCB"]));
  check(at("ownershipDays"), rule.ownershipDays, num(csv["Min Ownership Age (Day)"]));
  check(at("customerAgeYears.min"), rule.customerAgeYears?.min ?? null, num(csv["Min Customer Age (Year)"]));
  check(at("customerAgeYears.max"), rule.customerAgeYears?.max ?? null, num(csv["Max Customer Age (Year)"]));
  check(at("assetAgeYears.min"), rule.assetAgeYears?.min ?? null, num(csv["Min Asset Age (Year)"]));
  check(at("assetAgeYears.max"), rule.assetAgeYears?.max ?? null, num(csv["Max Asset Age (Year)"]));

  // bookStatusLabel is Sub category re-expressed, so assert the mapping direction.
  const sub = csv["Sub category"].trim().toLowerCase();
  const expectedBookStatus = sub.endsWith(" hp")
    ? "โอนเล่ม"
    : sub === "land loan"
      ? "จำนำ"
      : sub === "land mortgage"
        ? "จำนอง"
        : "ไม่โอนเล่ม";
  check(at("bookStatusLabel"), rule.bookStatusLabel, expectedBookStatus);

  // A restricted grade list must never be presented as ทุกเกรด, and vice versa.
  const ncbIsAll = csv["NCB Grade"].trim().toLowerCase() === "all";
  check(at("ncbGradeLabel is ทุกเกรด"), rule.ncbGradeLabel === "ทุกเกรด", ncbIsAll);
}

// --- check 2: no Normalized row silently disappeared --------------------------

// Car:44 and Car:45 carry no %LTV and no interest in either column, so no card can
// be rendered for them. They are the only rows allowed to go missing.
const KNOWN_INCOMPLETE = new Set(["(Car):44", "(Car):45"]);

const emittedSources = new Set(emitted.map(({ rule }) => rule.csvSource));

for (const key of normalizedKeys) {
  if (emittedSources.has(key) || KNOWN_INCOMPLETE.has(key)) continue;

  // Otherwise it must have been folded into an identical rule by dedupe.
  const row = rowsBySource.get(key);
  const twin = emitted.find(
    ({ collateralType, rule }) =>
      collateralType === row.collateralType &&
      rule.title === row.csv["Product (ชื่อทางการ)"].trim().replace(/\s+/g, " ") &&
      JSON.stringify(rule.ltv) === JSON.stringify(span(row.csv["Min %LTV"], row.csv["Max %LTV"])) &&
      rule.minAmount === num(row.csv["Min Amount"]) &&
      rule.maxAmount === num(row.csv["Max Amount"]),
  );
  if (!twin) failures.push(`Normalized row ${key} is neither emitted nor deduped into an identical rule`);
}

// --- check 3: the rules that shipped before the generator are unchanged -------

// Transcribed from productRulesByCollateralType as it stood in src/lib/mock.ts
// before this generator replaced it. Verified row by row against the CSV first.
const SHIPPED = {
  "no-transfer-low-risk": { csvSource: "(Car):8", ltv: 92, monthlyRate: 0.6, annualReduction: 13, ncbGradeLabel: "A01, A02", ncbGradeTone: "blue", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "no-transfer-normal-risk": { csvSource: "(Car):9", ltv: 80, monthlyRate: { min: 0.94, max: 1.13 }, annualReduction: { min: 20, max: 24 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "high-limit-normal-risk": { csvSource: "(Car):11", ltv: { min: 80, max: 130 }, monthlyRate: { min: 0.94, max: 1.13 }, annualReduction: { min: 20, max: 24 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "easy-approval-low-ltv": { csvSource: "(Car):14", ltv: 70, monthlyRate: { min: 0.94, max: 1.13 }, annualReduction: { min: 20, max: 24 }, ncbGradeLabel: "A01 - A03", ncbGradeTone: "blue", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "easy-approval-non-a": { csvSource: "(Car):15", ltv: 60, monthlyRate: { min: 0.98, max: 1.13 }, annualReduction: { min: 21, max: 24 }, ncbGradeLabel: "Non A01-A03", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "transfer-book": { csvSource: "(Car):30", ltv: 130, monthlyRate: { min: 0.65, max: 2.05 }, annualReduction: { min: 7.8, max: 24.6 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "โอนเล่ม", interestType: "flat" },
  "mc-no-transfer": { csvSource: "(MC):10", ltv: 100, monthlyRate: 1.13, annualReduction: 24, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "mc-high-limit": { csvSource: "(MC):20", ltv: 130, monthlyRate: 1.13, annualReduction: 24, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "mc-easy-approval": { csvSource: "(MC):17", ltv: 60, monthlyRate: 1.13, annualReduction: 24, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "mc-transfer-book": { csvSource: "(MC):23", ltv: 100, monthlyRate: { min: 1.06, max: 1.12 }, annualReduction: { min: 12.72, max: 13.44 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "โอนเล่ม", interestType: "flat" },
  "mc-dealer-used": { csvSource: "(MC):4", ltv: 110, monthlyRate: { min: 1.06, max: 1.12 }, annualReduction: { min: 12.72, max: 13.44 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "โอนเล่ม", interestType: "flat" },
  "truck-no-transfer": { csvSource: "(Truck):2", ltv: 120, monthlyRate: 0.89, annualReduction: 18, ncbGradeLabel: "A01, A02", ncbGradeTone: "blue", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "truck-target-e": { csvSource: "(Truck):3", ltv: 100, monthlyRate: { min: 0.98, max: 1.03 }, annualReduction: { min: 21, max: 22 }, ncbGradeLabel: "Non A01-A02", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "truck-easy-approval": { csvSource: "(Truck):4", ltv: 80, monthlyRate: { min: 1.03, max: 1.13 }, annualReduction: { min: 22, max: 24 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "truck-high-limit": { csvSource: "(Truck):34", ltv: 150, monthlyRate: { min: 0.42, max: 0.7 }, annualReduction: { min: 9, max: 15 }, ncbGradeLabel: "A01, A02", ncbGradeTone: "blue", bookStatusLabel: "ไม่โอนเล่ม", interestType: "effective" },
  "truck-transfer-book": { csvSource: "(Truck):46", ltv: 120, monthlyRate: 0.8, annualReduction: 9.6, ncbGradeLabel: "A01, A02", ncbGradeTone: "blue", bookStatusLabel: "โอนเล่ม", interestType: "flat" },
  "truck-c2c": { csvSource: "(Truck):105", ltv: 100, monthlyRate: { min: 0.54, max: 1.04 }, annualReduction: { min: 6.48, max: 12.48 }, ncbGradeLabel: "ทุกเกรด", ncbGradeTone: "green", bookStatusLabel: "โอนเล่ม", interestType: "flat" },
  "land-pawn": { csvSource: "(Land):2", ltv: 70, monthlyRate: 0.7, annualReduction: 15, ncbGradeLabel: "ยกเว้น L05", ncbGradeTone: "green", bookStatusLabel: "จำนำ", interestType: "effective" },
  "land-mortgage": { csvSource: "(Land):6", ltv: 70, monthlyRate: 0.7, annualReduction: 15, ncbGradeLabel: "ยกเว้น L05", ncbGradeTone: "green", bookStatusLabel: "จำนอง", interestType: "effective" },
  "land-mortgage-high": { csvSource: "(Land):7", ltv: { min: 50, max: 95 }, monthlyRate: { min: 0.42, max: 0.7 }, annualReduction: { min: 9, max: 15 }, ncbGradeLabel: "ยกเว้น L05, U05", ncbGradeTone: "blue", bookStatusLabel: "จำนอง", interestType: "effective" },
};

const byId = new Map(emitted.map(({ rule }) => [rule.id, rule]));

for (const [id, expected] of Object.entries(SHIPPED)) {
  const rule = byId.get(id);
  if (!rule) {
    failures.push(`shipped rule ${id} is gone -- a saved selected_product_id would no longer resolve`);
    continue;
  }
  for (const [field, value] of Object.entries(expected)) {
    check(`shipped ${id}.${field}`, rule[field], value);
  }
}

// --- report ------------------------------------------------------------------

const counts = Object.entries(productRulesByCollateralType)
  .map(([collateralType, rules]) => `${collateralType}=${rules.length}`)
  .join(" ");

if (failures.length > 0) {
  console.error(`FAIL ${failures.length} mismatch(es):\n`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`OK ${emitted.length} rules (${counts})`);
console.log(`   ${normalizedKeys.size} Normalized CSV rows accounted for`);
console.log(`   ${Object.keys(SHIPPED).length} shipped rule ids intact`);
