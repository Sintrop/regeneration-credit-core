import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { rcIndexAbi, rcIndexAddress } from '@renderer/services/contracts'

const contract = { address: rcIndexAddress as `0x${string}`, abi: rcIndexAbi as Abi }
/** RegenerationIndexRules: index 1 is the highest level, 7 is neutral. */
const INDEX_IDS = [1, 2, 3, 4, 5, 6, 7]

function useIndexLevels(): Record<number, { name: string; value: number }> {
  const { data } = useReadContracts({
    contracts: INDEX_IDS.map((id) => ({
      ...contract,
      functionName: 'regenerationIndex',
      args: [id]
    }))
  })
  const levels: Record<number, { name: string; value: number }> = {}
  data?.forEach((entry, index) => {
    if (entry.status !== 'success') return
    const [name, value] = entry.result as [string, number]
    levels[INDEX_IDS[index]] = { name, value: Number(value) }
  })
  return levels
}

function CategoryCard({
  categoryId,
  levels
}: {
  categoryId: number
  levels: Record<number, { name: string; value: number }>
}): JSX.Element {
  const { t } = useTranslation()
  const { data: category } = useReadContract({
    ...contract,
    functionName: 'categories',
    args: [categoryId]
  })
  const { data: descriptions, isLoading } = useReadContract({
    ...contract,
    functionName: 'getCategoryRegenerationIndexDescription',
    args: [categoryId]
  })
  const [, name, description] = (category as [bigint, string, string] | undefined) ?? []
  const rows =
    (descriptions as { regenerationIndexId: number; description: string }[] | undefined) ?? []
  const header = 'px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div>
        <p className="text-white text-lg font-bold">{name ?? '—'}</p>
        {description && <p className="text-gray-300 text-sm">{description}</p>}
      </div>
      {isLoading ? (
        <div className="h-40 rounded-xl bg-card-secondary animate-pulse" />
      ) : (
        <div className="rounded-xl bg-card-secondary overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="border-b border-white/10">
              <tr>
                <th className={header}>{t('rcIndex.level')}</th>
                <th className={header}>{t('rcIndex.condition')}</th>
                <th className={`${header} text-right`}>{t('rcIndex.points')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const level = levels[Number(row.regenerationIndexId)]
                return (
                  <tr
                    key={row.regenerationIndexId}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-4 py-2 text-sm text-white font-semibold">
                      {level?.name ?? row.regenerationIndexId}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-300 font-mono">{row.description}</td>
                    <td className="px-4 py-2 text-sm text-green-primary font-bold text-right">
                      {level ? level.value : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function ScoreSimulator(): JSX.Element {
  const { t } = useTranslation()
  const [trees, setTrees] = useState('')
  const [biodiversity, setBiodiversity] = useState('')
  const toUint = (value: string): number =>
    Math.max(0, Math.min(4294967295, parseInt(value.replace(/\D/g, '')) || 0))
  const { data, isFetching } = useReadContract({
    ...contract,
    functionName: 'calculateScore',
    args: [toUint(trees), toUint(biodiversity)],
    query: { enabled: trees !== '' || biodiversity !== '' }
  })
  const input =
    'h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary'

  return (
    <section className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-4">
      <div>
        <p className="text-white text-lg font-bold">{t('rcIndex.simulatorTitle')}</p>
        <p className="text-gray-300 text-sm">{t('rcIndex.simulatorDescription')}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 items-end">
        <label className="flex flex-col gap-2">
          <span className="text-gray-300 text-sm">{t('trees')}</span>
          <input
            value={trees}
            onChange={(event) => setTrees(event.target.value)}
            inputMode="numeric"
            placeholder="3125"
            className={input}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-gray-300 text-sm">{t('biodiversity')}</span>
          <input
            value={biodiversity}
            onChange={(event) => setBiodiversity(event.target.value)}
            inputMode="numeric"
            placeholder="20"
            className={input}
          />
        </label>
        <div className="h-[72px] p-3 rounded-xl bg-green-primary/10 flex flex-col justify-center">
          <span className="text-gray-300 text-xs">{t('rcIndex.score')}</span>
          <span className="text-green-primary text-2xl font-bold">
            {trees === '' && biodiversity === '' ? '—' : isFetching ? '…' : Number(data ?? 0)}
          </span>
        </div>
      </div>
      <p className="text-gray-500 text-[11px]">{t('rcIndex.simulatorNote')}</p>
    </section>
  )
}

export function RcIndexPage(): JSX.Element {
  const { t } = useTranslation()
  const levels = useIndexLevels()

  return (
    <ScreenPage pageTitle={t('rcIndex.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <p className="text-gray-300 text-sm leading-relaxed">{t('rcIndex.intro')}</p>
        <ScoreSimulator />
        <div className="grid grid-cols-2 gap-5 items-start">
          <CategoryCard categoryId={1} levels={levels} />
          <CategoryCard categoryId={2} levels={levels} />
        </div>
      </div>
    </ScreenPage>
  )
}
