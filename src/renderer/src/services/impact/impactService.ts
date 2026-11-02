/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

const WEI = 10 ** 18
const num = (value: unknown): number => Number(value ?? 0)

export interface ImpactOverview {
  /** RegenerationCreditImpact totals: grams of CO₂, trees, species, m². */
  total: { carbon: number; trees: number; biodiversity: number; area: number }
  /** Impact of one RC, from the *PerToken views (scaled by 1e18 on chain). */
  perToken: { carbon: number; trees: number; biodiversity: number; area: number }
  supply: { totalSupply: number; totalLocked: number; totalCertified: number }
  settlement: {
    lastSettledEra: number
    realizedInspections: number
    inspectionsTrees: number
    inspectionsBiodiversity: number
    certifiedRegenerators: number
  }
  /** RegenerationCreditImpact.CARBON_PER_TREE, grams credited per counted tree. */
  carbonPerTree: number
}

export async function getImpactOverview(rpc: string): Promise<ImpactOverview> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const impact = new web3.eth.Contract(C.rcImpactAbi as any, C.rcImpactAddress) as any
  const rc = new web3.eth.Contract(C.rcAbi as any, C.rcAddress) as any
  const inspection = new web3.eth.Contract(C.inspectionAbi as any, C.inspectionAddress) as any
  const call = (contract: any, method: string): Promise<unknown> =>
    contract.methods[method]().call()

  const values = await Promise.all([
    call(impact, 'totalCarbonImpact'),
    call(impact, 'totalTreesImpact'),
    call(impact, 'totalBiodiversityImpact'),
    call(impact, 'totalAreaImpact'),
    call(impact, 'carbonPerToken'),
    call(impact, 'treesPerToken'),
    call(impact, 'biodiversityPerToken'),
    call(impact, 'areaPerToken'),
    call(rc, 'totalSupply'),
    call(rc, 'totalLocked'),
    call(rc, 'totalCertified'),
    call(inspection, 'lastSettledEra'),
    call(inspection, 'realizedInspectionsCount'),
    call(inspection, 'inspectionsTreesImpact'),
    call(inspection, 'inspectionsBiodiversityImpact'),
    call(inspection, 'totalImpactRegenerators'),
    call(impact, 'CARBON_PER_TREE')
  ])
  const v = values.map(num)
  return {
    total: { carbon: v[0], trees: v[1], biodiversity: v[2], area: v[3] },
    perToken: { carbon: v[4] / WEI, trees: v[5] / WEI, biodiversity: v[6] / WEI, area: v[7] / WEI },
    supply: { totalSupply: v[8] / WEI, totalLocked: v[9] / WEI, totalCertified: v[10] / WEI },
    settlement: {
      lastSettledEra: v[11],
      realizedInspections: v[12],
      inspectionsTrees: v[13],
      inspectionsBiodiversity: v[14],
      certifiedRegenerators: v[15]
    },
    carbonPerTree: v[16]
  }
}

export interface EraImpact {
  era: number
  trees: number
  biodiversity: number
  realizedInspections: number
}

/** InspectionRules.impactPerEra for every era up to the current one, newest first. */
export async function getImpactEras(rpc: string, currentEra: number): Promise<EraImpact[]> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const inspection = new web3.eth.Contract(C.inspectionAbi as any, C.inspectionAddress) as any
  const eras = Array.from({ length: currentEra }, (_, index) => currentEra - index)
  const results = await Promise.all(eras.map((era) => inspection.methods.impactPerEra(era).call()))
  return results.map((raw: any, index) => ({
    era: eras[index],
    trees: num(raw.trees),
    biodiversity: num(raw.biodiversity),
    realizedInspections: num(raw.realizedInspections)
  }))
}
