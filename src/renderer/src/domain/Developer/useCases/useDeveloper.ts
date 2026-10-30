import { useReadContract } from 'wagmi'
import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { DeveloperContractProps, DeveloperProps } from '@renderer/types/developer'

interface ReturnUseDeveloper {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  developer: DeveloperProps
}
interface Props {
  address: string
}
export function useDeveloper({ address }: Props): ReturnUseDeveloper {
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'getDeveloper',
    args: [address]
  })

  const data = response as DeveloperContractProps

  const developer: DeveloperProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    lastPublishedAt: data ? bigNumberToFloat(data.lastPublishedAt) : 0,
    name: data ? data.name : '',
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      level: data ? bigNumberToFloat(data.pool.level) : 0
    },
    proofPhoto: data ? data.proofPhoto : '',
    developerWallet: data ? data.developerWallet : '',
    totalReports: data ? bigNumberToFloat(data.totalReports) : 0
  }

  return {
    developer,
    isLoading,
    isError,
    refetch
  }
}
