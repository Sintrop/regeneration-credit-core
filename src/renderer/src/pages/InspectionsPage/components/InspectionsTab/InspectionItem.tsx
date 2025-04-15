import { useChainId, useReadContract } from 'wagmi'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectionProps } from '@renderer/types/inspection'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'

interface Props {
  id: number
}

export function InspectionItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? inspectionAddress : sequoiaInspectionAddress,
    abi: chainId === 250225 ? inspectionAbi : sequoiaInspectionAbi,
    functionName: 'getInspection',
    args: [id]
  })

  const inspection = data as InspectionProps

  return (
    <tr className="border-b border-container-primary text-white">
      <td className="p-2">{id}</td>
      <td className="p-2">{inspection && <UserAddressLink address={inspection?.regenerator} />}</td>
      <td className="p-2">{inspection && <UserAddressLink address={inspection?.inspector} />}</td>
      <td className="p-2">{inspection && formatUnits(BigInt(inspection?.status), 0)}</td>
      <td className="p-2">{inspection && formatUnits(BigInt(inspection?.regenerationScore), 0)}</td>
      <td className="p-2"></td>
    </tr>
  )
}
