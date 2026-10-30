export type TimerKey =
  | 'requestInspection'
  | 'acceptInspection'
  | 'publishResearch'
  | 'publishCalculatorItem'
  | 'publishReport'
  | 'publishContribution'
  | 'vote'
  | 'invite'
  | 'inviteRegeneratorInspector'
  | 'withdraw'
  | 'offset'

export type TimerStatus = 'available' | 'waiting' | 'blocked' | 'done' | 'inProgress'

export type TimerReason =
  | 'eraEnding'
  | 'pendingInspection'
  | 'missionComplete'
  | 'giveUps'
  | 'levelRequired'
  | 'minimumInspections'

export interface UserTimer {
  key: TimerKey
  status: TimerStatus
  /** Blocks until the action opens (waiting) or until the current task expires (inProgress). */
  blocks?: number
  reason?: TimerReason
}

/** Raw values read from the contracts, per feature. Missing groups are skipped. */
export interface TimerInputs {
  userType: number
  currentBlock: number
  regenerator?: {
    totalInspections: number
    lastRequestAt: number
    pendingInspection: boolean
    allowedInitialRequests: number
    timeBetweenInspections: number
    maxInspections: number
  }
  inspector?: {
    giveUps: number
    maxGiveUps: number
    lastRealizedAt: number
    blocksToAccept: number
    lastInspection?: { status: number; acceptedAt: number }
    blocksToExpireAcceptedInspection: number
    regeneratorNextEraIn: number
    securityBlocksToValidation: number
  }
  publisher?: {
    timeBetweenWorks: number
    securityBlocksToValidation: number
    nextEraIn: number
    lastPublishedAt: number
    lastCalculatorItemAt: number
  }
  voter?: {
    canVote: boolean
    lastVoteAt: number
    timeBetweenVotes: number
  }
  invitation?: {
    canSendInvite: boolean
    lastInviteBlock: number
    invitationDelayBlocks: number
    lastInviteActivist?: number
    activistDelayBlocks?: number
  }
  pool?: {
    userEra: number
    poolEra: number
    /** Pool nextEraIn(userEra): blocks until the user's current era ends. */
    blocksToNextEra: number
    /** RegeneratorRules.withdraw also requires MINIMUM_INSPECTIONS_TO_POOL. */
    minimumInspectionsMet?: boolean
  }
}

const INSPECTION_ACCEPTED = 1

/** Contract rule "block.number > last + wait" (or never done): blocks still to wait, 0 when open. */
function blocksUntilStrict(currentBlock: number, last: number, wait: number): number {
  if (last <= 0) return 0
  return Math.max(0, last + wait - currentBlock + 1)
}

/** Contract rule "block.number - last >= wait" (or never done), used by invitation delays. */
function blocksUntilInclusive(currentBlock: number, last: number, wait: number): number {
  if (last <= 0) return 0
  return Math.max(0, last + wait - currentBlock)
}

function waitOrAvailable(key: TimerKey, blocks: number): UserTimer {
  return blocks > 0 ? { key, status: 'waiting', blocks } : { key, status: 'available' }
}

function publishTimer(
  key: TimerKey,
  input: NonNullable<TimerInputs['publisher']>,
  currentBlock: number,
  lastAt: number,
  checkWindow: boolean
): UserTimer {
  const wait = blocksUntilStrict(currentBlock, lastAt, input.timeBetweenWorks)
  if (wait > 0) return { key, status: 'waiting', blocks: wait }
  if (checkWindow && input.nextEraIn <= input.securityBlocksToValidation) {
    return { key, status: 'waiting', blocks: input.nextEraIn, reason: 'eraEnding' }
  }
  return { key, status: 'available' }
}

const PUBLISH_KEY: Record<number, TimerKey> = {
  3: 'publishResearch',
  4: 'publishReport',
  5: 'publishContribution'
}

