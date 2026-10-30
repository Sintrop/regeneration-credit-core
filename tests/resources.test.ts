import { describe, expect, it } from 'vitest'

import { toPublishedResource } from '@renderer/services/resources/resourcesService'
import { cleanResourceText, resourceHeading } from '@renderer/utils/resourceText'

describe('toPublishedResource', () => {
  it('reads each contract struct with its own field names', () => {
    expect(
      toPublishedResource('research', {
        id: 5n,
        era: 2n,
        createdBy: '0xA',
        title: 'Agrofloresta',
        thesis: 'Tese',
        file: 'Qm1',
        validationsCount: 1n,
        createdAtBlock: 100n
      })
    ).toEqual({
      type: 'research',
      id: 5,
      title: 'Agrofloresta',
      body: 'Tese',
      author: '0xA',
      era: 2,
      file: 'Qm1',
      createdAtBlock: 100,
      validationsCount: 1
    })
    expect(
      toPublishedResource('contribution', {
        id: 1n,
        era: 3n,
        user: '0xB',
        description: 'Mutirão',
        report: 'Qm2',
        validationsCount: 0n,
        createdAtBlockNumber: 200n
      })
    ).toMatchObject({ author: '0xB', body: 'Mutirão', file: 'Qm2', createdAtBlock: 200, title: '' })
    expect(
      toPublishedResource('report', { id: 2n, developer: '0xC', createdAtBlockNumber: 300n })
    ).toMatchObject({ author: '0xC', createdAtBlock: 300 })
  })
})

describe('resource text', () => {
  it('strips labels and falls back to the description', () => {
    expect(cleanResourceText('## Descrição: Plantio')).toBe('Plantio')
    expect(resourceHeading('', 'x'.repeat(80))).toHaveLength(71)
    expect(resourceHeading('Título: Solo vivo', 'corpo')).toBe('Solo vivo')
  })
})
