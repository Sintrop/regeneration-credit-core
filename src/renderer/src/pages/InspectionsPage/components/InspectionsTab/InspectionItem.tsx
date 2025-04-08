import { useChainId, useReadContract } from 'wagmi'
import {
  inspectionAbi,
  inspectionAddress,
  sequoiaInspectionAbi,
  sequoiaInspectionAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectionProps } from '@renderer/types/inspection'

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
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{inspection && inspection?.regenerator}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{inspection && inspection?.inspector}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{inspection && formatUnits(BigInt(inspection?.status), 0)}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5 overflow-hidden">
        <p className="text-white">
          {inspection && formatUnits(BigInt(inspection?.regenerationScore), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
