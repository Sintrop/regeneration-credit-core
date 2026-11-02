/* eslint-disable @typescript-eslint/no-explicit-any -- web3 contract method results are untyped */
import Web3 from 'web3'

import * as C from '../contracts'

/**
 * RCMarket is a bulletin board: offers state an amount of whole RC and a free-text price,
 * payment happens off chain and the seller records the sale with confirmSale.
 */
export interface MarketOffer {
  id: number
  seller: string
  amount: number
  unitPrice: string
  paymentMethod: string
  description: string
  active: boolean
  buyer: string
  createdAt: number
  completedAt: number
}

export function toMarketOffer(raw: any): MarketOffer {
  return {
    id: Number(raw.id),
    seller: String(raw.seller),
    amount: Number(raw.amountRC),
    unitPrice: String(raw.unitPrice ?? ''),
    paymentMethod: String(raw.paymentMethod ?? ''),
    description: String(raw.description ?? ''),
    active: !!raw.active,
    buyer: String(raw.buyer ?? ''),
    createdAt: Number(raw.createdAt ?? 0),
    completedAt: Number(raw.completedAt ?? 0)
  }
}

/** Every offer, newest first. */
export async function getMarketOffers(rpc: string): Promise<MarketOffer[]> {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  const market = new web3.eth.Contract(C.rcMarketAbi as any, C.rcMarketAddress) as any
  const count = Number(await market.methods.getOffersCount().call())
  const ids = Array.from({ length: count }, (_, index) => count - index)
  const offers = await Promise.all(ids.map((id) => market.methods.getOffer(id).call()))
  return offers.map(toMarketOffer)
}

/** Free-text price: a plain number reads as BRL in the user's language, anything else as written. */
export function formatOfferPrice(unitPrice: string, locale: string): string {
  const raw = unitPrice.trim()
  const numeric = raw.replace(/^R\$\s*/i, '').replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(numeric)) return raw
  const value = Number(numeric)
  if (!Number.isFinite(value) || value > 1_000_000) return raw
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value)
}
