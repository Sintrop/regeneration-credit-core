import { Loading } from '@renderer/components/Loading/Loading'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { useResearchValidations } from '@renderer/domain/Researcher/events/useResearchValidations'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { ResearchProps } from '@renderer/types/researcher'
import { ResourceValidationProps } from '@renderer/types/validation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  id: number
  setReport: (report: string) => void
  setValidations: (data: ResourceValidationProps[]) => void
}
export function ResearcheData({ id, setReport, setValidations }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { validations } = useResearchValidations({ researchId: id })

  useEffect(() => {
    setValidations([])
    setValidations(validations)
  }, [validations])

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    args: [id],
    functionName: 'getResearch'
  })

  const researche = data as ResearchProps

  if (researche) {
    setReport(researche.file)
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
        <div className="p-3 rounded-2xl bg-container-primary w-full">
          <p className="text-xs text-gray-300">{t('common.title')}</p>
          <p className="text-white">{researche && researche.title}</p>
        </div>

        <div className="p-3 rounded-2xl bg-container-primary w-full">
          <p className="text-xs text-gray-300">{t('common.thesis')}</p>
          <p className="text-white">{researche && researche.thesis}</p>
        </div>

        <div className="p-3 rounded-2xl bg-container-primary w-full">
          <p className="text-xs text-gray-300">{t('common.data')}</p>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('common.researcher')}:</p>
            <UserAddressLink address={researche.createdBy} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('common.valid')}:</p>
            <p className="text-white">{researche && researche.valid.toString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-white">{t('common.createdAt')}:</p>
            <p className="text-white">
              {researche && formatUnits(BigInt(researche.createdAtBlock), 0)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-white">Era:</p>
            <p className="text-white">{researche && formatUnits(BigInt(researche.era), 0)}</p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-white">{t('common.validationsCount')}:</p>
            <p className="text-white">
              {researche && formatUnits(BigInt(researche.validationsCount), 0)}
            </p>
          </div>
        </div>
      </div>

      <VoteToInvalidate
        resourceId={id}
        resourceType="research"
        publishedEra={parseInt(formatUnits(BigInt(researche.era), 0))}
      />
    </div>
  )
}
