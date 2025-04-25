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

interface Props {
  id: number
}

export function RegeneratorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
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

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {regenerator && <UserAddressLink address={regenerator?.regeneratorWallet} />}
      </td>
      <td className="p-2">{regenerator && regenerator?.name}</td>
      <td className="p-2">{regenerator && formatUnits(BigInt(regenerator?.createdAt), 0)}</td>
      <td className="p-2">
        {regenerator && formatUnits(BigInt(regenerator?.totalInspections), 0)}
      </td>
      <td className="p-2">
        {regenerator && formatUnits(BigInt(regenerator?.regenerationScore?.score), 0)}
      </td>
      <td className="p-2"></td>
    </tr>
  )
}
