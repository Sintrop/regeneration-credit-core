import { Loading } from '@renderer/components/Loading/Loading'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { ReportProps } from '@renderer/types/developer'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  id: number
  setReport: (report: string) => void
}
export function ReportData({ id, setReport }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    args: [id],
    functionName: 'getReport'
  })

  const report = data as ReportProps

  if (report) {
    setReport(report.report)
  }

  if (isLoading) {
    return (
      <div>
        <div className="w-full items-center overflow-hidden">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-2 max-w-[500px]">
        <div className="flex items-center gap-2">
          <p className="text-white">{t('developer')}:</p>
          <UserAddressLink address={report.developer} />
        </div>

        <div className="flex gap-2">
          <p className="text-white">{t('description')}:</p>
          <p className="text-white">{report && report.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('valid')}:</p>
          <p className="text-white">{report && report.valid.toString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('createdAt')}:</p>
          <p className="text-white">
            {report && formatUnits(BigInt(report.createdAtBlockNumber), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('era')}:</p>
          <p className="text-white">{report && formatUnits(BigInt(report.era), 0)}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('validationsCount')}:</p>
          <p className="text-white">{report && formatUnits(BigInt(report.validationsCount), 0)}</p>
        </div>
      </div>

      <VoteToInvalidate
        resourceId={id}
        resourceType="report"
        publishedEra={parseInt(formatUnits(BigInt(report.era), 0))}
      />
    </div>
  )
}
