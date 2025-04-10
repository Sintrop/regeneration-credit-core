import { useAccount, useChainId, useReadContract } from 'wagmi'
import { RegeneratorActions } from './RegeneratorActions'
import {
  sequoiaUserAbi,
  sequoiaUserAddress,
  userAbi,
  userAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectorActions } from './InspectorActions'
import { ResearcherActions } from './ResearcherActions'
import { DeveloperActions } from './DeveloperActions'

export function UserTypeActions(): JSX.Element {
  const chainId = useChainId()
  const { isDisconnected, address } = useAccount()
  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  if (isDisconnected) return <div />

  let userType = 0

  if (data) {
    userType = parseInt(formatUnits(BigInt(data as string), 0))
  }

  if (userType === 0) return <div />

  const Actions = userTypeActions[userType]

  return <Actions />
}

const userTypeActions = {
  1: RegeneratorActions,
  2: InspectorActions,
  3: ResearcherActions,
  4: DeveloperActions
}
