import { describe, expect, it } from 'vitest'

import { regeneratorAverages } from '@renderer/hooks/useRegeneratorInspections'
import { InspectionSummary } from '@renderer/services/inspections/inspectionsService'
import { profileUrl } from '@renderer/utils/profileUrl'

const inspection = (rawStatus: number, trees: number, bio: number): InspectionSummary =>
  ({ rawStatus, treesResult: trees, biodiversityResult: bio }) as InspectionSummary

describe('regeneratorAverages', () => {
  it('averages only realized inspections', () => {
    expect(
      regeneratorAverages([
        inspection(2, 69, 18),
        inspection(2, 31, 10),
        inspection(0, 0, 0),
        inspection(3, 999, 99)
      ])
    ).toEqual({ treesAverage: 50, bioAverage: 14, realized: 2 })
    expect(regeneratorAverages([inspection(0, 0, 0)])).toEqual({
      treesAverage: 0,
      bioAverage: 0,
      realized: 0
    })
  })
})

describe('profileUrl', () => {
  it('slugs the whole name, without accents', () => {
    expect(profileUrl('regenerator', '0xabc', 'Sítio São Diego  da Serra')).toMatch(
      /\/regenerator\/0xabc\/sitio-sao-diego-da-serra$/
    )
  })
})
