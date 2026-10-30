import { useReadContract } from 'wagmi'
import { developerAbi, developerAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { ReportFeedContent } from './ReportFeedContent'
import { DeveloperProps, ReportProps } from '@renderer/types/developer'
import { HeaderFeedItem } from '../../HeaderFeedItem/HeaderFeedItem'

interface Props {
  id: number
}

export function ReportFeedItem({ id }: Props): JSX.Element {
  const { data } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'getReport',
    args: [id]
  })
  const report = data as ReportProps

  const { data: resDeveloper } = useReadContract({
    address: developerAddress,
    abi: developerAbi,
    functionName: 'getDeveloper',
    args: [report ? report.developer : '']
  })
  const developer = resDeveloper as DeveloperProps

  if (report && developer) {
    return (
      <div className="flex flex-col p-3 w-full border-t border-green-900">
        <HeaderFeedItem
          address={developer.developerWallet}
          name={developer.name}
          proofPhoto={developer.proofPhoto}
          publishedAt={formatUnits(BigInt(report.createdAtBlockNumber), 0)}
        />
        <ReportFeedContent
          reportId={id}
          description={report.description}
          valid={report.valid.toString() === 'true' ? true : false}
        />
      </div>
    )
  }

  return <div />
}
