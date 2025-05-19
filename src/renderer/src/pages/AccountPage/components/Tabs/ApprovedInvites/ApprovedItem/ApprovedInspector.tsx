import { Loading } from '@renderer/components/Loading/Loading'
import {
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { BasicDataApprovedUser } from './BasicDataApprovedUser'
import { InspectorProps } from '@renderer/types/inspector'

interface Props {
  address: string
}

export function ApprovedInspector({ address }: Props): JSX.Element {
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [address]
  })

  const inspector = data as InspectorProps

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <Loading size={50} />
      </div>
    )
  }

  if (inspector) {
    return (
      <BasicDataApprovedUser
        address={address}
        name={inspector.name}
        proofPhoto={inspector.proofPhoto}
        userType={2}
      />
    )
  }

  return <div />
}
