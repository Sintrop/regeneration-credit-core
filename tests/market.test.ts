import { describe, expect, it } from 'vitest'

import { formatOfferPrice, toMarketOffer } from '@renderer/services/market/marketService'

describe('formatOfferPrice', () => {
  it('reads plain numbers as BRL and keeps any other text', () => {
    expect(formatOfferPrice('0,15', 'pt-BR')).toBe('R$ 0,15')
    expect(formatOfferPrice('1.2', 'en')).toBe('R$1.20')
    expect(formatOfferPrice('a combinar', 'pt-BR')).toBe('a combinar')
  })
})

describe('toMarketOffer', () => {
  it('keeps the whole-RC amount the contract stores', () => {
    expect(
      toMarketOffer({
        id: 2n,
        seller: '0xS',
        amountRC: 1000n,
        unitPrice: '0,15',
        paymentMethod: 'PIX',
        active: true
      })
    ).toMatchObject({
      id: 2,
      amount: 1000,
      active: true
    })
  })
})
