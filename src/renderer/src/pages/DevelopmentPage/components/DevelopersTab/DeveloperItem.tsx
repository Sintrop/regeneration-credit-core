import { useChainId, useReadContract } from 'wagmi'
import { DeveloperProps } from '@renderer/types/developer'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'

interface Props {
  id: number
}

export function DeveloperItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'developersAddress',
    args: [id]
  })

  const userDeveloperAddress = data as string

  const { data: developerResponse } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getDeveloper',
    args: [userDeveloperAddress]
  })

  const developer = developerResponse as DeveloperProps

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary min-w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[400px] pl-5">
        <p className="text-white truncate text-ellipsis">
          {developer && developer?.developerWallet}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[300px] pl-5">
        <p className="text-white">{developer && developer?.name}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{developer && formatUnits(BigInt(developer?.createdAt), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white">{developer && formatUnits(BigInt(developer?.totalReports), 0)}</p>
      </div>

      <div className="border-r border-container-secondary min-w-[100px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {developer && formatUnits(BigInt(developer?.pool?.level), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary min-w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
