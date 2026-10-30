import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { FeedCard } from '@renderer/components/Feed/FeedCard'
import { useFeed } from '@renderer/hooks/useFeed'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { rcImpactAbi, rcImpactAddress } from '@renderer/services/contracts'
import { CATEGORY_BY_KIND, FEED_CATEGORIES, FeedCategory } from '@renderer/services/feed/feedTypes'

const PAGE_SIZE = 20

type Filter = 'all' | FeedCategory

function FilterChips({
  value,
  counts,
  onChange
}: {
  value: Filter
  counts: Record<Filter, number>
  onChange: (value: Filter) => void
}): JSX.Element {
  const { t } = useTranslation()
  const options: Filter[] = ['all', ...FEED_CATEGORIES]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`h-9 px-4 rounded-full text-sm font-semibold flex items-center gap-2 hover:cursor-pointer ${
              selected
                ? 'bg-green-primary text-green-secondary'
                : 'bg-card-primary text-white hover:bg-card-primary/70'
            }`}
          >
            {t(`feedNews.filter.${option}`)}
            <span className={selected ? 'text-green-secondary/70' : 'text-gray-400'}>
              {counts[option]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function SkeletonCard(): JSX.Element {
  return (
    <div className="p-5 rounded-2xl bg-card-primary animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-skeleton" />
        <div className="flex flex-col gap-2">
          <div className="w-40 h-3 rounded bg-skeleton" />
          <div className="w-24 h-2 rounded bg-skeleton" />
        </div>
      </div>
      <div className="w-24 h-5 rounded-full bg-skeleton" />
      <div className="w-full h-16 rounded-xl bg-skeleton" />
    </div>
  )
}

/** RegenerationCreditImpact totals for the right column. */
function NetworkImpact(): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const contract = { address: rcImpactAddress as `0x${string}`, abi: rcImpactAbi as Abi }
  const { data } = useReadContracts({
    contracts: [
      { ...contract, functionName: 'totalCarbonImpact' },
      { ...contract, functionName: 'totalTreesImpact' },
      { ...contract, functionName: 'totalBiodiversityImpact' },
      { ...contract, functionName: 'totalAreaImpact' }
    ]
  })
  const value = (index: number): number => Number(data?.[index]?.result ?? 0)
  const format = (n: number, digits = 0): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(n)

  return (
    <section className="p-5 rounded-2xl bg-card-primary border border-green-primary/30 flex flex-col gap-4">
      <div>
        <p className="text-gray-300 text-sm">{t('home.networkImpact')}</p>
        <p className="text-green-primary text-3xl font-bold">{format(value(0) / 1e6, 1)} t</p>
        <p className="text-gray-400 text-xs">{t('home.carbonSequestered')}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card-secondary">
          <p className="text-white font-bold">{format(value(1))}</p>
          <p className="text-gray-400 text-xs">{t('home.trees')}</p>
        </div>
        <div className="p-3 rounded-xl bg-card-secondary">
          <p className="text-white font-bold">{format(value(2))}</p>
          <p className="text-gray-400 text-xs">{t('home.species')}</p>
        </div>
        <div className="p-3 rounded-xl bg-card-secondary">
          <p className="text-white font-bold">{format(value(3) / 10000, 1)} ha</p>
          <p className="text-gray-400 text-xs">{t('home.area')}</p>
        </div>
      </div>
      <button
        className="self-start text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer"
        onClick={() => navigate('/rcstats')}
      >
        {t('home.seeImpact')} ›
      </button>
    </section>
  )
}

export function HomePage(): JSX.Element {
  const { t } = useTranslation()
  const { events, isLoading, isError, refetch } = useFeed()
  const { blockNumber } = useCurrentBlock()
  const [filter, setFilter] = useState<Filter>('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const counts = useMemo(() => {
    const result = { all: events.length } as Record<Filter, number>
    FEED_CATEGORIES.forEach((category) => (result[category] = 0))
    events.forEach((event) => (result[CATEGORY_BY_KIND[event.kind]] += 1))
    return result
  }, [events])

  const filtered =
    filter === 'all' ? events : events.filter((event) => CATEGORY_BY_KIND[event.kind] === filter)

  function changeFilter(value: Filter): void {
    setFilter(value)
    setVisible(PAGE_SIZE)
  }

  return (
    <ScreenPage pageTitle={t('feed.title')} rightRail={<NetworkImpact />}>
      <div className="flex flex-col gap-5 max-w-[720px] mx-auto">
        <FilterChips value={filter} counts={counts} onChange={changeFilter} />

        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : isError ? (
          <div className="p-8 rounded-2xl bg-card-primary text-center flex flex-col items-center gap-3">
            <p className="text-gray-300">{t('home.feedError')}</p>
            <button
              className="text-green-primary font-semibold hover:cursor-pointer"
              onClick={() => refetch()}
            >
              {t('home.tryAgain')}
            </button>
          </div>
        ) : (
          <>
            {filtered.slice(0, visible).map((event) => (
              <FeedCard key={event.key} event={event} currentBlock={blockNumber} />
            ))}
            {visible < filtered.length && (
              <button
                className="h-11 rounded-xl border border-green-primary text-green-primary font-semibold hover:cursor-pointer hover:bg-green-primary/10"
                onClick={() => setVisible((value) => value + PAGE_SIZE)}
              >
                {t('home.loadMore')}
              </button>
            )}
          </>
        )}
      </div>
    </ScreenPage>
  )
}
