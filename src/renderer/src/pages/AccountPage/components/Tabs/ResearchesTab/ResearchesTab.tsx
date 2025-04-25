import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { ResearchProps } from '@renderer/types/researcher'
import { useTranslation } from 'react-i18next'
import { FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address: string
  researchesCount?: number
}

export function ResearchesTab({ address, researchesCount }: Props): JSX.Element {
  const { t } = useTranslation()

  if (!researchesCount || researchesCount === 0) {
    return (
      <div className="flex flex-col items-center mt-5">
        <p className="text-white">{t("thisResearcherDoesn'tHaveResearches")}</p>
      </div>
    )
  }

  const count = Array.from({ length: researchesCount }, (_, i) => i)

  return (
    <div className="flex flex-col mt-5 gap-5">
      {count.reverse().map((count) => (
        <ResearcheItem key={count} address={address} count={count} />
      ))}
    </div>
  )
}

interface ResearcheItemProps {
  count: number
  address: string
}
function ResearcheItem({ count, address }: ResearcheItemProps): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data: researchId } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'researchesIds',
    args: [address, count]
  })

  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearch',
    args: [researchId]
  })

  if (!data) return <div />

  const report = data as ResearchProps

  function handleGoToPdfView(): void {
    navigate(`/pdfview/${report?.file}`)
  }

  return (
    <button
      className="flex items-center justify-between p-3 rounded-2xl bg-green-card w-full hover:cursor-pointer"
      onClick={handleGoToPdfView}
    >
      <div className="flex flex-col items-start">
        <p className="text-white">ID: {formatUnits(BigInt(report?.id), 0)}</p>
        <p className="text-white">
          {t('publishedAt')}: {formatUnits(BigInt(report?.createdAtBlock), 0)}
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
