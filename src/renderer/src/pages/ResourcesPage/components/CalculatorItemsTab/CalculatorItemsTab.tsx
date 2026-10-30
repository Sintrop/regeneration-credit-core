import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { formatCarbon } from '@renderer/utils/formatCarbon'

const contract = { address: researcherAddress as `0x${string}`, abi: researcherAbi as Abi }

function CalculatorItemRow({ id }: { id: number }): JSX.Element | null {
  const { i18n } = useTranslation()
  const { data } = useReadContract({
    ...contract,
    functionName: 'getCalculatorItem',
    args: [BigInt(id)]
  })
  const item = data as
    | { item: string; unit: string; carbonImpact: bigint; createdBy: string; thesis: string }
    | undefined
  const cell = 'px-4 py-3 text-sm text-white'

  if (!item) {
    return (
      <tr>
        <td colSpan={4} className="px-4 py-3">
          <div className="h-8 rounded bg-card-secondary animate-pulse" />
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className={`${cell} font-semibold`}>#{id}</td>
      <td className={cell}>
        <p className="font-semibold">{item.item}</p>
        {item.thesis && <p className="text-gray-400 text-xs line-clamp-2">{item.thesis}</p>}
      </td>
      <td className={`${cell} whitespace-nowrap`}>
        <span className="text-green-primary font-bold">
          {formatCarbon(Number(item.carbonImpact), i18n.language)}
        </span>
        <span className="text-gray-400"> CO₂ / {item.unit}</span>
      </td>
      <td className={cell}>
        <UserBadge address={item.createdBy} />
      </td>
    </tr>
  )
}

/** Calculator items registered in ResearcherRules: the carbon each unit of use emits. */
export function CalculatorItemsTab(): JSX.Element {
  const { t } = useTranslation()
  const { data, isLoading } = useReadContract({ ...contract, functionName: 'calculatorItemsCount' })
  const count = Number(data ?? 0)
  const ids = Array.from({ length: count }, (_, index) => count - index)
  const header = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'

  if (isLoading) return <div className="h-48 rounded-2xl bg-card-primary animate-pulse" />

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm">{t('resources.calculatorItemsHint')}</p>
      {ids.length === 0 ? (
        <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
          {t('resources.noCalculatorItemsAvailable')}
        </p>
      ) : (
        <div className="rounded-2xl bg-card-primary overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-white/10">
              <tr>
                <th className={header}>ID</th>
                <th className={header}>{t('resources.item')}</th>
                <th className={header}>{t('resources.carbonImpactPerUnit')}</th>
                <th className={header}>{t('resources.researcher')}</th>
              </tr>
            </thead>
            <tbody>
              {ids.map((id) => (
                <CalculatorItemRow key={id} id={id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
