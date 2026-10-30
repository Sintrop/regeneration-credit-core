export type FeedKind =
  | 'inspectionRequested'
  | 'inspectionAccepted'
  | 'inspectionRealized'
  | 'regeneratorEnteredPool'
  | 'offset'
  | 'treeFunding'
  | 'commitment'
  | 'research'
  | 'report'
  | 'contribution'
  | 'userRegistered'
  | 'invitation'
  | 'delation'
  | 'withdrawal'
  | 'transfer'

export type FeedCategory = 'inspections' | 'offsets' | 'publications' | 'community' | 'tokens'

export const FEED_CATEGORIES: FeedCategory[] = [
  'inspections',
  'offsets',
  'publications',
  'community',
  'tokens'
]

export const CATEGORY_BY_KIND: Record<FeedKind, FeedCategory> = {
  inspectionRequested: 'inspections',
  inspectionAccepted: 'inspections',
  inspectionRealized: 'inspections',
  regeneratorEnteredPool: 'inspections',
  offset: 'offsets',
  treeFunding: 'offsets',
  commitment: 'offsets',
  research: 'publications',
  report: 'publications',
  contribution: 'publications',
  userRegistered: 'community',
  invitation: 'community',
  delation: 'community',
  withdrawal: 'tokens',
  transfer: 'tokens'
}

/** One contract event, normalized. Values are plain numbers/strings so they render and cache easily. */
export interface FeedEvent {
  key: string
  kind: FeedKind
  blockNumber: number
  logIndex: number
  transactionHash: string
  /** Who did it: the address shown in the card header. */
  actor: string
  data: Record<string, string | number>
}

/** A raw log as returned by viem getContractEvents. */
export interface RawLog {
  args: Record<string, unknown>
  blockNumber: bigint | null
  logIndex: number | null
  transactionHash: string | null
}
