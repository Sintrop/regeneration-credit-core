import { FeedEvent, FeedKind, RawLog } from './feedTypes'

const WEI = 10n ** 18n
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/** RC (or SINTROP) amount in wei as a decimal number with up to 4 decimals, for display. */
export function weiToAmount(value: unknown): number {
  const wei = BigInt(String(value ?? 0))
  return Number(wei / WEI) + Number((wei % WEI) / 10n ** 14n) / 10000
}

function asText(value: unknown): string | number {
  // Ids and block numbers fit in a number; token amounts in wei stay exact as strings.
  if (typeof value === 'bigint') return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : value.toString()
  if (typeof value === 'number') return value
  return String(value ?? '')
}

export function toFeedEvent(kind: FeedKind, log: RawLog, actorField: string, extra: Record<string, string | number> = {}): FeedEvent {
  const data: Record<string, string | number> = {}
  for (const [name, value] of Object.entries(log.args)) data[name] = asText(value)
  return {
    key: `${log.transactionHash}-${log.logIndex}-${kind}`,
    kind,
    blockNumber: Number(log.blockNumber ?? 0),
    logIndex: Number(log.logIndex ?? 0),
    transactionHash: String(log.transactionHash ?? ''),
    actor: String(log.args[actorField] ?? ''),
    data: { ...data, ...extra }
  }
}

/**
 * RegenerationCredit.TokensCertified not emitted with an OffsetMade in the same transaction:
 * direct burns ("fund tree planting"). Offsets burn through the same function.
 */
export function directBurns(certified: RawLog[], offsets: RawLog[]): RawLog[] {
  const offsetTxs = new Set(offsets.map((log) => log.transactionHash))
  return certified.filter((log) => !offsetTxs.has(log.transactionHash))
}

/**
 * RegenerationCredit.Transfer between two people: drops mints and burns, movements to or from
 * protocol contracts (pool rewards) and the inviter commission paid inside SupporterRules.offset.
 */
export function peerToPeerTransfers(transfers: RawLog[], contractAddresses: string[], offsets: RawLog[]): RawLog[] {
  const contracts = new Set([ZERO_ADDRESS, ...contractAddresses].map((address) => address.toLowerCase()))
  const offsetTxs = new Set(offsets.map((log) => log.transactionHash))
  return transfers.filter((log) => {
    const from = String(log.args.from ?? '').toLowerCase()
    const to = String(log.args.to ?? '').toLowerCase()
    return !contracts.has(from) && !contracts.has(to) && !offsetTxs.has(log.transactionHash)
  })
}

/** Newest first; within a block, the later log first. */
export function sortFeed(events: FeedEvent[]): FeedEvent[] {
  return [...events].sort((a, b) => b.blockNumber - a.blockNumber || b.logIndex - a.logIndex)
}
