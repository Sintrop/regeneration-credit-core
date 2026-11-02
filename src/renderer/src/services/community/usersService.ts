/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

export type MetricKey =
  | 'score'
  | 'area'
  | 'inspections'
  | 'giveUps'
  | 'researches'
  | 'calculatorItems'
  | 'reports'
  | 'contributions'
  | 'offsets'
  | 'reductionItems'
  | 'level'

export interface CommunityUser {
  id: number
  address: string
  name: string
  photo: string
  createdAt: number
  metrics: Partial<Record<MetricKey, number>>
}

interface TypeSource {
  abi: unknown
  address: string
  list: string
  getter: string
  wallet: string
  /** Columns of the table, in order; each reads one field of the user struct. */
  metrics: [MetricKey, (raw: any) => unknown][]
}

const level = (raw: any): unknown => raw.pool?.level

export const USER_SOURCES: Record<number, TypeSource> = {
  1: {
    abi: C.regeneratorAbi,
    address: C.regeneratorAddress,
    list: 'regeneratorsAddress',
    getter: 'getRegenerator',
    wallet: 'regeneratorWallet',
    metrics: [
      ['score', (r): unknown => r.regenerationScore?.score],
      ['area', (r): unknown => r.totalArea],
      ['inspections', (r): unknown => r.totalInspections]
    ]
  },
  2: {
    abi: C.inspectorAbi,
    address: C.inspectorAddress,
    list: 'inspectorsAddress',
    getter: 'getInspector',
    wallet: 'inspectorWallet',
    metrics: [
      ['inspections', (r): unknown => r.totalInspections],
      ['giveUps', (r): unknown => r.giveUps],
      ['level', level]
    ]
  },
  3: {
    abi: C.researcherAbi,
    address: C.researcherAddress,
    list: 'researchersAddress',
    getter: 'getResearcher',
    wallet: 'researcherWallet',
    metrics: [
      ['researches', (r): unknown => r.publishedResearches],
      ['calculatorItems', (r): unknown => r.publishedItems],
      ['level', level]
    ]
  },
  4: {
    abi: C.developerAbi,
    address: C.developerAddress,
    list: 'developersAddress',
    getter: 'getDeveloper',
    wallet: 'developerWallet',
    metrics: [
      ['reports', (r): unknown => r.totalReports],
      ['level', level]
    ]
  },
  5: {
    abi: C.contributorAbi,
    address: C.contributorAddress,
    list: 'contributorsAddress',
    getter: 'getContributor',
    wallet: 'contributorWallet',
    metrics: [
      ['contributions', (r): unknown => r.totalContributions],
      ['level', level]
    ]
  },
  6: {
    abi: C.activistAbi,
    address: C.activistAddress,
    list: 'activistsAddress',
    getter: 'getActivist',
    wallet: 'activistWallet',
    metrics: [['level', level]]
  },
  7: {
    abi: C.supporterAbi,
    address: C.supporterAddress,
    list: 'supportersAddress',
    getter: 'getSupporter',
    wallet: 'supporterWallet',
    metrics: [
      ['offsets', (r): unknown => r.offsetsCount],
      ['reductionItems', (r): unknown => r.reductionItemsCount]
    ]
  }
}

export function toCommunityUser(
  userType: number,
  raw: any,
  fallbackAddress: string
): CommunityUser {
  const source = USER_SOURCES[userType]
  return {
    id: Number(raw.id ?? 0),
    address: String(raw[source.wallet] ?? fallbackAddress),
    name: String(raw.name ?? ''),
    photo: String((userType === 7 ? raw.profilePhoto : raw.proofPhoto) ?? ''),
    createdAt: Number(raw.createdAt ?? 0),
    metrics: Object.fromEntries(source.metrics.map(([key, read]) => [key, Number(read(raw) ?? 0)]))
  }
}

/** Every user ever registered as `userType` (CommunityRules.userTypesTotalCount), newest first. */
export async function getUsersOfType(rpc: string, userType: number): Promise<CommunityUser[]> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const source = USER_SOURCES[userType]
  const community = new web3.eth.Contract(C.userAbi as any, C.userAddress) as any
  const rules = new web3.eth.Contract(source.abi as any, source.address) as any
  const total = Number(await community.methods.userTypesTotalCount(userType).call())
  const ids = Array.from({ length: total }, (_, index) => total - index)
  const addresses: string[] = await Promise.all(
    ids.map((id) => rules.methods[source.list](id).call())
  )
  const records = await Promise.all(
    addresses.map((address) => rules.methods[source.getter](address).call())
  )
  return records.map((raw, index) => toCommunityUser(userType, raw, addresses[index]))
}
