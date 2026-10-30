import { useQuery } from '@tanstack/react-query'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { getCommissions, getTransfers, TokenTx } from '@renderer/services/myTokens/transfersService'

export function useTokenHistory(
  address: string | undefined,
  source: 'transfers' | 'commissions'
): { txs: TokenTx[]; isLoading: boolean; isError: boolean; refetch: () => void } {
  const { rpcUrl } = useSettingsContext()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tokenHistory', source, rpcUrl, address],
    queryFn: () =>
      source === 'transfers'
        ? getTransfers(rpcUrl, address as string)
        : getCommissions(rpcUrl, address as string),
    enabled: !!rpcUrl && !!address
  })
  return { txs: data ?? [], isLoading: !!address && isLoading, isError, refetch }
}
