const TOKEN_DECIMALS = 18
const AMOUNT_PATTERN = /^\d+(\.\d+)?$/

/** Decimal separator people type in each app language: pt and es write 10.000,5; en writes 10,000.5. */
export function decimalSeparator(language: string): ',' | '.' {
  return language.toLowerCase().startsWith('en') ? '.' : ','
}

/**
 * Normalizes a typed amount to a plain dot-decimal string, reading thousands and decimal
 * separators the way the app language writes them ("10.000" in pt is ten thousand).
 * Returns null when the input is not a non-negative number.
 */
export function normalizeAmountInput(input: string, language: string): string | null {
  const decimal = decimalSeparator(language)
  const thousands = decimal === ',' ? '.' : ','
  const text = input.trim().replace(/\s/g, '')
  if (!text) return null
  const [whole, ...rest] = text.split(decimal)
  if (rest.length > 1) return null
  if (whole.includes(thousands) && !new RegExp(`^\\d{1,3}(\\${thousands}\\d{3})+$`).test(whole)) {
    return null
  }
  const normalized = whole.split(thousands).join('') + (rest.length ? `.${rest[0]}` : '')
  return AMOUNT_PATTERN.test(normalized) ? normalized : null
}

/** Numeric value of a typed amount, for display and balance comparisons only. */
export function parseAmountInput(input: string, language: string): number {
  const normalized = normalizeAmountInput(input, language)
  return normalized === null ? NaN : Number(normalized)
}

/**
 * Converts a typed token amount to wei without going through floating point.
 * Returns null for invalid input or more than 18 decimal places.
 */
export function amountToWei(input: string, language: string): bigint | null {
  const normalized = normalizeAmountInput(input, language)
  if (normalized === null) return null
  const [whole, fraction = ''] = normalized.split('.')
  if (fraction.length > TOKEN_DECIMALS) return null
  return BigInt(whole + fraction.padEnd(TOKEN_DECIMALS, '0'))
}

/**
 * Writes a wei amount as the user would type it in the app language, exactly, without
 * thousands separators, so it reads back through amountToWei to the same value.
 */
export function weiToInput(wei: bigint, language: string): string {
  if (wei <= 0n) return ''
  const digits = wei.toString().padStart(TOKEN_DECIMALS + 1, '0')
  const whole = digits.slice(0, -TOKEN_DECIMALS)
  const fraction = digits.slice(-TOKEN_DECIMALS).replace(/0+$/, '')
  return fraction ? `${whole}${decimalSeparator(language)}${fraction}` : whole
}
