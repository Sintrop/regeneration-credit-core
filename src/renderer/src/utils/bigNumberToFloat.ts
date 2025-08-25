export function bigNumberToFloat(value: string): number {
  return parseFloat(String(value).replace('n', ''))
}
