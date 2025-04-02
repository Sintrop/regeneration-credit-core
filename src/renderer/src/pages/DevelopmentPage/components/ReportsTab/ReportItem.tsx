import { useChainId, useReadContract } from 'wagmi'
import { ReportProps } from '@renderer/types/developer'
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

export function ReportItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReport',
    args: [id]
  })

  const report = data as ReportProps

  return (
    <div className="flex items-center bg-container-primary px-5 h-10 border-b border-container-secondary">
      <div className="border-r border-container-secondary w-[50px]">
        <p className="text-white">{id}</p>
      </div>

      <div className="border-r border-container-secondary flex-1 pl-5">
        <p className="text-white">{report && report?.developer}</p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">
          {report && formatUnits(BigInt(report?.createdAtBlockNumber), 0)}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white">{report && formatUnits(BigInt(report?.era), 0)}</p>
      </div>

      <div className="border-r border-container-secondary w-[200px] pl-5 overflow-hidden">
        <p className="text-white text-truncate text-ellipsis max-w-[90%]">
          {report && report.report}
        </p>
      </div>

      <div className="border-r border-container-secondary w-[120px] pl-5">
        <p className="text-white"></p>
      </div>
    </div>
  )
}
