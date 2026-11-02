import { describe, expect, it } from 'vitest'

import {
  inspectionStatus,
  toInspectionSummary
} from '@renderer/services/inspections/inspectionsService'

describe('inspectionStatus', () => {
  const block = 1_000_000
  it('maps the contract enum', () => {
    expect(inspectionStatus({ rawStatus: 0, acceptedAt: 0 }, block, 50_000)).toBe('open')
    expect(inspectionStatus({ rawStatus: 2, acceptedAt: 1 }, block, 50_000)).toBe('realized')
    expect(inspectionStatus({ rawStatus: 3, acceptedAt: 1 }, block, 50_000)).toBe('invalidated')
  })

  it('expires an accepted inspection after blocksToExpireAcceptedInspection', () => {
    expect(inspectionStatus({ rawStatus: 1, acceptedAt: block - 10 }, block, 50_000)).toBe(
      'accepted'
    )
    expect(inspectionStatus({ rawStatus: 1, acceptedAt: block - 50_001 }, block, 50_000)).toBe(
      'expired'
    )
  })
})

describe('toInspectionSummary', () => {
  it('converts the contract struct', () => {
    expect(
      toInspectionSummary({
        id: 86n,
        status: 2n,
        treesResult: 69n,
        regenerationScore: 3n,
        regenerator: '0xR'
      })
    ).toMatchObject({
      id: 86,
      rawStatus: 2,
      treesResult: 69,
      regenerationScore: 3,
      regenerator: '0xR'
    })
  })
})
