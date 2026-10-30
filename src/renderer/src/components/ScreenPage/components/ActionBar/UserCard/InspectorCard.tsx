import { inspectorAddress, inspectorAbi } from '@renderer/services/contracts'
import { useAccount, useReadContract } from 'wagmi'
import { BasicData } from './BasicData'
import { InspectorProps } from '@renderer/types/inspector'
import { formatUnits } from 'viem'
import { useUserContext } from '@renderer/hooks/useUserContext'

export function InspectorCard(): JSX.Element {
  const { setEraPool } = useUserContext()
  const { address } = useAccount()

  const { data } = useReadContract({
    address: inspectorAddress,
    abi: inspectorAbi,
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
