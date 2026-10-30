import { activistAbi, activistAddress, userAbi, userAddress } from '@renderer/services/contracts'
import { useReadContract } from 'wagmi'
import { ApprovedInspector } from './ApprovedInspector'
import { Loading } from '@renderer/components/Loading/Loading'
import { ApprovedRegenerator } from './ApprovedRegenerator'
import { ApprovedActivist } from './ApprovedActivist'

interface Props {
  address: string
  position: number
}

export function ApprovedItem({ address, position }: Props): JSX.Element {
  const { data: userApproved, isLoading: loadingUserApproved } = useReadContract({
    address: activistAddress,
    abi: activistAbi,
    functionName: 'activistApprovedUsers',
    args: [address, position]
  })

  const { data: responseUserType, isLoading: loadingUserType } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [userApproved]
  })

  if (loadingUserApproved || loadingUserType) {
    return (
      <div className="flex flex-col w-full p-3 rounded-2xl bg-green-card">
        <Loading size={50} />
      </div>
    )
  }

  if (responseUserType) {
    return (
      <div className="flex flex-col w-full p-3 rounded-2xl bg-green-card">
        {responseUserType === 1 && (
          <ApprovedRegenerator address={userApproved ? (userApproved as string) : ''} />
        )}

        {responseUserType === 2 && (
          <ApprovedInspector address={userApproved ? (userApproved as string) : ''} />
        )}

        {responseUserType === 6 && (
          <ApprovedActivist address={userApproved ? (userApproved as string) : ''} />
        )}
      </div>
    )
  }

  return <div />
}
