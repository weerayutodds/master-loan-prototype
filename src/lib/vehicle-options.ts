"use client";

import { useEffect, useState } from "react";

import {
  carBodyTypeOptionsByCollateralType,
  carConditionOptions,
  carDoorsOptions,
  carEngineCcOptionsByCollateralType,
  carTransmissionOptions,
  carYearOptions,
  getVehicleBrands,
  getVehicleCarType,
  getVehicleDoorsOptions,
  getVehicleModelBasePrice,
  getVehicleModels,
  getVehicleModelSpec,
  getVehicleSubModels,
  toVehicleCollateralType,
} from "@/lib/mock";
import {
  availableLoanTypeId,
  bodyTypeLabel,
  filterRows,
  getRatebookBrands,
  isRatebookCollateralType,
  loadBrandRows,
  ratebookFields,
  resolveLoanTypeId,
  toKnownOptions,
  toOptions,
  toSubModelOptions,
  type RatebookRow,
  type RatebookSelection,
} from "@/lib/ratebook";
import type { CarInfo, CollateralType, LoanPurpose } from "@/types/ratebook";

type Option = { value: string; label: string };

export type VehicleFieldKey =
  | "brand"
  | "model"
  | "year"
  | "condition"
  | "doors"
  | "engineCc"
  | "transmission"
  | "bodyType"
  | "ratebookCode";

export type VehicleOptions = {
  /** Answers needed before ดูราคาประเมิน enables, in order. */
  sequence: VehicleFieldKey[];
  /** Every editable field in cascade order -- changing one clears those after it. */
  resetOrder: VehicleFieldKey[];
  options: Record<VehicleFieldKey, Option[]>;
  /** Only one value is possible, so the form fills it in and shows it read-only. */
  locked: Partial<Record<VehicleFieldKey, string>>;
  /** Fills in locked fields and everything the vehicle decides for itself. */
  resolve: (carInfo: CarInfo) => CarInfo;
  /** The brand's rows are still downloading. */
  isLoading: boolean;
};

const CAR_SEQUENCE: VehicleFieldKey[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
  "transmission",
  "bodyType",
  "ratebookCode",
];

const MOTORCYCLE_SEQUENCE: VehicleFieldKey[] = [
  "brand",
  "model",
  "year",
  "ratebookCode",
];

// รถบรรทุก still runs on the mock catalog: ขนาดเครื่องยนต์ is a question there
// and the three optional fields open as a group once the chain above them is done.
const TRUCK_SEQUENCE: VehicleFieldKey[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
  "ratebookCode",
];
const TRUCK_RESET_ORDER: VehicleFieldKey[] = [
  "brand",
  "model",
  "year",
  "condition",
  "doors",
  "engineCc",
  "transmission",
  "bodyType",
  "ratebookCode",
];

const NO_OPTIONS: Record<VehicleFieldKey, Option[]> = {
  brand: [],
  model: [],
  year: [],
  condition: [],
  doors: [],
  engineCc: [],
  transmission: [],
  bodyType: [],
  ratebookCode: [],
};

