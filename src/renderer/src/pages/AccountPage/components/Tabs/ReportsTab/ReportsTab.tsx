import { Loading } from '@renderer/components/Loading/Loading'
import { ValidTag } from '@renderer/components/ValidTag/ValidTag'
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
}

export function ReportsTab({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReportsIds',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const reportsIds = data ? (data as string[]) : []

  if (reportsIds.length === 0) {
    return <p className="mt-5 text-white">{t('noReportsPublished')}</p>
  }

  return (
    <div className="flex flex-col mt-5 gap-5">
      {reportsIds.reverse().map((item) => (
        <ReportItem key={item} id={item} />
      ))}
    </div>
  )
}

interface ReportItemProps {
  id: string
}
function ReportItem({ id }: ReportItemProps): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'getReport',
    args: [id]
  })

  if (!data) return <div />

  const report = data as ReportProps

  function handleGoToPdfView(): void {
    navigate(`/resource-details/report/${report?.id}`)
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

        <ValidTag valid={report.valid.toString() === 'true' ? true : false} />
      </div>

      <FaChevronRight color="white" size={30} />
    </button>
  )
}
