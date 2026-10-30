/** Formats grams of CO₂ in the largest unit that keeps the value readable (t, kg or g). */
export function formatCarbon(grams: number, locale: string): string {
  const value = Number.isFinite(grams) ? Math.max(0, grams) : 0
  const format = (amount: number): string =>
    Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount)
  if (value >= 1e6) return `${format(value / 1e6)} t`
  if (value >= 1e3) return `${format(value / 1e3)} kg`
  return `${format(value)} g`
}
