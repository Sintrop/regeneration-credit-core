import { Loading } from '@renderer/components/Loading/Loading'
import { regeneratorAbi, regeneratorAddress } from '@renderer/services/contracts'
import { useReadContract } from 'wagmi'
import { BasicDataApprovedUser } from './BasicDataApprovedUser'
import { RegeneratorProps } from '@renderer/types/regenerator'

interface Props {
  address: string
}

export function ApprovedRegenerator({ address }: Props): JSX.Element {
  const { data, isLoading } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'getRegenerator',
    args: [address]
  })

  const regenerator = data as RegeneratorProps

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <Loading size={50} />
      </div>
    )
  }

  if (regenerator) {
    return (
      <BasicDataApprovedUser
        address={address}
        name={regenerator.name}
        proofPhoto={regenerator.proofPhoto}
        userType={1}
      />
    )
  }

  return <div />
}
