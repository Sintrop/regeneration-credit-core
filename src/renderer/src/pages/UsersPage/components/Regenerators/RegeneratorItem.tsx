import { useChainId, useReadContract } from 'wagmi'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { RegeneratorProps } from '@renderer/types/regenerator'

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
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">
          {regenerator && regenerator?.regeneratorWallet}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{regenerator && regenerator?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">
          {regenerator && formatUnits(BigInt(regenerator?.createdAt), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">
          {regenerator && formatUnits(BigInt(regenerator?.totalInspections), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[100px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {regenerator && formatUnits(BigInt(regenerator?.regenerationScore.score), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
