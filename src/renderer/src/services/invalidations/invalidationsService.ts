import { Abi, createPublicClient, http } from 'viem'

import { sintrop } from '../../../../chains/sintrop'
import * as C from '../contracts'
import { VoteKind } from '../votes/voteCheck'

export interface InvalidationVote {
  validator: string
  justification: string
  blockNumber: number
}

export type CaseStatus = 'invalidated' | 'open' | 'closed'

/** Every vote cast against one user (in one era of their pool) or one resource. */
export interface InvalidationCase {
  kind: VoteKind
  /** User address or resource id. */
  target: string
  /** User votes are counted per era of the user's pool; resources only in their own era. */
  era?: number
  votes: InvalidationVote[]
  status: CaseStatus
  /** Block of the newest vote, or of the invalidation when there are no votes. */
  lastBlock: number
}

export interface RawVote {
  kind: VoteKind
  target: string
  era?: number
  validator: string
  justification: string
  blockNumber: number
}

export interface InvalidationInputs {
  votes: RawVote[]
  /** Ids from the *Invalidated events, keyed by kind. */
  invalidated: Record<Exclude<VoteKind, 'user'>, { id: string; blockNumber: number }[]>
  /** Addresses from CommunityRules.DeniedUserEvent: user votes or too many penalties. */
  denied: { address: string; blockNumber: number }[]
  /** Whether the contract still takes votes on this case (same era as its pool's current one). */
  isVotingOpen: (kind: VoteKind, target: string, era?: number) => boolean
}

const caseKey = (kind: VoteKind, target: string, era?: number): string =>
  `${kind}:${target.toLowerCase()}:${era ?? ''}`

export function buildInvalidationCases(inputs: InvalidationInputs): InvalidationCase[] {
  const cases = new Map<string, InvalidationCase>()
  const deniedAt = new Map(inputs.denied.map((d) => [d.address.toLowerCase(), d.blockNumber]))
  const invalidatedIds = new Map<string, number>()
  for (const [kind, list] of Object.entries(inputs.invalidated)) {
    for (const item of list)
      invalidatedIds.set(caseKey(kind as VoteKind, item.id), item.blockNumber)
  }

  for (const vote of inputs.votes) {
    const key = caseKey(vote.kind, vote.target, vote.kind === 'user' ? vote.era : undefined)
    const entry = cases.get(key) ?? {
      kind: vote.kind,
      target: vote.target,
      era: vote.era,
      votes: [],
      status: 'open' as CaseStatus,
      lastBlock: 0
    }
    entry.votes.push({
      validator: vote.validator,
      justification: vote.justification,
      blockNumber: vote.blockNumber
    })
    entry.lastBlock = Math.max(entry.lastBlock, vote.blockNumber)
    cases.set(key, entry)
  }

  for (const entry of cases.values()) {
    entry.votes.sort((a, b) => a.blockNumber - b.blockNumber)
    if (entry.kind === 'user') {
      const denied = deniedAt.get(entry.target.toLowerCase())
      if (denied !== undefined && denied >= entry.votes[0].blockNumber) entry.status = 'invalidated'
      else entry.status = inputs.isVotingOpen('user', entry.target, entry.era) ? 'open' : 'closed'
    } else if (invalidatedIds.has(caseKey(entry.kind, entry.target))) {
      entry.status = 'invalidated'
    } else {
      entry.status = inputs.isVotingOpen(entry.kind, entry.target) ? 'open' : 'closed'
    }
  }

  // Users denied by accumulated penalties, without user votes, still belong in the record.
  const votedUsers = new Set(
    [...cases.values()].filter((c) => c.kind === 'user').map((c) => c.target.toLowerCase())
  )
  for (const d of inputs.denied) {
    if (votedUsers.has(d.address.toLowerCase())) continue
    cases.set(caseKey('user', d.address, -1), {
      kind: 'user',
      target: d.address,
      votes: [],
      status: 'invalidated',
      lastBlock: d.blockNumber
    })
  }

  return [...cases.values()].sort((a, b) => b.lastBlock - a.lastBlock)
}

