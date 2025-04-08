import { useChainId, useReadContract } from 'wagmi'
import {
  inspectorAbi,
  inspectorAddress,
  sequoiaInspectorAbi,
  sequoiaInspectorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { InspectorProps } from '@renderer/types/inspector'

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
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">
          {inspector && inspector?.inspectorWallet}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{inspector && inspector?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{inspector && formatUnits(BigInt(inspector?.createdAt), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">
          {inspector && formatUnits(BigInt(inspector?.totalInspections), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[100px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {inspector && formatUnits(BigInt(inspector?.pool.level), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
