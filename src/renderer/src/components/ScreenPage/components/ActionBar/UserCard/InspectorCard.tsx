import {
  inspectorAddress,
  inspectorAbi,
  sequoiaInspectorAddress,
  sequoiaInspectorAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { InspectorProps } from '@renderer/types/inspector'
import { ContentCardProps } from './UserCard'
import { formatUnits } from 'viem'

export function InspectorCard({ changeIndicator }: ContentCardProps): JSX.Element {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })

  const inspector = data as InspectorProps

  if (inspector) {
    changeIndicator(parseInt(formatUnits(BigInt(inspector?.totalInspections), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={inspector ? inspector?.name : ''}
      photoHash={inspector ? inspector?.proofPhoto : ''}
    />
  )
}
