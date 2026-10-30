/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

export type PublishedResourceType = 'research' | 'contribution' | 'report'

export interface PublishedResource {
  type: PublishedResourceType
  id: number
  title: string
  body: string
  author: string
  era: number
  file: string
  createdAtBlock: number
  validationsCount: number
}

/** Segment ResourceDetailsPage uses for each type. */
export const DETAILS_SEGMENT: Record<PublishedResourceType, string> = {
  research: 'researche',
  contribution: 'contribution',
  report: 'report'
}

const SOURCES: Record<
  PublishedResourceType,
  { abi: unknown; address: string; count: string; getter: string }
> = {
  research: {
    abi: C.researcherAbi,
    address: C.researcherAddress,
    count: 'researchesTotalCount',
    getter: 'getResearch'
  },
  contribution: {
    abi: C.contributorAbi,
    address: C.contributorAddress,
    count: 'contributionsTotalCount',
    getter: 'getContribution'
  },
  report: {
    abi: C.developerAbi,
    address: C.developerAddress,
    count: 'reportsTotalCount',
    getter: 'getReport'
  }
}

const num = (value: unknown): number => Number(value ?? 0)

/** Maps each contract's struct to one shape; field names differ per contract. */
export function toPublishedResource(type: PublishedResourceType, raw: any): PublishedResource {
  return {
    type,
    id: num(raw.id),
    title: type === 'research' ? (raw.title ?? '') : '',
    body: (type === 'research' ? raw.thesis : raw.description) ?? '',
    author: { research: raw.createdBy, contribution: raw.user, report: raw.developer }[type] ?? '',
    era: num(raw.era),
    file: (type === 'research' ? raw.file : raw.report) ?? '',
    createdAtBlock: num(type === 'research' ? raw.createdAtBlock : raw.createdAtBlockNumber),
    validationsCount: num(raw.validationsCount)
  }
}

async function getType(web3: Web3, type: PublishedResourceType): Promise<PublishedResource[]> {
  const source = SOURCES[type]
  const contract = new web3.eth.Contract(source.abi as any, source.address) as any
  const count = num(await contract.methods[source.count]().call())
  const ids = Array.from({ length: count }, (_, index) => index + 1)
  const items = await Promise.all(ids.map((id) => contract.methods[source.getter](id).call()))
  return items.filter((item) => item?.valid).map((item) => toPublishedResource(type, item))
}

/** Valid researches, contributions and development reports, newest first. */
export async function getPublishedResources(rpc: string): Promise<PublishedResource[]> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const groups = await Promise.all(
    (Object.keys(SOURCES) as PublishedResourceType[]).map((type) => getType(web3, type))
  )
  return groups.flat().sort((a, b) => b.createdAtBlock - a.createdAtBlock)
}

/** Votes needed to invalidate and the era each resource contract is in. */
export async function getVotingContext(
  rpc: string
): Promise<{ votesNeeded: number; currentEra: Record<PublishedResourceType, number> }> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const at = (abi: unknown, address: string): any => new web3.eth.Contract(abi as any, address)
  const [votesNeeded, research, contribution, report] = await Promise.all([
    at(C.validationAbi, C.validationAddress).methods.votesToInvalidate().call(),
    at(C.researcherAbi, C.researcherAddress).methods.poolCurrentEra().call(),
    at(C.contributorAbi, C.contributorAddress).methods.poolCurrentEra().call(),
    at(C.developerAbi, C.developerAddress).methods.poolCurrentEra().call()
  ])
  return {
    votesNeeded: num(votesNeeded),
    currentEra: { research: num(research), contribution: num(contribution), report: num(report) }
  }
}
