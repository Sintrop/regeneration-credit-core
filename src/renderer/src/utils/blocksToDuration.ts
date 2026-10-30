/** Sintrop network block time, as configured in go-sintrop. */
export const SECONDS_PER_BLOCK = 13

/** Approximate whole days for a block count, never below 0. */
export function blocksToDays(blocks: number): number {
  return Math.max(0, Math.round((blocks * SECONDS_PER_BLOCK) / 86400))
}
