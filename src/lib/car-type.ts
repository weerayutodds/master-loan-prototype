/** Business CARTYPE codes from the ratebook, distinct from body styles. */
export const CAR_TYPE_LABELS = {
  "1": "เก๋ง, กระบะ 4 ประตู",
  "2": "กระบะ",
  "3": "มอเตอร์ไซด์",
  "5": "รถบรรทุก",
  "8": "รถตู้",
} as const;

export type CarTypeCode = keyof typeof CAR_TYPE_LABELS;
export type RatebookCarTypeCode = Exclude<CarTypeCode, "5">;

export function isCarTypeCode(value: string): value is CarTypeCode {
  return Object.hasOwn(CAR_TYPE_LABELS, value);
}

export function isRatebookCarTypeCode(value: string): value is RatebookCarTypeCode {
  return isCarTypeCode(value) && value !== "5";
}

export function getCarTypeLabel(value?: string): string | undefined {
  return value && isCarTypeCode(value) ? CAR_TYPE_LABELS[value] : undefined;
}
