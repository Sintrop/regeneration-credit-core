import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress,
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useChainId, useReadContract } from 'wagmi'
import { ApprovedInspector } from './ApprovedInspector'
import { Loading } from '@renderer/components/Loading/Loading'
import { ApprovedRegenerator } from './ApprovedRegenerator'
import { ApprovedActivist } from './ApprovedActivist'

interface Props {
  address: string
  position: number
}

export function ApprovedItem({ address, position }: Props): JSX.Element {
  const chainId = useChainId()

  const { data: userApproved, isLoading: loadingUserApproved } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'activistApprovedUsers',
    args: [address, position]
  })

  const { data: responseUserType, isLoading: loadingUserType } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
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

  return <div/>
}
