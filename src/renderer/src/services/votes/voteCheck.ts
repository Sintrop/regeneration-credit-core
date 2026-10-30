import { Abi, BaseError, ContractFunctionRevertedError, createPublicClient, http } from 'viem'

import { sintrop } from '../../../../chains/sintrop'
import * as C from '../contracts'

export type VoteKind = 'user' | 'research' | 'contribution' | 'report' | 'inspection'

/** Contract function each vote calls, as (target, justification). */
export const VOTE_TARGETS: Record<
  VoteKind,
  { address: string; abi: unknown; functionName: string }
> = {
  user: { address: C.validationAddress, abi: C.validationAbi, functionName: 'addUserValidation' },
  research: {
    address: C.researcherAddress,
    abi: C.researcherAbi,
    functionName: 'addResearchValidation'
  },
  contribution: {
    address: C.contributorAddress,
    abi: C.contributorAbi,
    functionName: 'addContributionValidation'
  },
  report: { address: C.developerAddress, abi: C.developerAbi, functionName: 'addReportValidation' },
  inspection: {
    address: C.inspectionAddress,
    abi: C.inspectionAbi,
    functionName: 'addInspectionValidation'
  }
}

export type VoteBlock =
  | 'notVoter'
  | 'voterDenied'
  | 'wait'
  | 'alreadyVoted'
  | 'alreadyInvalidated'
  | 'votingClosed'
  | 'notInspected'
  | 'notFound'
  | 'supporter'
  | 'userDenied'
  | 'immune'
  | 'tooFewVoters'
  | 'unknown'

/** Revert strings of the validation functions (ValidationRules, ResearcherRules, ContributorRules, DeveloperRules, InspectionRules). */
const REVERTS: [string, VoteBlock][] = [
  ['Not a voter', 'notVoter'],
  ['User denied', 'voterDenied'],
  ['Wait timeBetweenVotes', 'wait'],
  ['Already voted', 'alreadyVoted'],
  ['Penalties already applied', 'alreadyInvalidated'],
  ['not VALID', 'votingClosed'],
  ["Can't validade anymore", 'votingClosed'],
  ['Only to inspected inspections', 'notInspected'],
  ['Inspection does not exist', 'notFound'],
  ['User not registered', 'notFound'],
  ['Supporter validation not allowed', 'supporter'],
  ['User already denied', 'userDenied'],
  ['validation immunity', 'immune'],
  ['threshold cannot be less than 2', 'tooFewVoters']
]

export function voteBlockFromRevert(message: string): VoteBlock {
  return REVERTS.find(([text]) => message.includes(text))?.[1] ?? 'unknown'
}

export type VoteCheck = { ok: true } | { ok: false; block: VoteBlock; waitBlocks: number }

/**
 * Asks the contract itself whether the vote would go through, by simulating it with the
 * voter's address: the "already voted" records are private, so only the call can tell.
 */
export async function checkVote(
  rpc: string,
  kind: VoteKind,
  voter: `0x${string}`,
  target: string | number
): Promise<VoteCheck> {
  const client = createPublicClient({ chain: sintrop, transport: http(rpc) })
  const { address, abi, functionName } = VOTE_TARGETS[kind]
  try {
    await client.simulateContract({
      account: voter,
      address: address as `0x${string}`,
      abi: abi as Abi,
      functionName,
      args: [kind === 'user' ? target : BigInt(target), '-']
    })
    return { ok: true }
  } catch (error) {
    const reverted =
      error instanceof BaseError
        ? error.walk((cause) => cause instanceof ContractFunctionRevertedError)
        : undefined
    const reason =
      (reverted as ContractFunctionRevertedError | undefined)?.reason ??
      (error instanceof Error ? error.message : String(error))
    const block = voteBlockFromRevert(reason)
    let waitBlocks = 0
    if (block === 'wait') {
      const [lastVote, timeBetween, current] = await Promise.all([
        client.readContract({
          address: C.validationAddress as `0x${string}`,
          abi: C.validationAbi as Abi,
          functionName: 'validatorLastVoteAt',
          args: [voter]
        }),
        client.readContract({
          address: C.validationAddress as `0x${string}`,
          abi: C.validationAbi as Abi,
          functionName: 'timeBetweenVotes'
        }),
        client.getBlockNumber()
      ])
      // waitedTimeBetweenVotes: block.number > lastVoteAt + timeBetweenVotes
      waitBlocks = Math.max(1, Number(lastVote) + Number(timeBetween) + 1 - Number(current))
    }
    return { ok: false, block, waitBlocks }
  }
}
