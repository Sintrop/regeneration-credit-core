import { Loading } from '@renderer/components/Loading/Loading'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { BasicDataApprovedUser } from './BasicDataApprovedUser'
import { RegeneratorProps } from '@renderer/types/regenerator'

interface Props {
  address: string
}

export function ApprovedRegenerator({ address }: Props): JSX.Element {
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
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