function optionLabel(options: Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

/** Clears every answer that came after `field`, since they were narrowed by it. */
export function clearAfter(
  resetOrder: VehicleFieldKey[],
  carInfo: CarInfo,
  field: VehicleFieldKey,
): CarInfo {
  const next: CarInfo = { ...carInfo };
  for (const later of resetOrder.slice(resetOrder.indexOf(field) + 1)) {
    delete next[later];
  }
  // Everything below is read off the chosen row, so it goes stale too.
  delete next.carType;
  delete next.subModel;
  delete next.appraisalPrice;
  delete next.ratebookPrice;
  if (resetOrder.indexOf(field) < resetOrder.indexOf("engineCc")) {
    delete next.engineCc;
  }
  return next;
}

// ---------------------------------------------------------------------------
// ratebook-backed (รถยนต์ / มอเตอร์ไซค์)
// ---------------------------------------------------------------------------

function toSelection(carInfo: CarInfo): RatebookSelection {
  return {
    model: carInfo.model,
    year: carInfo.year,
    condition: carInfo.condition,
    doors: carInfo.doors,
    transmission: carInfo.transmission,
    bodyType: carInfo.bodyType,
    code: carInfo.ratebookCode,
  };
}

function buildRatebookOptions(
  collateralType: "car" | "motorcycle",
  rows: RatebookRow[],
  carInfo: CarInfo,
  loanPurpose: LoanPurpose | null | undefined,
  isLoading: boolean,
): VehicleOptions {
  const sequence =
    collateralType === "motorcycle" ? MOTORCYCLE_SEQUENCE : CAR_SEQUENCE;
  const loanTypeId = availableLoanTypeId(rows, resolveLoanTypeId(loanPurpose));
  const fields = ratebookFields(collateralType);

  /**
   * Walks the cascade once, taking each field's answer -- or the only value on
   * offer -- so later dropdowns are narrowed by locked fields too.
   */
  function walk(source: CarInfo) {
    const selection = toSelection(source);
      const options = { ...NO_OPTIONS, brand: getRatebookBrands(collateralType) };
    const locked: Partial<Record<VehicleFieldKey, string>> = {};

    for (const field of fields) {
      const reachable = filterRows(rows, collateralType, loanTypeId, selection, field);
      const list =
        field === "code"
          ? toSubModelOptions(reachable)
          : field === "condition"
            ? toKnownOptions(reachable, field, carConditionOptions)
            : field === "doors"
              ? toKnownOptions(reachable, field, carDoorsOptions)
              : field === "transmission"
                ? toKnownOptions(reachable, field, carTransmissionOptions)
                : toOptions(reachable, field, (value) =>
                    field === "bodyType"
                      ? bodyTypeLabel(value)
                      : field === "year"
                        ? `${value} (${Number(value) + 543})`
                        : value,
                  );

      const key: VehicleFieldKey = field === "code" ? "ratebookCode" : field;
      options[key] = list;

      // A field with one answer is not a question -- fill it in and keep going.
      if (!selection[field] && list.length === 1 && (field === "transmission" || field === "bodyType")) {
        selection[field] = list[0].value;
        locked[key] = list[0].value;
      }
    }

    const matched = filterRows(rows, collateralType, loanTypeId, selection);
    return { options, locked, selection, row: matched.length === 1 ? matched[0] : undefined };
  }

  const current = walk(carInfo);

  return {
    sequence,
    resetOrder: sequence,
    options: current.options,
    locked: current.locked,
    isLoading,
    resolve(source) {
      const { locked, row } = walk(source);
      return {
        ...source,
        ...locked,
        carType: row?.carType,
        engineCc: row?.engineCc,
        subModel: row?.subModel,
        appraisalPrice: row?.appraisalPrice,
        ratebookPrice: row?.ratebookPrice,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// mock-backed (รถบรรทุก)
// ---------------------------------------------------------------------------

const DEPRECIATION_RATE_PER_YEAR = 0.1;
const MIN_DEPRECIATION_FACTOR = 0.2;

/** รถบรรทุก has no ratebook yet, so its price is still the old estimate. */
function mockAppraisalPrice(
  collateralType: CollateralType | null | undefined,
  carInfo: CarInfo,
): number | undefined {
  if (!carInfo.brand || !carInfo.model || !carInfo.year) return undefined;
  const basePrice = getVehicleModelBasePrice(
    collateralType,
    carInfo.brand,
    carInfo.model,
  );
  const latestYear = Math.max(
    ...carYearOptions.map((option) => Number(option.value)),
  );
  const age = Math.max(latestYear - Number(carInfo.year), 0);
  const factor = Math.max(
    (1 - DEPRECIATION_RATE_PER_YEAR) ** age,
    MIN_DEPRECIATION_FACTOR,
  );
  return Math.round((basePrice * factor) / 1000) * 1000;
}

function buildMockOptions(
  collateralType: CollateralType | null | undefined,
  carInfo: CarInfo,
): VehicleOptions {
  const vehicleCollateralType = toVehicleCollateralType(collateralType);
  const spec = getVehicleModelSpec(collateralType, carInfo.brand, carInfo.model);
  const bodyTypeOptions = carBodyTypeOptionsByCollateralType[vehicleCollateralType];
  const subModelOptions = getVehicleSubModels(
    collateralType,
    carInfo.brand,
    carInfo.model,
  );

  const locked: Partial<Record<VehicleFieldKey, string>> = {};
  if (spec?.transmissions.length === 1) locked.transmission = spec.transmissions[0];
  if (spec?.bodyTypes.length === 1) locked.bodyType = spec.bodyTypes[0];

  return {
    sequence: TRUCK_SEQUENCE,
    resetOrder: TRUCK_RESET_ORDER,
    options: {
      brand: getVehicleBrands(collateralType),
      model: getVehicleModels(collateralType, carInfo.brand),
      year: carYearOptions,
      condition: carConditionOptions,
      doors: getVehicleDoorsOptions(collateralType, carInfo.brand, carInfo.model),
      engineCc: carEngineCcOptionsByCollateralType[vehicleCollateralType],
      transmission: spec ? spec.transmissions.map((value) => ({
        value,
        label: optionLabel(carTransmissionOptions, value),
      })) : [],
      bodyType: spec ? spec.bodyTypes.map((value) => ({
        value,
        label: optionLabel(bodyTypeOptions, value),
      })) : [],
      ratebookCode: subModelOptions,
    },
    locked,
    isLoading: false,
    resolve(source) {
      const sourceSpec = getVehicleModelSpec(
        collateralType,
        source.brand,
        source.model,
      );
      return {
        ...source,
        transmission:
          sourceSpec?.transmissions.length === 1
            ? sourceSpec.transmissions[0]
            : source.transmission,
        bodyType:
          sourceSpec?.bodyTypes.length === 1
            ? sourceSpec.bodyTypes[0]
            : source.bodyType,
        carType: getVehicleCarType(
          collateralType,
          source.brand,
          source.model,
          source.doors,
        ),
        subModel: getVehicleSubModels(
          collateralType,
          source.brand,
          source.model,
        ).find((option) => option.value === source.ratebookCode)?.label,
        appraisalPrice: mockAppraisalPrice(collateralType, source),
        ratebookPrice: undefined,
      };
    },
  };
}

// ---------------------------------------------------------------------------

export function useVehicleOptions(
  collateralType: CollateralType | null | undefined,
  carInfo: CarInfo,
  loanPurpose: LoanPurpose | null | undefined,
): VehicleOptions {
  const ratebookBacked = isRatebookCollateralType(collateralType);
  const brand = carInfo.brand;
  // Which brand file the form currently needs; "" when nothing is fetched.
  const wanted = ratebookBacked && brand ? `${collateralType}/${brand}` : "";
  const [loaded, setLoaded] = useState<{
    key: string;
    rows: RatebookRow[];
  } | null>(null);

  useEffect(() => {
    if (!wanted || !isRatebookCollateralType(collateralType) || !brand) return;
    let cancelled = false;
    loadBrandRows(collateralType, brand)
      .then((rows) => {
        if (!cancelled) setLoaded({ key: wanted, rows });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("[ratebook] could not load brand rows", error);
        setLoaded({ key: wanted, rows: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [wanted, collateralType, brand]);

  // Derived rather than cleared in the effect, so a brand change shows an empty
  // cascade on the very first render instead of the previous brand's rows.
  const ready = loaded !== null && loaded.key === wanted;

  if (ratebookBacked) {
    return buildRatebookOptions(
      collateralType,
      ready ? loaded.rows : [],
      carInfo,
      loanPurpose,
      Boolean(wanted) && !ready,
    );
  }
  return buildMockOptions(collateralType, carInfo);
}
