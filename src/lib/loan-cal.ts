export function calculateLtvPercent(amount: number, appraisalPrice: number): number {
  if (appraisalPrice <= 0) return 0;
  return Math.round((amount / appraisalPrice) * 100);
}

export function calculateAmountFromLtv(ltvPercent: number, appraisalPrice: number): number {
  return Math.round(appraisalPrice * (ltvPercent / 100));
}

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  if (months <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(payment);
}
