import { Loading } from '@renderer/components/Loading/Loading'
import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { ResearchProps } from '@renderer/types/researcher'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  id: number
  setValidationsCount: (count: number) => void
  setReport: (report: string) => void
}
export function ResearcheData({ id, setReport, setValidationsCount }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    args: [id],
    functionName: 'getResearch'
  })

  const researche = data as ResearchProps

  if (researche) {
    setReport(researche.file)
    setValidationsCount(parseInt(formatUnits(BigInt(researche.validationsCount), 0)))
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-white">{t('researcher')}:</p>
          <UserAddressLink address={researche.createdBy} />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('title')}:</p>
          <p className="text-white">{researche && researche.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('thesis')}:</p>
          <p className="text-white">{researche && researche.thesis}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('valid')}:</p>
          <p className="text-white">{researche && researche.valid.toString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('createdAt')}:</p>
          <p className="text-white">
            {researche && formatUnits(BigInt(researche.createdAtBlock), 0)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('era')}:</p>
          <p className="text-white">{researche && formatUnits(BigInt(researche.era), 0)}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-white">{t('validationsCount')}:</p>
          <p className="text-white">
            {researche && formatUnits(BigInt(researche.validationsCount), 0)}
          </p>
        </div>
      </div>

      <VoteToInvalidate resourceId={id} resourceType="research" />
    </div>
  )
}
