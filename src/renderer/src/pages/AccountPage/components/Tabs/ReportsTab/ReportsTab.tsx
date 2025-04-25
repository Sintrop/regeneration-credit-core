import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { ReportProps } from '@renderer/types/developer'
import { useTranslation } from 'react-i18next'
import { FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address: string
  reportsCount?: number
}

export function ReportsTab({ address, reportsCount }: Props): JSX.Element {
  const { t } = useTranslation()

  if (!reportsCount || reportsCount === 0) {
    return (
      <div className="flex flex-col items-center mt-5">
        <p className="text-white">{t("thereAren'tAnyReports")}</p>
      </div>
    )
  }

  const count = Array.from({ length: reportsCount }, (_, i) => i)

  return (
    <div className="flex flex-col mt-5 gap-5">
      {count.reverse().map((count) => (
        <ReportItem key={count} address={address} count={count} />
      ))}
    </div>
  )
}

interface ReportItemProps {
  count: number
  address: string
}
function ReportItem({ count, address }: ReportItemProps): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data: reportId } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'reportsIds',
    args: [address, count]
  })

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReport',
    args: [reportId]
  })

  if (!data) return <div />

  const report = data as ReportProps

  function handleGoToPdfView(): void {
    navigate(`/pdfview/${report?.report}`)
  }

  return (
    <button
      className="flex items-center justify-between p-3 rounded-2xl bg-green-card w-full hover:cursor-pointer"
      onClick={handleGoToPdfView}
    >
      <div className="flex flex-col items-start">
        <p className="text-white">ID: {formatUnits(BigInt(report?.id), 0)}</p>
        <p className="text-white">{report?.description}</p>
        <p className="text-white">
          {t('publishedAt')}: {formatUnits(BigInt(report?.createdAtBlockNumber), 0)}
        </p>
        <p className="text-white">
          {t('era')}: {formatUnits(BigInt(report?.era), 0)}
        </p>
        <p className="text-white">
          {t('validationsCount')}: {formatUnits(BigInt(report?.validationsCount), 0)}
        </p>
      </div>

      <FaChevronRight color="white" size={30} />
    </button>
  )
}
