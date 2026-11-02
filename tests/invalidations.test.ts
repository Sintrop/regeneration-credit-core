import { describe, expect, it } from 'vitest'

import {
  buildInvalidationCases,
  InvalidationInputs
} from '../src/renderer/src/services/invalidations/invalidationsService'

const A = '0x00000000000000000000000000000000000000aa'
const B = '0x00000000000000000000000000000000000000bb'
const V1 = '0x0000000000000000000000000000000000000001'
const V2 = '0x0000000000000000000000000000000000000002'

const base: InvalidationInputs = {
  votes: [],
  invalidated: { research: [], contribution: [], report: [], inspection: [] },
  denied: [],
  isVotingOpen: () => true
}

describe('buildInvalidationCases', () => {
  it('groups user votes per user and era, oldest vote first', () => {
    const cases = buildInvalidationCases({
      ...base,
      votes: [
        { kind: 'user', target: A, era: 2, validator: V2, justification: 'b', blockNumber: 20 },
        { kind: 'user', target: A, era: 2, validator: V1, justification: 'a', blockNumber: 10 },
        { kind: 'user', target: A, era: 3, validator: V1, justification: 'c', blockNumber: 30 }
      ],
      isVotingOpen: (_kind, _target, era) => era === 3
    })
    expect(cases).toHaveLength(2)
    expect(cases[0]).toMatchObject({ era: 3, status: 'open', lastBlock: 30 })
    expect(cases[1]).toMatchObject({ era: 2, status: 'closed', lastBlock: 20 })
    expect(cases[1].votes.map((v) => v.validator)).toEqual([V1, V2])
  })

  it('marks a user invalidated when denied after the votes', () => {
    const cases = buildInvalidationCases({
      ...base,
      votes: [{ kind: 'user', target: A, era: 1, validator: V1, justification: '', blockNumber: 10 }],
      denied: [{ address: A.toUpperCase().replace('0X', '0x'), blockNumber: 11 }]
    })
    expect(cases).toHaveLength(1)
    expect(cases[0].status).toBe('invalidated')
  })

  it('lists users denied by penalties even without user votes', () => {
    const cases = buildInvalidationCases({ ...base, denied: [{ address: B, blockNumber: 50 }] })
    expect(cases).toEqual([
      { kind: 'user', target: B, votes: [], status: 'invalidated', lastBlock: 50 }
    ])
  })

  it('uses the *Invalidated events for resources', () => {
    const cases = buildInvalidationCases({
      ...base,
      votes: [
        { kind: 'research', target: '5', validator: V1, justification: '', blockNumber: 10 },
        { kind: 'report', target: '5', validator: V1, justification: '', blockNumber: 12 }
      ],
      invalidated: { ...base.invalidated, research: [{ id: '5', blockNumber: 10 }] },
      isVotingOpen: () => false
    })
    expect(cases.find((c) => c.kind === 'research')?.status).toBe('invalidated')
    expect(cases.find((c) => c.kind === 'report')?.status).toBe('closed')
  })
})
