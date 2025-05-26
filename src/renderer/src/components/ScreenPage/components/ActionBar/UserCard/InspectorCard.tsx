import {
  inspectorAddress,
  inspectorAbi,
  sequoiaInspectorAddress,
  sequoiaInspectorAbi
} from '@renderer/services/contracts'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { InspectorProps } from '@renderer/types/inspector'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function InspectorCard(): JSX.Element {
  const { setEraPool } = useUserContext()
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
    setEraPool(parseInt(formatUnits(BigInt(inspector.pool.currentEra), 0)))
  }

  return (
    <BasicData
      address={address ? address : ''}
      name={inspector ? inspector?.name : ''}
      photoHash={inspector ? inspector?.proofPhoto : ''}
      userTypeName="inspector"
      indicator={inspector ? parseInt(formatUnits(BigInt(inspector.pool.level), 0)) : 0}
    />
  )
}
