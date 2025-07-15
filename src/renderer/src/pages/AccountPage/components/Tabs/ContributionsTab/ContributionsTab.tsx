import { Loading } from '@renderer/components/Loading/Loading'
import { ValidTag } from '@renderer/components/ValidTag/ValidTag'
import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { ContributionProps } from '@renderer/types/contributor'
import { useTranslation } from 'react-i18next'
import { FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function ContributionsTab({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContributionsIds',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const contributionsIds = data ? (data as string[]) : []

  if (contributionsIds.length === 0) {
    return <p className="mt-5 text-white">{t('noContributionsPublished')}</p>
  }

  return (
    <div className="flex flex-col mt-5 gap-5">
      {contributionsIds.reverse().map((item) => (
        <ContributionItem key={item} id={item} />
      ))}
    </div>
  )
}

interface ContributionItemProps {
  id: string
}
function ContributionItem({ id }: ContributionItemProps): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContribution',
    args: [id]
  })

  if (!data) return <div />

  const contribution = data as ContributionProps

  function handleGoToPdfView(): void {
    navigate(`/resource-details/contribution/${contribution?.id}`)
  }

  return (
    <button
      className="flex items-center justify-between p-3 rounded-2xl bg-green-card w-full hover:cursor-pointer"
      onClick={handleGoToPdfView}
    >
      <div className="flex flex-col items-start">
        <p className="text-white">ID: {formatUnits(BigInt(contribution?.id), 0)}</p>
        <p className="text-white">{contribution?.description}</p>
        <p className="text-white">
          {t('publishedAt')}: {formatUnits(BigInt(contribution?.createdAtBlockNumber), 0)}
        </p>
        <p className="text-white">
          {t('era')}: {formatUnits(BigInt(contribution?.era), 0)}
        </p>
        <p className="text-white">
          {t('validationsCount')}: {formatUnits(BigInt(contribution?.validationsCount), 0)}
        </p>

        <ValidTag valid={contribution.valid.toString() === 'true' ? true : false} />
      </div>

      <FaChevronRight color="white" size={30} />
    </button>
  )
}
