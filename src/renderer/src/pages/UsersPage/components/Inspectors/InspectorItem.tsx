import { useChainId, useReadContract } from 'wagmi'
import {
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectorProps } from '@renderer/types/inspector'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function InspectorItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'inspectorsAddress',
    args: [id]
  })

  const userInspectorAddress = data as string

  const { data: inspectorResponse } = useReadContract({
    address: chainId === 250225 ? inspectorAddress : sequoiaInspectorAddress,
    abi: chainId === 250225 ? inspectorAbi : sequoiaInspectorAbi,
    functionName: 'getInspector',
    args: [userInspectorAddress]
  })

  const inspector = inspectorResponse as InspectorProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">
        {inspector && <UserAddressLink address={inspector?.inspectorWallet} />}
      </td>
      <td className="p-2">{inspector && inspector?.name}</td>
      <td className="p-2">{inspector && formatUnits(BigInt(inspector?.createdAt), 0)}</td>
      <td className="p-2">{inspector && formatUnits(BigInt(inspector?.totalInspections), 0)}</td>
      <td className="p-2">{inspector && formatUnits(BigInt(inspector?.pool?.level), 0)}</td>
      <td className="p-2"></td>
    </tr>
  )
}
