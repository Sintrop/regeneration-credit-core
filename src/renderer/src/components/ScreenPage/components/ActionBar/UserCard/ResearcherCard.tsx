import {
  researcherAddress,
  researcherAbi,
  sequoiaResearcherAddress,
  sequoiaResearcherAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { ResearcherProps } from '@renderer/types/researcher'

export function ResearcherCard(): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearcher',
    args: [address]
  })

  const researcher = data as ResearcherProps

  return (
    <BasicData
      address={address ? address : ''}
      name={researcher ? researcher?.name : ''}
      photoHash={researcher ? researcher?.proofPhoto : ''}
    />
  )
}
