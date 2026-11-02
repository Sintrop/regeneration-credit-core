import { useMemo } from 'react'

import { useInspectionsList } from '@renderer/hooks/useInspectionsList'
import { InspectionSummary } from '@renderer/services/inspections/inspectionsService'

/** Realized inspections (status 2) of one regenerator and their average results. */
export function regeneratorAverages(inspections: InspectionSummary[]): {
  treesAverage: number
  bioAverage: number
  realized: number
} {
  const realized = inspections.filter((item) => item.rawStatus === 2)
  if (realized.length === 0) return { treesAverage: 0, bioAverage: 0, realized: 0 }
  const sum = (key: 'treesResult' | 'biodiversityResult'): number =>
    realized.reduce((total, item) => total + item[key], 0)
  return {
    treesAverage: Math.round(sum('treesResult') / realized.length),
    bioAverage: Math.round(sum('biodiversityResult') / realized.length),
    realized: realized.length
  }
}

export function useRegeneratorInspections(address: string): {
  inspections: InspectionSummary[]
  treesAverage: number
  bioAverage: number
  isLoading: boolean
} {
  const { inspections: all, isLoading } = useInspectionsList()
  return useMemo(() => {
    const mine = all.filter((item) => item.regenerator.toLowerCase() === address.toLowerCase())
    return { inspections: mine, ...regeneratorAverages(mine), isLoading }
  }, [all, address, isLoading])
}
