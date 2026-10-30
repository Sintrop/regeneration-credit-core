import { useTranslation } from 'react-i18next'
import { Abi, formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useCertificate } from '@renderer/domain/RegenerationCredit/useCases/useCertificate'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useSupporterCompensations } from '@renderer/hooks/useProfileEvents'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { Compensation } from '@renderer/services/profile/profileEvents'
import { formatArea } from '@renderer/utils/formatArea'
import { formatCarbon } from '@renderer/utils/formatCarbon'

function CalculatorItemName({ id }: { id: number }): JSX.Element {
  const { t } = useTranslation()
  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi as Abi,
    functionName: 'getCalculatorItem',
    args: [id],
    query: { staleTime: Infinity }
  })
  return <>{(data as { item?: string } | undefined)?.item ?? t('supporterProfile.offset')}</>
}

function CompensationRow({
  compensation,
  currentBlock
}: {
  compensation: Compensation
  currentBlock: number
}): JSX.Element {
  const { t, i18n } = useTranslation()
  const formatBlocks = useBlocksDuration()
  const ago =
    currentBlock > compensation.blockNumber
      ? t('supporterProfile.ago', {
          duration: formatBlocks(currentBlock - compensation.blockNumber).split(' (')[0]
        })
      : ''

  return (
    <div className="p-4 rounded-xl bg-card-secondary flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white font-semibold">
            {compensation.kind === 'offset' ? (
              <CalculatorItemName id={compensation.calculatorItemId ?? 0} />
            ) : (
              t('supporterProfile.treeFunding')
            )}
          </p>
          <p className="text-gray-400 text-xs">{ago}</p>
        </div>
        <p className="text-green-primary font-bold shrink-0">
          {Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(
            Number(formatUnits(compensation.amount, 18))
          )}{' '}
          RC
        </p>
      </div>
      {compensation.message && (
        <p className="text-gray-200 text-sm italic">“{compensation.message}”</p>
      )}
    </div>
  )
}

/** Total certified RC, what it funds (impact per token from RegenerationCreditImpact) and every compensation. */
export function SupporterCompensations({ address }: { address: string }): JSX.Element {
  const { t, i18n } = useTranslation()
  const { blockNumber } = useCurrentBlock()
  const { tokens } = useCertificate({ address })
  const impact = useImpactPerToken()
  const { compensations, isLoading } = useSupporterCompensations(address)
  const format = (value: number): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value)

  const items = [
    {
      label: t('supporterProfile.carbon'),
      value: formatCarbon(tokens * impact.carbonPerToken, i18n.language)
    },
    { label: t('trees'), value: format(tokens * impact.treesPerToken) },
    { label: t('biodiversity'), value: format(tokens * impact.biodiversityPerToken) },
    { label: t('home.area'), value: formatArea(tokens * impact.soilPerToken, i18n.language) }
  ]

  return (
    <>
      <section className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-4">
        <div>
          <p className="text-gray-300 text-sm">{t('supporterProfile.totalCompensated')}</p>
          <p className="text-green-primary text-3xl font-bold">{format(tokens)} RC</p>
          {!isLoading && (
            <p className="text-gray-400 text-xs">
              {t('supporterProfile.compensationsCount', { count: compensations.length })}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white font-semibold">{t('supporterProfile.fundingImpact')}</p>
          <div className="grid grid-cols-4 gap-2">
            {items.map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-card-secondary">
                <p className="text-white font-bold">{impact.isLoading ? '—' : item.value}</p>
                <p className="text-gray-400 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-[11px]">{t('supporterProfile.impactNote')}</p>
        </div>
      </section>

      <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-white font-bold">{t('supporterProfile.compensations')}</p>
          {!isLoading && <span className="text-gray-400 text-sm">{compensations.length}</span>}
        </div>
        {isLoading ? (
          <div className="h-20 rounded-xl bg-card-secondary animate-pulse" />
        ) : compensations.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('supporterProfile.noCompensations')}</p>
        ) : (
          compensations.map((item) => (
            <CompensationRow
              key={`${item.transactionHash}-${item.kind}`}
              compensation={item}
              currentBlock={blockNumber}
            />
          ))
        )}
      </section>
    </>
  )
}
