import { useChainId, useReadContract } from 'wagmi'
import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ActivistProps } from '@renderer/types/activist'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteUser } from '@renderer/components/Votes/VoteUser'

interface Props {
  id: number
}

export function ActivistItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'activistsAddress',
    args: [id]
  })

  const userActivistAddress = data as string

  const { data: activistResponse } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'getActivist',
    args: [userActivistAddress]
  })

  const activist = activistResponse as ActivistProps

  function handleShowVote(): void {
    setShowVote(true)
  }

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">{activist && <UserAddressLink address={activist?.activistWallet} />}</td>
      <td className="p-2">{activist && activist?.name}</td>
      <td className="p-2">{activist && formatUnits(BigInt(activist?.createdAt), 0)}</td>
      <td className="p-2">{activist && formatUnits(BigInt(activist?.pool?.level), 0)}</td>
      <td className="p-2">{activist && formatUnits(BigInt(activist?.pool?.currentEra), 0)}</td>
      <td className="p-2 flex items-center gap-5">
        <button className="hover:cursor-pointer" onClick={handleShowVote}>
          <BiSolidMegaphone color="white" />
        </button>
      </td>

      {showVote && (
        <VoteUser userWallet={activist.activistWallet} close={() => setShowVote(false)} />
      )}
    </tr>
  )
}