export interface InvalidationRules {
  votesToInvalidate: number
  votersCount: number
  timeBetweenVotes: number
  /** Penalties that deny a researcher, developer or contributor (each Rules.maxPenalties). */
  maxPenalties: number
}

export interface InvalidationsOverview {
  rules: InvalidationRules
  cases: InvalidationCase[]
}

interface Log {
  args: Record<string, unknown>
  blockNumber: bigint
}

/** User types whose pool era counts a user's votes (ValidationRules._userCurrentEra). */
const USER_RULES: Record<number, { address: string; abi: unknown }> = {
  1: { address: C.regeneratorAddress, abi: C.regeneratorAbi },
  2: { address: C.inspectorAddress, abi: C.inspectorAbi },
  3: { address: C.researcherAddress, abi: C.researcherAbi },
  4: { address: C.developerAddress, abi: C.developerAbi },
  5: { address: C.contributorAddress, abi: C.contributorAbi },
  6: { address: C.activistAddress, abi: C.activistAbi }
}

export async function fetchInvalidations(rpc: string): Promise<InvalidationsOverview> {
  const client = createPublicClient({ chain: sintrop, transport: http(rpc) })
  const read = (
    address: string,
    abi: unknown,
    functionName: string,
    args: unknown[] = []
  ): Promise<unknown> =>
    client.readContract({ address: address as `0x${string}`, abi: abi as Abi, functionName, args })
  const logs = (address: string, abi: unknown, eventName: string): Promise<Log[]> =>
    client.getContractEvents({
      address: address as `0x${string}`,
      abi: abi as Abi,
      eventName,
      fromBlock: 0n,
      toBlock: 'latest'
    }) as unknown as Promise<Log[]>

  const [
    userVotes,
    researchVotes,
    contributionVotes,
    reportVotes,
    inspectionVotes,
    researchInvalidated,
    contributionInvalidated,
    reportInvalidated,
    inspectionInvalidated,
    denied,
    votesToInvalidate,
    votersCount,
    timeBetweenVotes,
    maxPenalties,
    researchEra,
    contributionEra,
    reportEra,
    inspectionEra
  ] = await Promise.all([
    logs(C.validationAddress, C.validationAbi, 'UserValidation'),
    logs(C.researcherAddress, C.researcherAbi, 'ResearchValidation'),
    logs(C.contributorAddress, C.contributorAbi, 'ContributionValidation'),
    logs(C.developerAddress, C.developerAbi, 'ReportValidation'),
    logs(C.inspectionAddress, C.inspectionAbi, 'InspectionValidation'),
    logs(C.researcherAddress, C.researcherAbi, 'ResearchInvalidated'),
    logs(C.contributorAddress, C.contributorAbi, 'ContributionInvalidated'),
    logs(C.developerAddress, C.developerAbi, 'ReportInvalidated'),
    logs(C.inspectionAddress, C.inspectionAbi, 'InspectionInvalidated'),
    logs(C.userAddress, C.userAbi, 'DeniedUserEvent'),
    read(C.validationAddress, C.validationAbi, 'votesToInvalidate'),
    read(C.userAddress, C.userAbi, 'votersCount'),
    read(C.validationAddress, C.validationAbi, 'timeBetweenVotes'),
    read(C.researcherAddress, C.researcherAbi, 'maxPenalties'),
    read(C.researcherAddress, C.researcherAbi, 'poolCurrentEra'),
    read(C.contributorAddress, C.contributorAbi, 'poolCurrentEra'),
    read(C.developerAddress, C.developerAbi, 'poolCurrentEra'),
    // InspectionRules.addInspectionValidation compares inspectedAtEra with RegeneratorRules.poolCurrentEra.
    read(C.regeneratorAddress, C.regeneratorAbi, 'poolCurrentEra')
  ])

  const resourceVote =
    (kind: VoteKind) =>
    (log: Log): RawVote => ({
      kind,
      target: String(log.args._resourceId),
      validator: String(log.args._validatorAddress),
      justification: String(log.args._justification ?? ''),
      blockNumber: Number(log.blockNumber)
    })
  const ids = (list: Log[], field: string): { id: string; blockNumber: number }[] =>
    list.map((log) => ({ id: String(log.args[field]), blockNumber: Number(log.blockNumber) }))

  // Pool era of every voted user, so an unfinished vote shows as open or closed.
  const votedUsers = [...new Set(userVotes.map((log) => String(log.args._userAddress)))]
  const eras = new Map<string, number>()
  await Promise.all(
    votedUsers.map(async (address) => {
      const type = Number(await read(C.userAddress, C.userAbi, 'getUser', [address]))
      const rules = USER_RULES[type]
      if (rules)
        eras.set(
          address.toLowerCase(),
          Number(await read(rules.address, rules.abi, 'poolCurrentEra'))
        )
    })
  )

  const RESOURCE_READ: Record<Exclude<VoteKind, 'user'>, [string, unknown, string, string]> = {
    research: [C.researcherAddress, C.researcherAbi, 'getResearch', 'era'],
    contribution: [C.contributorAddress, C.contributorAbi, 'getContribution', 'era'],
    report: [C.developerAddress, C.developerAbi, 'getReport', 'era'],
    inspection: [C.inspectionAddress, C.inspectionAbi, 'getInspection', 'inspectedAtEra']
  }
  const resourceEra: Record<Exclude<VoteKind, 'user'>, number> = {
    research: Number(researchEra),
    contribution: Number(contributionEra),
    report: Number(reportEra),
    inspection: Number(inspectionEra)
  }
  const resourceVotes: [Exclude<VoteKind, 'user'>, Log[]][] = [
    ['research', researchVotes],
    ['contribution', contributionVotes],
    ['report', reportVotes],
    ['inspection', inspectionVotes]
  ]
  const publishedEra = new Map<string, number>()
  await Promise.all(
    resourceVotes.flatMap(([kind, list]) =>
      [...new Set(list.map((log) => String(log.args._resourceId)))].map(async (id) => {
        const [address, abi, getter, field] = RESOURCE_READ[kind]
        const item = (await read(address, abi, getter, [BigInt(id)])) as Record<string, unknown>
        publishedEra.set(`${kind}:${id}`, Number(item[field]))
      })
    )
  )

  const cases = buildInvalidationCases({
    votes: [
      ...userVotes.map((log) => ({
        kind: 'user' as const,
        target: String(log.args._userAddress),
        era: Number(log.args._currentEra),
        validator: String(log.args._validatorAddress),
        justification: String(log.args._justification ?? ''),
        blockNumber: Number(log.blockNumber)
      })),
      ...researchVotes.map(resourceVote('research')),
      ...contributionVotes.map(resourceVote('contribution')),
      ...reportVotes.map(resourceVote('report')),
      ...inspectionVotes.map(resourceVote('inspection'))
    ],
    invalidated: {
      research: ids(researchInvalidated, 'researchId'),
      contribution: ids(contributionInvalidated, 'contributionId'),
      report: ids(reportInvalidated, 'reportId'),
      inspection: ids(inspectionInvalidated, 'inspectionId')
    },
    denied: denied.map((log) => ({
      address: String(log.args.addr),
      blockNumber: Number(log.blockNumber)
    })),
    isVotingOpen: (kind, target, era) =>
      kind === 'user'
        ? era === eras.get(target.toLowerCase())
        : publishedEra.get(`${kind}:${target}`) === resourceEra[kind]
  })

  return {
    rules: {
      votesToInvalidate: Number(votesToInvalidate),
      votersCount: Number(votersCount),
      timeBetweenVotes: Number(timeBetweenVotes),
      maxPenalties: Number(maxPenalties)
    },
    cases
  }
}
