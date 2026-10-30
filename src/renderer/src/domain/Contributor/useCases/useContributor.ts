import { useReadContract } from 'wagmi'
import { contributorAbi, contributorAddress } from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { ContributorContractProps, ContributorProps } from '@renderer/types/contributor'

interface ReturnUseContributor {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  contributor: ContributorProps
}
interface Props {
  address: string
}
export function useContributor({ address }: Props): ReturnUseContributor {
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: contributorAddress,
    abi: contributorAbi,
    functionName: 'getContributor',
    args: [address]
  })

  const data = response as ContributorContractProps

  const contributor: ContributorProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    name: data ? data.name : '',
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      level: data ? bigNumberToFloat(data.pool.level) : 0
    },
    proofPhoto: data ? data.proofPhoto : '',
    contributorWallet: data ? data.contributorWallet : '',
    lastPublishedAt: data ? bigNumberToFloat(data.lastPublishedAt) : 0
  }

  return {
    contributor,
    isLoading,
    isError,
    refetch
  }
}
