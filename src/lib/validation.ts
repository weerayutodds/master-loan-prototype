export function isValidThaiPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^0\d{8,9}$/.test(digits);
}
