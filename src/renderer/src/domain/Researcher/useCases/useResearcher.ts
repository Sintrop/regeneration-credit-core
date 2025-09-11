import { useReadContract } from 'wagmi'
import { useMainnet } from '@renderer/hooks/useMainnet'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'
import { ResearcherContractProps, ResearcherProps } from '@renderer/types/researcher'

interface ReturnUseResearcher {
  isLoading: boolean
  isError: boolean
  refetch: () => void
  researcher: ResearcherProps
}
interface Props {
  address: string
}
export function useResearcher({ address }: Props): ReturnUseResearcher {
  const mainnet = useMainnet()
  const {
    data: response,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: mainnet ? researcherAddress : sequoiaResearcherAddress,
    abi: mainnet ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const data = response as ResearcherContractProps

  const researcher: ResearcherProps = {
    id: data ? bigNumberToFloat(data?.id) : 0,
    createdAt: data ? bigNumberToFloat(data.createdAt) : 0,
    lastPublishedAt: data ? bigNumberToFloat(data.lastPublishedAt) : 0,
    name: data ? data.name : '',
    pool: {
      currentEra: data ? bigNumberToFloat(data.pool.currentEra) : 0,
      level: data ? bigNumberToFloat(data.pool.level) : 0
    },
    proofPhoto: data ? data.proofPhoto : '',
    researcherWallet: data ? data.researcherWallet : '',
    publishedResearches: data ? bigNumberToFloat(data.publishedResearches) : 0,
    lastCalculatorItemAt: data ? bigNumberToFloat(data.lastCalculatorItemAt) : 0
  }

  return {
    researcher,
    isLoading,
    isError,
    refetch
  }
}
