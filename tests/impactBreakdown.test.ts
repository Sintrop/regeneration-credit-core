import { describe, expect, it } from 'vitest'
import {
  averageTreesPerInspection,
  eraImpactStatus,
  tokenSupplyBreakdown
} from '@renderer/utils/impactBreakdown'

describe('eraImpactStatus', () => {
  it('marks eras up to the last settled one as counted', () => {
    expect(eraImpactStatus(1, 3, 1)).toBe('settled')
  })

  it('marks finished eras not yet folded into the totals as pending', () => {
    expect(eraImpactStatus(2, 3, 1)).toBe('pending')
  })

  it('marks the running era as current', () => {
    expect(eraImpactStatus(3, 3, 1)).toBe('current')
  })
})

describe('averageTreesPerInspection', () => {
  it('divides counted trees by counted inspections', () => {
    expect(averageTreesPerInspection(363578, 56)).toBeCloseTo(6492.46, 2)
  })

  it('is zero before any inspection is counted', () => {
    expect(averageTreesPerInspection(0, 0)).toBe(0)
  })
})

describe('tokenSupplyBreakdown', () => {
  it('matches the contract effective supply: supply + certified - locked', () => {
    const { circulating, effective } = tokenSupplyBreakdown(
      1308766233.25,
      1130354699.06,
      1233766.75
    )
    expect(circulating).toBeCloseTo(178411534.19, 2)
    expect(effective).toBeCloseTo(1308766233.25 + 1233766.75 - 1130354699.06, 2)
  })
})
