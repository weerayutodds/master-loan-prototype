export function isValidThaiPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^0[689]\d{8}$/.test(digits);
}
