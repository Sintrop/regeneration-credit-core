/** RegenerationCreditImpact.CARBON_PER_TREE: grams of carbon credited to each counted tree. */
export const CARBON_PER_TREE_GRAMS = 100000

export type EraImpactStatus = 'settled' | 'pending' | 'current'

/**
 * InspectionRules._setEraImpact folds an era into the global totals only after it ends,
 * one era at a time, so a finished era can still be waiting to be counted.
 */
export function eraImpactStatus(
  era: number,
  currentEra: number,
  lastSettledEra: number
): EraImpactStatus {
  if (era <= lastSettledEra) return 'settled'
  if (era < currentEra) return 'pending'
  return 'current'
}

/** Mirrors RegenerationCreditImpact.totalTreesImpact: average trees per counted inspection times certified regenerators. */
export function averageTreesPerInspection(
  inspectionsTrees: number,
  realizedInspections: number
): number {
  return realizedInspections > 0 ? inspectionsTrees / realizedInspections : 0
}

/**
 * Mirrors RegenerationCreditImpact._getEffectiveSupply: tokens out of the pools
 * (circulating) plus every token ever burned for a certificate.
 */
export function tokenSupplyBreakdown(
  totalSupply: number,
  totalLocked: number,
  totalCertified: number
): { circulating: number; effective: number } {
  const circulating = Math.max(0, totalSupply - totalLocked)
  return {
    circulating,
    effective: circulating + totalCertified
  }
}
