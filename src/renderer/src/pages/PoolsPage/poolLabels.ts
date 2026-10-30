import { VALIDATION_POOL } from '@renderer/services/pools/poolService'

export const POOL_NAME_KEY: Record<number, string> = {
  1: 'poolsScreen.regeneratorsPool',
  2: 'poolsScreen.inspectorsPool',
  3: 'poolsScreen.researchersPool',
  4: 'poolsScreen.developersPool',
  5: 'poolsScreen.contributorsPool',
  6: 'poolsScreen.activistsPool',
  [VALIDATION_POOL]: 'poolsScreen.validationPool'
}

export const POOL_DESCRIPTION_KEY: Record<number, string> = {
  1: 'poolsScreen.descRegeneratorPool',
  2: 'poolsScreen.descInspectorsPool',
  3: 'poolsScreen.descResearchersPool',
  4: 'poolsScreen.descDevelopersPool',
  5: 'poolsScreen.descContributorsPool',
  6: 'poolsScreen.descActivistsPool',
  [VALIDATION_POOL]: 'pools.descValidationPool'
}

/** Route segment of each pool, as /pools/:poolName. */
export const POOL_SLUG: Record<number, string> = {
  1: 'regenerator',
  2: 'inspector',
  3: 'researcher',
  4: 'developer',
  5: 'contributor',
  6: 'activist',
  [VALIDATION_POOL]: 'validation'
}
