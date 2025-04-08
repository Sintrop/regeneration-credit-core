import { useChainId, useReadContract } from 'wagmi'
import {
  supporterAbi,
  supporterAddress,
  sequoiaSupporterAbi,
  sequoiaSupporterAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { SupporterProps } from '@renderer/types/supporter'

interface Props {
  id: number
}

export function SupporterItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'supportersAddress',
    args: [id]
  })

  const userSUpporterAddress = data as string

  const { data: supporterResponse } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [userSUpporterAddress]
  })

  const supporter = supporterResponse as SupporterProps

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">
          {supporter && supporter?.supporterWallet}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{supporter && supporter?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{supporter && formatUnits(BigInt(supporter?.createdAt), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
