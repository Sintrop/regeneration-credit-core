import { useChainId, useReadContract } from 'wagmi'
import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ActivistProps } from '@renderer/types/activist'

interface Props {
  id: number
}

export function ActivistItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
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

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">{activist && activist?.activistWallet}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{activist && activist?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{activist && formatUnits(BigInt(activist?.createdAt), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{activist && formatUnits(BigInt(activist?.pool?.level), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[100px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {activist && formatUnits(BigInt(activist?.pool?.currentEra), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
