import { describe, expect, it } from 'vitest'

import { toCompensations } from '@renderer/services/profile/profileEvents'
import { formatArea } from '@renderer/utils/formatArea'
import { formatCarbon } from '@renderer/utils/formatCarbon'

const log = (hash: string, block: number, args: Record<string, unknown>): never =>
  ({ transactionHash: hash, blockNumber: BigInt(block), args }) as never

describe('toCompensations', () => {
  it('keeps offsets and drops the TokensCertified they emit, keeping direct burns', () => {
    const offsets = [
      log('0xa', 10, {
        amountBurned: 100n,
        calculatorItemId: 3n,
        message: 'Gasolina',
        blockNumber: 10n
      })
    ]
    const certified = [log('0xa', 10, { amount: 100n }), log('0xb', 20, { amount: 50n })]
    expect(toCompensations(offsets, certified)).toEqual([
      { kind: 'treeFunding', amount: 50n, blockNumber: 20, transactionHash: '0xb' },
      {
        kind: 'offset',
        amount: 100n,
        blockNumber: 10,
        calculatorItemId: 3,
        message: 'Gasolina',
        transactionHash: '0xa'
      }
    ])
  })
})

describe('impact formatting', () => {
  it('uses the largest readable unit', () => {
    expect(formatCarbon(9_400, 'pt')).toBe('9,4 kg')
    expect(formatCarbon(2_500_000, 'en')).toBe('2.5 t')
    expect(formatArea(25_000, 'pt')).toBe('2,5 ha')
  })
})
