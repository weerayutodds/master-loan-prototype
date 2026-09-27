export function maskIdCardNumber(idCardNumber: string): string {
  const groups = idCardNumber.split("-");
  if (groups.length < 4) return idCardNumber;

  const lastIndex = groups.length - 1;
  return groups
    .map((group, index) =>
      index <= 1 || index === lastIndex ? group : "X".repeat(group.length),
    )
    .join("-");
}

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
    .filter(Boolean)
    .join("-");
}

export function formatThaiPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 9) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  return phone;
}