/** Every time-gated action of the connected user, mirroring the contract checks. */
export function buildUserTimers(input: TimerInputs): UserTimer[] {
  const { userType, currentBlock } = input
  const timers: UserTimer[] = []

  // SupporterRules.offset has no time gate (only the 1 RC minimum), so it is always open.
  if (userType === 7) timers.push({ key: 'offset', status: 'available' })

  if (userType === 1 && input.regenerator) {
    const r = input.regenerator
    if (r.totalInspections >= r.maxInspections) {
      timers.push({ key: 'requestInspection', status: 'done', reason: 'missionComplete' })
    } else if (r.pendingInspection) {
      timers.push({ key: 'requestInspection', status: 'inProgress', reason: 'pendingInspection' })
    } else if (r.totalInspections < r.allowedInitialRequests) {
      timers.push({ key: 'requestInspection', status: 'available' })
    } else {
      timers.push(
        waitOrAvailable(
          'requestInspection',
          Math.max(0, r.lastRequestAt + r.timeBetweenInspections - currentBlock + 1)
        )
      )
    }
  }

  if (userType === 2 && input.inspector) {
    const i = input.inspector
    const last = i.lastInspection
    const activeInspection =
      last &&
      last.status === INSPECTION_ACCEPTED &&
      currentBlock <= last.acceptedAt + i.blocksToExpireAcceptedInspection

    if (i.giveUps >= i.maxGiveUps) {
      timers.push({ key: 'acceptInspection', status: 'blocked', reason: 'giveUps' })
    } else if (activeInspection && last) {
      timers.push({
        key: 'acceptInspection',
        status: 'inProgress',
        blocks: last.acceptedAt + i.blocksToExpireAcceptedInspection - currentBlock
      })
    } else {
      const wait = blocksUntilStrict(currentBlock, i.lastRealizedAt, i.blocksToAccept)
      const windowOk =
        i.regeneratorNextEraIn >= i.blocksToExpireAcceptedInspection &&
        i.regeneratorNextEraIn - i.blocksToExpireAcceptedInspection > i.securityBlocksToValidation
      if (wait > 0) timers.push({ key: 'acceptInspection', status: 'waiting', blocks: wait })
      else if (!windowOk)
        timers.push({
          key: 'acceptInspection',
          status: 'waiting',
          blocks: i.regeneratorNextEraIn,
          reason: 'eraEnding'
        })
      else timers.push({ key: 'acceptInspection', status: 'available' })
    }
  }

  if (input.publisher && PUBLISH_KEY[userType]) {
    timers.push(
      publishTimer(
        PUBLISH_KEY[userType],
        input.publisher,
        currentBlock,
        input.publisher.lastPublishedAt,
        true
      )
    )
    if (userType === 3) {
      timers.push(
        publishTimer(
          'publishCalculatorItem',
          input.publisher,
          currentBlock,
          input.publisher.lastCalculatorItemAt,
          false
        )
      )
    }
  }

  if (input.voter) {
    const v = input.voter
    if (!v.canVote) timers.push({ key: 'vote', status: 'blocked', reason: 'levelRequired' })
    else
      timers.push(
        waitOrAvailable('vote', blocksUntilStrict(currentBlock, v.lastVoteAt, v.timeBetweenVotes))
      )
  }

  if (input.invitation) {
    const inv = input.invitation
    if (userType === 6 && inv.activistDelayBlocks !== undefined) {
      timers.push(
        waitOrAvailable(
          'inviteRegeneratorInspector',
          blocksUntilInclusive(currentBlock, inv.lastInviteActivist ?? 0, inv.activistDelayBlocks)
        )
      )
    }
    if (!inv.canSendInvite)
      timers.push({ key: 'invite', status: 'blocked', reason: 'levelRequired' })
    else
      timers.push(
        waitOrAvailable(
          'invite',
          blocksUntilInclusive(currentBlock, inv.lastInviteBlock, inv.invitationDelayBlocks)
        )
      )
  }

  if (input.pool) {
    const p = input.pool
    if (p.minimumInspectionsMet === false)
      timers.push({ key: 'withdraw', status: 'blocked', reason: 'minimumInspections' })
    // Blockable.canWithdraw(currentUserEra): currentUserEra < currentContractEra()
    else if (p.userEra < p.poolEra) timers.push({ key: 'withdraw', status: 'available' })
    else timers.push({ key: 'withdraw', status: 'waiting', blocks: Math.max(1, p.blocksToNextEra) })
  }

  return timers
}
