import { useChainId, useReadContract } from 'wagmi'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ReportFeedHeader } from './ReportFeedHeader'
import { ReportFeedContent } from './ReportFeedContent'
import { ReportProps } from '@renderer/types/developer'

interface Props {
  id: number
}

export function ReportFeedItem({ id }: Props): JSX.Element {
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReport',
    args: [id]
  })

  const report = data as ReportProps

  if (report) {
    return (
      <div className="flex flex-col rounded-2xl p-3 bg-container-primary w-full">
        <ReportFeedHeader
          address={report?.developer}
          publishedAt={formatUnits(BigInt(report.createdAtBlockNumber), 0)}
        />
        <ReportFeedContent reportId={id} description={report.description} />
      </div>
    )
  }

  return <div />
}
