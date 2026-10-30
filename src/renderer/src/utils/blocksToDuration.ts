/** Sintrop network block time, as configured in go-sintrop. */
export const SECONDS_PER_BLOCK = 13

/** Approximate whole days for a block count, never below 0. */
export function blocksToDays(blocks: number): number {
  return Math.max(0, Math.round((blocks * SECONDS_PER_BLOCK) / 86400))
}

const SECONDS_PER_HOUR = 60 * 60
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

export type DurationUnit = 'days' | 'hours' | 'minutes'

/** Approximate duration in the largest unit that keeps the value at 1 or more. */
export function blocksToDuration(blocks: number): { value: number; unit: DurationUnit } {
  const seconds = Math.max(0, blocks) * SECONDS_PER_BLOCK
  if (seconds >= SECONDS_PER_DAY)
    return { value: Math.round(seconds / SECONDS_PER_DAY), unit: 'days' }
  if (seconds >= SECONDS_PER_HOUR)
    return { value: Math.round(seconds / SECONDS_PER_HOUR), unit: 'hours' }
  return { value: Math.max(1, Math.round(seconds / 60)), unit: 'minutes' }
}
