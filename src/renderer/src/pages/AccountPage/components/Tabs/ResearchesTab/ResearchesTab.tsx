import { Loading } from '@renderer/components/Loading/Loading'
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
}

export function ResearchesTab({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearchesIds',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const researchesIds = data ? (data as string[]) : []

  if (researchesIds.length === 0) {
    return <p className="mt-5 text-white">{t('noResearchesPublished')}</p>
  }

  return (
    <div className="flex flex-col mt-5 gap-5">
      {researchesIds.reverse().map((item) => (
        <ResearcheItem key={item} id={item} />
      ))}
    </div>
  )
}

interface ResearcheItemProps {
  id: string
}
function ResearcheItem({ id }: ResearcheItemProps): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getResearch',
    args: [id]
  })

  if (!data) return <div />

  const research = data as ResearchProps

  function handleGoToPdfView(): void {
    navigate(`/resource-details/researche/${research?.id}`)
  }

  return (
    <button
      className="flex items-center justify-between p-3 rounded-2xl bg-green-card w-full hover:cursor-pointer"
      onClick={handleGoToPdfView}
    >
      <div className="flex flex-col items-start">
        <p className="text-white">ID: {formatUnits(BigInt(research?.id), 0)}</p>
        <div className="flex gap-2">
          <p className="text-white">{t('title')}:</p>
          <p className="text-white">{research.title}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-white">{t('thesis')}:</p>
          <p className="text-white">{research.thesis}</p>
        </div>
        <p className="text-white">
          {t('publishedAt')}: {formatUnits(BigInt(research?.createdAtBlock), 0)}
        </p>
        <p className="text-white">
          {t('era')}: {formatUnits(BigInt(research?.era), 0)}
        </p>
        <p className="text-white">
          {t('validationsCount')}: {formatUnits(BigInt(research?.validationsCount), 0)}
        </p>
      </div>

      <FaChevronRight color="white" size={30} />
    </button>
  )
}
