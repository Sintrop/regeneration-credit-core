import { describe, expect, it } from 'vitest'
import { buildUserTimers } from '@renderer/services/timers/userTimers'

const block = 3744100

const regenerator = { allowedInitialRequests: 2, timeBetweenInspections: 6000, maxInspections: 6 }
const inspector = {
  maxGiveUps: 3,
  blocksToAccept: 6000,
  blocksToExpireAcceptedInspection: 50000,
  securityBlocksToValidation: 96000
}

describe('buildUserTimers: regenerator', () => {
  it('can request while under the initial free requests', () => {
    const [timer] = buildUserTimers({
      userType: 1,
      currentBlock: block,
      regenerator: {
        ...regenerator,
        totalInspections: 1,
        lastRequestAt: block - 10,
        pendingInspection: false
      }
    })
    expect(timer).toEqual({ key: 'requestInspection', status: 'available' })
  })

  it('waits timeBetweenInspections after the initial requests', () => {
    const [timer] = buildUserTimers({
      userType: 1,
      currentBlock: block,
      regenerator: {
        ...regenerator,
        totalInspections: 3,
        lastRequestAt: block - 1000,
        pendingInspection: false
      }
    })
    expect(timer).toEqual({ key: 'requestInspection', status: 'waiting', blocks: 5001 })
  })

  it('reports an open request and the finished mission', () => {
    expect(
      buildUserTimers({
        userType: 1,
        currentBlock: block,
        regenerator: {
          ...regenerator,
          totalInspections: 3,
          lastRequestAt: 1,
          pendingInspection: true
        }
      })[0].status
    ).toBe('inProgress')
    expect(
      buildUserTimers({
        userType: 1,
        currentBlock: block,
        regenerator: {
          ...regenerator,
          totalInspections: 6,
          lastRequestAt: 1,
          pendingInspection: false
        }
      })[0].status
    ).toBe('done')
  })
})

describe('buildUserTimers: inspector', () => {
  const base = { ...inspector, giveUps: 0, lastRealizedAt: 0, regeneratorNextEraIn: 1000000 }

  it('can accept with no history and an open era', () => {
    expect(buildUserTimers({ userType: 2, currentBlock: block, inspector: base })[0]).toEqual({
      key: 'acceptInspection',
      status: 'available'
    })
  })

  it('waits BLOCKS_TO_ACCEPT after the last realized inspection', () => {
    expect(
      buildUserTimers({
        userType: 2,
        currentBlock: block,
        inspector: { ...base, lastRealizedAt: block - 2000 }
      })[0]
    ).toEqual({ key: 'acceptInspection', status: 'waiting', blocks: 4001 })
  })

  it('shows the accepted inspection in progress with blocks to expire', () => {
    const timer = buildUserTimers({
      userType: 2,
      currentBlock: block,
      inspector: { ...base, lastInspection: { status: 1, acceptedAt: block - 10000 } }
    })[0]
    expect(timer).toEqual({ key: 'acceptInspection', status: 'inProgress', blocks: 40000 })
  })

  it('blocks near the end of the era and after 3 give-ups', () => {
    expect(
      buildUserTimers({
        userType: 2,
        currentBlock: block,
        inspector: { ...base, regeneratorNextEraIn: 140000 }
      })[0].reason
    ).toBe('eraEnding')
    expect(
      buildUserTimers({ userType: 2, currentBlock: block, inspector: { ...base, giveUps: 3 } })[0]
        .status
    ).toBe('blocked')
  })
})

describe('buildUserTimers: researcher', () => {
  const publisher = {
    timeBetweenWorks: 192000,
    securityBlocksToValidation: 96000,
    nextEraIn: 1111880,
    lastPublishedAt: 2448114,
    lastCalculatorItemAt: 2448157
  }

  it('lists research, calculator item, vote, invite and withdraw', () => {
    const timers = buildUserTimers({
      userType: 3,
      currentBlock: block,
      publisher,
      voter: { canVote: true, lastVoteAt: 0, timeBetweenVotes: 6000 },
      invitation: { canSendInvite: true, lastInviteBlock: 3636764, invitationDelayBlocks: 100000 },
      pool: { userEra: 3, poolEra: 3, blocksToNextEra: 1111880 }
    })
    expect(timers.map((timer) => [timer.key, timer.status])).toEqual([
      ['publishResearch', 'available'],
      ['publishCalculatorItem', 'available'],
      ['vote', 'available'],
      ['invite', 'available'],
      ['withdraw', 'waiting']
    ])
  })

  it('applies the security window to research but not to calculator items', () => {
    const timers = buildUserTimers({
      userType: 3,
      currentBlock: block,
      publisher: { ...publisher, nextEraIn: 50000 }
    })
    expect(timers[0]).toEqual({
      key: 'publishResearch',
      status: 'waiting',
      blocks: 50000,
      reason: 'eraEnding'
    })
    expect(timers[1].status).toBe('available')
  })
})

describe('buildUserTimers: activist invitations', () => {
  it('has separate delays for regenerators/inspectors and for activists', () => {
    const timers = buildUserTimers({
      userType: 6,
      currentBlock: block,
      invitation: {
        canSendInvite: false,
        lastInviteBlock: 0,
        invitationDelayBlocks: 100000,
        lastInviteActivist: block - 1000,
        activistDelayBlocks: 3000
      }
    })
    expect(timers).toEqual([
      { key: 'inviteRegeneratorInspector', status: 'waiting', blocks: 2000 },
      { key: 'invite', status: 'blocked', reason: 'levelRequired' }
    ])
  })
})

describe('buildUserTimers: withdraw', () => {
  it('is available while the user era is behind the pool era', () => {
    expect(
      buildUserTimers({
        userType: 4,
        currentBlock: block,
        pool: { userEra: 2, poolEra: 3, blocksToNextEra: -10 }
      })
    ).toEqual([{ key: 'withdraw', status: 'available' }])
  })

  it('counts down to the end of the user era otherwise', () => {
    expect(
      buildUserTimers({
        userType: 4,
        currentBlock: block,
        pool: { userEra: 3, poolEra: 3, blocksToNextEra: 5000 }
      })
    ).toEqual([{ key: 'withdraw', status: 'waiting', blocks: 5000 }])
  })

  it('requires 3 inspections for regenerators', () => {
    expect(
      buildUserTimers({
        userType: 1,
        currentBlock: block,
        pool: { userEra: 1, poolEra: 3, blocksToNextEra: 0, minimumInspectionsMet: false }
      })
    ).toEqual([{ key: 'withdraw', status: 'blocked', reason: 'minimumInspections' }])
  })
})
