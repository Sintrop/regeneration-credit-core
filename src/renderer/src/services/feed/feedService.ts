import { Abi, createPublicClient, http } from 'viem'

import { sintrop } from '../../../../chains/sintrop'
import {
  activistPoolAddress,
  contractsMainnet,
  contributorAbi,
  contributorAddress,
  contributorPoolAddress,
  developerAbi,
  developerAddress,
  developerPoolAddress,
  inspectionAbi,
  inspectionAddress,
  inspectorPoolAddress,
  invitationAbi,
  invitationAddress,
  rcAbi,
  rcAddress,
  regeneratorAbi,
  regeneratorAddress,
  regeneratorPoolAbi,
  regeneratorPoolAddress,
  researcherAbi,
  researcherAddress,
  researcherPoolAddress,
  supporterAbi,
  supporterAddress,
  userAbi,
  userAddress,
  validationPoolAddress
} from '../contracts'
import { directBurns, peerToPeerTransfers, sortFeed, toFeedEvent, weiToAmount } from './buildFeed'
import { FeedEvent, RawLog } from './feedTypes'

/** Pool contract → user type it pays (8 = validation pool). */
const POOLS: [string, number][] = [
  [regeneratorPoolAddress, 1],
  [inspectorPoolAddress, 2],
  [researcherPoolAddress, 3],
  [developerPoolAddress, 4],
  [contributorPoolAddress, 5],
  [activistPoolAddress, 6],
  [validationPoolAddress, 8]
]

/** Every contract event the feed shows, newest first. */
export async function fetchFeed(rpcUrl: string): Promise<FeedEvent[]> {
  const client = createPublicClient({ chain: sintrop, transport: http(rpcUrl) })
  const logs = (address: string, abi: unknown, eventName: string): Promise<RawLog[]> =>
    client.getContractEvents({
      address: address as `0x${string}`,
      abi: abi as Abi,
      eventName,
      fromBlock: 0n,
      toBlock: 'latest'
    }) as unknown as Promise<RawLog[]>

  const [
    requested,
    accepted,
    realized,
    enteredPool,
    offsets,
    certified,
    commitments,
    researches,
    reports,
    contributions,
    registered,
    invitations,
    delations,
    transfers,
    ...withdrawals
  ] = await Promise.all([
    logs(inspectionAddress, inspectionAbi, 'InspectionRequested'),
    logs(inspectionAddress, inspectionAbi, 'InspectionAccepted'),
    logs(inspectionAddress, inspectionAbi, 'InspectionRealized'),
    logs(regeneratorAddress, regeneratorAbi, 'RegeneratorEnteredPool'),
    logs(supporterAddress, supporterAbi, 'OffsetMade'),
    logs(rcAddress, rcAbi, 'TokensCertified'),
    logs(supporterAddress, supporterAbi, 'ReductionCommitmentDeclared'),
    logs(researcherAddress, researcherAbi, 'ResearchPublished'),
    logs(developerAddress, developerAbi, 'ReportAdded'),
    logs(contributorAddress, contributorAbi, 'ContributionAdded'),
    logs(userAddress, userAbi, 'UserRegistered'),
    logs(invitationAddress, invitationAbi, 'UserInvited'),
    logs(userAddress, userAbi, 'DelationAdded'),
    logs(rcAddress, rcAbi, 'Transfer'),
    // All pools share the Poolable TokensWithdrawn event.
    ...POOLS.map(([address]) => logs(address, regeneratorPoolAbi, 'TokensWithdrawn'))
  ])

  const contractAddresses = contractsMainnet.map((contract) => contract.address)

  const events: FeedEvent[] = [
    ...requested.map((log) => toFeedEvent('inspectionRequested', log, 'regeneratorAddress')),
    ...accepted.map((log) => toFeedEvent('inspectionAccepted', log, 'inspectorAddress')),
    ...realized.map((log) => toFeedEvent('inspectionRealized', log, 'inspectorAddress')),
    ...enteredPool.map((log) => toFeedEvent('regeneratorEnteredPool', log, 'regeneratorAddress')),
    ...offsets.map((log) =>
      toFeedEvent('offset', log, 'supporterAddress', { amount: weiToAmount(log.args.amountBurned) })
    ),
    ...directBurns(certified, offsets).map((log) =>
      toFeedEvent('treeFunding', log, 'account', { amount: weiToAmount(log.args.amount) })
    ),
    ...commitments.map((log) => toFeedEvent('commitment', log, 'supporterAddress')),
    ...researches.map((log) => toFeedEvent('research', log, 'researcher')),
    ...reports.map((log) => toFeedEvent('report', log, 'developerAddress')),
    ...contributions.map((log) => toFeedEvent('contribution', log, 'contributorAddress')),
    ...registered.map((log) => toFeedEvent('userRegistered', log, 'addr')),
    ...invitations.map((log) => toFeedEvent('invitation', log, 'inviter')),
    ...delations.map((log) => toFeedEvent('delation', log, 'informer')),
    ...peerToPeerTransfers(transfers, contractAddresses, offsets).map((log) =>
      toFeedEvent('transfer', log, 'from', { amount: weiToAmount(log.args.value) })
    ),
    ...withdrawals.flatMap((poolLogs, index) =>
      poolLogs.map((log) =>
        toFeedEvent('withdrawal', log, 'user', { amount: weiToAmount(log.args.amount), poolType: POOLS[index][1] })
      )
    )
  ]

  return sortFeed(events)
}
