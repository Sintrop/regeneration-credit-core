import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { UserCard } from './UserCard/UserCard'
import { userAddress, userAbi } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { Actions } from './Actions/Actions'
import { useIsDenied } from '@renderer/domain/Community/useCases/useIsDenied'

export function ActionBar(): JSX.Element | null {
  const { isConnected } = useAccount()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(isConnected)
  }, [isConnected])

  return open ? (
    <div className="flex items-center fixed bottom-0 left-[248px] right-0 h-28 px-6 bg-green-header border-t border-card-primary z-30">
      <YouAreConnected />
    </div>
  ) : null
}

function YouAreConnected(): JSX.Element {
  const { address } = useAccount()
  const [lastPublishedWork, setLastPublishedWork] = useState(0)
  const { isDenied } = useIsDenied({ address: address ?? '' })

  const { data } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userType = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  return (
    <div className="w-full h-full flex items-center justify-between">
      <UserCard userType={userType} setLastPublishedWork={setLastPublishedWork} />

      {userType !== 0 && (
        <>{!isDenied && <Actions userType={userType} lastPublishedWork={lastPublishedWork} />}</>
      )}
    </div>
  )
}
