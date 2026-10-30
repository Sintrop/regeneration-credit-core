import { Loading } from '@renderer/components/Loading/Loading'
import {
  researcherAbi,
  researcherAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function ReductionCommitmentsCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const { data, isLoading } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'getReductionCommitments',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const calculatorItemIds = data ? (data as string[]) : []

  if (calculatorItemIds.length === 0) {
    return (
      <section className="flex flex-col gap-2 p-5 rounded-2xl bg-card-primary">
        <p className="text-white font-bold">{t('reductionCommitments')}</p>
        <p className="text-gray-400 text-sm">{t('noDeclaredReductionCommitments')}</p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3 p-5 rounded-2xl bg-card-primary">
      <p className="text-white font-bold">{t('reductionCommitments')}</p>
      <p className="-mt-2 text-gray-400 text-xs">{t('supporterProfile.commitmentsHint')}</p>
      {[...calculatorItemIds].reverse().map((item) => (
        <ReductionItem key={item} id={item} address={address} />
      ))}
    </section>
  )
}

interface ReductionItemProps {
  id: string
  address: string
}
function ReductionItem({ id, address }: ReductionItemProps): JSX.Element {
  const { t, i18n } = useTranslation()

  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi,
    functionName: 'getCalculatorItem',
    args: [id]
  })

  const { data: responseContributedWith } = useReadContract({
    address: supporterAddress,
    abi: supporterAbi,
    functionName: 'calculatorItemCertificates',
    args: [address, id]
  })

  if (!data) return <div />

  const item = data as CalculatorItemProps

  const contributedWith = responseContributedWith
    ? parseFloat(formatUnits(BigInt(responseContributedWith as string), 18))
    : 0

  return (
    <div className="p-4 rounded-xl bg-card-secondary flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-white font-semibold">{item?.item}</p>
        <p className="text-green-primary font-bold shrink-0">
          {Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(contributedWith)}{' '}
          RC
        </p>
      </div>
      <p className="text-gray-400 text-xs">
        {formatUnits(BigInt(item?.carbonImpact), 0)} g CO₂/{item?.unit} · {t('contributedWith')}
      </p>
    </div>
  )
}
