import { describe, expect, it } from 'vitest'
import {
  directBurns,
  peerToPeerTransfers,
  sortFeed,
  toFeedEvent,
  weiToAmount
} from '@renderer/services/feed/buildFeed'
import { RawLog } from '@renderer/services/feed/feedTypes'

const log = (args: Record<string, unknown>, tx: string, block = 1, index = 0): RawLog => ({
  args,
  blockNumber: BigInt(block),
  logIndex: index,
  transactionHash: tx
})

const alice = '0x1111111111111111111111111111111111111111'
const bob = '0x2222222222222222222222222222222222222222'
const pool = '0xFC222077860d34dEfA62Dd8A848703025B7b75f7'
const zero = '0x0000000000000000000000000000000000000000'

describe('weiToAmount', () => {
  it('keeps four decimals', () => {
    expect(weiToAmount(1500000000000000000n)).toBe(1.5)
    expect(weiToAmount('550000000000000000000000')).toBe(550000)
  })
})

describe('directBurns', () => {
  it('drops certifications that belong to an offset transaction', () => {
    const certified = [log({}, '0xa'), log({}, '0xb')]
    expect(directBurns(certified, [log({}, '0xa')]).map((item) => item.transactionHash)).toEqual([
      '0xb'
    ])
  })
})

describe('peerToPeerTransfers', () => {
  it('keeps only person-to-person transfers', () => {
    const transfers = [
      log({ from: alice, to: bob }, '0x1'),
      log({ from: pool, to: alice }, '0x2'),
      log({ from: zero, to: pool }, '0x3'),
      log({ from: alice, to: zero }, '0x4'),
      log({ from: bob, to: alice }, '0x5')
    ]
    const result = peerToPeerTransfers(transfers, [pool.toLowerCase()], [log({}, '0x5')])
    expect(result.map((item) => item.transactionHash)).toEqual(['0x1'])
  })
})

describe('toFeedEvent and sortFeed', () => {
  it('normalizes bigint args and orders newest first', () => {
    const older = toFeedEvent(
      'research',
      log({ researcher: alice, researchId: 3n }, '0xa', 10, 0),
      'researcher'
    )
    const newer = toFeedEvent(
      'report',
      log({ developerAddress: bob, id: 7n }, '0xb', 20, 1),
      'developerAddress'
    )
    const sameBlockLater = toFeedEvent(
      'report',
      log({ developerAddress: bob, id: 8n }, '0xc', 20, 5),
      'developerAddress'
    )
    expect(older.actor).toBe(alice)
    expect(older.data.researchId).toBe(3)
    expect(
      sortFeed([older, newer, sameBlockLater]).map((item) => item.data.id ?? item.data.researchId)
    ).toEqual([8, 7, 3])
  })
})
