import { useQuery } from '@tanstack/react-query'
import { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { rcMarketAbi, rcMarketAddress } from '@renderer/services/contracts'
import { getMarketOffers, MarketOffer } from '@renderer/services/market/marketService'

export function useMarketOffers(): {
  offers: MarketOffer[]
  isLoading: boolean
  refetch: () => void
} {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['marketOffers', rpcUrl],
    queryFn: () => getMarketOffers(rpcUrl),
    enabled: !!rpcUrl
  })
  return { offers: data ?? [], isLoading, refetch }
}

/** RCMarket MAX_*_LENGTH, in bytes. */
export function useMarketLimits(): { description: number; paymentMethod: number; price: number } {
  const market = { address: rcMarketAddress as `0x${string}`, abi: rcMarketAbi as Abi }
  const { data } = useReadContracts({
    contracts: [
      { ...market, functionName: 'MAX_DESCRIPTION_LENGTH' },
      { ...market, functionName: 'MAX_PAYMENT_METHOD_LENGTH' },
      { ...market, functionName: 'MAX_PRICE_LENGTH' }
    ]
  })
  const read = (index: number, fallback: number): number =>
    Number(data?.[index]?.result ?? fallback)
  return { description: read(0, 500), paymentMethod: read(1, 200), price: read(2, 50) }
}
