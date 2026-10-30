import { Loading } from '@renderer/components/Loading/Loading'
import { activistAbi, activistAddress } from '@renderer/services/contracts'
import { useReadContract } from 'wagmi'
import { BasicDataApprovedUser } from './BasicDataApprovedUser'
import { ActivistProps } from '@renderer/types/activist'

interface Props {
  address: string
}

export function ApprovedActivist({ address }: Props): JSX.Element {
  const { data, isLoading } = useReadContract({
    address: activistAddress,
    abi: activistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <Loading size={50} />
      </div>
    )
  }

  if (activist) {
    return (
      <BasicDataApprovedUser
        address={address}
        name={activist.name}
        proofPhoto={activist.proofPhoto}
        userType={6}
      />
    )
  }

  return <div />
}
