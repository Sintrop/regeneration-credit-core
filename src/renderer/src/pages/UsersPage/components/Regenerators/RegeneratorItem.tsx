import { useChainId, useReadContract } from 'wagmi'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { RegeneratorProps } from '@renderer/types/regenerator'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { useState } from 'react'
import { BiSolidMegaphone } from 'react-icons/bi'
import { VoteUser } from '@renderer/components/Votes/VoteUser'

interface Props {
  id: number
}

export function RegeneratorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const [showVote, setShowVote] = useState(false)
  const { data } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'regeneratorsAddress',
    args: [id]
  })

  const userRegeneratorAddress = data as string

  const { data: regeneratorResponse } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getRegenerator',
    args: [userRegeneratorAddress]
  })

  const regenerator = regeneratorResponse as RegeneratorProps

  function handleShowVote(): void {
    setShowVote(true)
  }

  if (!regenerator) return <div />

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2 max-w-[100px]">
        {<UserAddressLink address={regenerator?.regeneratorWallet} />}
      </td>
      <td className="p-2">{regenerator?.name}</td>
      <td className="p-2">{formatUnits(BigInt(regenerator?.createdAt), 0)}</td>
      <td className="p-2">
        {Intl.NumberFormat('pt-BR').format(
          parseInt(formatUnits(BigInt(regenerator?.totalArea), 0))
        )}
      </td>
      <td className="p-2">{formatUnits(BigInt(regenerator?.totalInspections), 0)}</td>
      <td className="p-2">{formatUnits(BigInt(regenerator?.regenerationScore?.score), 0)}</td>
      <td className="p-2 flex items-center gap-5">
        <button className="hover:cursor-pointer" onClick={handleShowVote}>
          <BiSolidMegaphone color="white" />
        </button>
      </td>

      {showVote && (
        <VoteUser userWallet={regenerator.regeneratorWallet} close={() => setShowVote(false)} />
      )}
    </tr>
  )
}
