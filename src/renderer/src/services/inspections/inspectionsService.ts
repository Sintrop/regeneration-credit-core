/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

export type InspectionStatus = 'open' | 'accepted' | 'realized' | 'invalidated' | 'expired'

export interface InspectionSummary {
  id: number
  /** Raw InspectionStatus enum: 0 open, 1 accepted, 2 inspected, 3 invalidated. */
  rawStatus: number
  regenerator: string
  inspector: string
  treesResult: number
  biodiversityResult: number
  regenerationScore: number
  validationsCount: number
  createdAt: number
  acceptedAt: number
  inspectedAt: number
  inspectedAtEra: number
}

const num = (value: unknown): number => Number(value ?? 0)
const RAW_STATUS: InspectionStatus[] = ['open', 'accepted', 'realized', 'invalidated']

export function toInspectionSummary(raw: any): InspectionSummary {
  return {
    id: num(raw.id),
    rawStatus: num(raw.status),
    regenerator: raw.regenerator ?? '',
    inspector: raw.inspector ?? '',
    treesResult: num(raw.treesResult),
    biodiversityResult: num(raw.biodiversityResult),
    regenerationScore: num(raw.regenerationScore),
    validationsCount: num(raw.validationsCount),
    createdAt: num(raw.createdAt),
    acceptedAt: num(raw.acceptedAt),
    inspectedAt: num(raw.inspectedAt),
    inspectedAtEra: num(raw.inspectedAtEra)
  }
}

/** An accepted inspection past blocksToExpireAcceptedInspection can be accepted again: it is expired. */
export function inspectionStatus(
  inspection: Pick<InspectionSummary, 'rawStatus' | 'acceptedAt'>,
  currentBlock: number,
  blocksToExpire: number
): InspectionStatus {
  if (inspection.rawStatus === 1 && inspection.acceptedAt + blocksToExpire < currentBlock) {
    return 'expired'
  }
  return RAW_STATUS[inspection.rawStatus] ?? 'open'
}

/** Every inspection, newest first. */
export async function getAllInspections(rpc: string): Promise<InspectionSummary[]> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const contract = new web3.eth.Contract(C.inspectionAbi as any, C.inspectionAddress) as any
  const count = num(await contract.methods.inspectionsTotalCount().call())
  const ids = Array.from({ length: count }, (_, index) => count - index)
  const items = await Promise.all(ids.map((id) => contract.methods.getInspection(id).call()))
  return items.map(toInspectionSummary)
}
