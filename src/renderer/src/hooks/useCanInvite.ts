import {
  invitationAbi,
  invitationAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useBlockNumber, useReadContract } from 'wagmi'

interface ReturnUseCanInvite {
  canInvite: boolean
  canInviteThisUserType: boolean
  canInviteIn: number
  isLoading: boolean
}
interface Props {
  userTypeToInvite?: number
}

export function useCanInvite({ userTypeToInvite }: Props): ReturnUseCanInvite {
  const { address } = useAccount()
  const { data: responseUser } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [address]
  })
  const userType = responseUser ? parseInt(formatUnits(BigInt(responseUser as string), 0)) : 0

  const { data: responseLastInvite } = useReadContract({
    address: invitationAddress,
    abi: invitationAbi,
    functionName: 'lastInviteBlocks',
    args: [address]
  })
  const lastInviteBlock = responseLastInvite
    ? parseInt(formatUnits(BigInt(responseLastInvite as string), 0))
    : 0

  const { data: responseBlock } = useBlockNumber()
  const blockNumber = responseBlock ? parseInt(formatUnits(BigInt(responseBlock), 0)) : 0

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [canInvite, setCanInvite] = useState<boolean>(false)
  const [canInviteThisUserType, setCanInviteThisUserType] = useState<boolean>(false)
  const [canInviteIn, setCanInviteIn] = useState<number>(0)

  useEffect(() => {
    checkCanInvite()

    if (userType === 0 || blockNumber === 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [userType, blockNumber, lastInviteBlock, userTypeToInvite])

  function checkCanInvite(): void {
    const timeBetweenInvite = parseInt(import.meta.env.VITE_INVITATION_DELAY_BLOCKS)
    const canInviteBlock = lastInviteBlock + timeBetweenInvite

    const userTypesAvailableToInvite = userTypeICanInvite[userType as UserTypeICanInviteType]
    const userTypeToInviteFinded = userTypesAvailableToInvite.find(
      (item) => item === userTypeToInvite
    )

    if (userTypeToInviteFinded) {
      setCanInviteThisUserType(true)
    } else {
      setCanInviteThisUserType(false)
    }

    if (blockNumber > canInviteBlock) {
      setCanInvite(true)
    } else {
      setCanInvite(false)
      setCanInviteIn(canInviteBlock - blockNumber)
    }
  }

  return {
    canInvite,
    canInviteIn,
    canInviteThisUserType,
    isLoading
  }
}

const userTypeICanInvite = {
  0: [],
  1: [],
  2: [],
  3: [3],
  4: [4],
  5: [5],
  6: [1, 2, 6],
  7: [7]
}
type UserTypeICanInviteType = keyof typeof userTypeICanInvite
