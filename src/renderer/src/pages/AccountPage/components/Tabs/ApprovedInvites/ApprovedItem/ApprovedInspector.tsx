import { Loading } from '@renderer/components/Loading/Loading'
import { inspectorAbi, inspectorAddress } from '@renderer/services/contracts'
import { useReadContract } from 'wagmi'
import { BasicDataApprovedUser } from './BasicDataApprovedUser'
import { InspectorProps } from '@renderer/types/inspector'

interface Props {
  address: string
}

export function ApprovedInspector({ address }: Props): JSX.Element {
  const { data, isLoading } = useReadContract({
    address: inspectorAddress,
    abi: inspectorAbi,
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
