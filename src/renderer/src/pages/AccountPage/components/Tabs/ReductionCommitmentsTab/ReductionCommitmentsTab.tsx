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

export function ReductionCommitmentsTab({ address }: Props): JSX.Element {
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
    return <p className="mt-5 text-white">{t('noDeclaredReductionCommitments')}</p>
  }

  return (
    <div className="flex flex-col mt-5 gap-5">
      {calculatorItemIds.reverse().map((item) => (
        <ReductionItem key={item} id={item} address={address} />
      ))}
    </div>
  )
}

interface ReductionItemProps {
  id: string
  address: string
}
function ReductionItem({ id, address }: ReductionItemProps): JSX.Element {
  const { t } = useTranslation()

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
    <div className="flex flex-col items-start p-3 rounded-2xl bg-green-card w-full hover:cursor-pointer">
      <p className="text-white">ID: {formatUnits(BigInt(item?.id), 0)}</p>
      <p className="text-white">{item?.item}</p>
      <p className="text-white">
        {t('carbonImpact')}: {formatUnits(BigInt(item?.carbonImpact), 0)} g
      </p>
      <p className="text-white">
        {t('contributedWith')}:{' '}
        {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(contributedWith)} RC
      </p>
    </div>
  )
}
