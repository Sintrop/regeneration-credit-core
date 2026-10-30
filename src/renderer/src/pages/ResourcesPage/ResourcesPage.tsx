import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { usePublishedResources } from '@renderer/hooks/usePublishedResources'
import { PublishedResourceType } from '@renderer/services/resources/resourcesService'
import { CalculatorItemsTab } from './components/CalculatorItemsTab/CalculatorItemsTab'
import { EvaluationMethodsTab } from './components/EvaluationMethodsTab/EvaluationMethodsTab'
import { ResourceCard } from './components/ResourceCard'

type Filter = 'all' | PublishedResourceType
type Tab = 'publications' | 'calculatorItems' | 'evaluationMethods'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'resourcesList.filterAll' },
  { value: 'research', label: 'resourcesList.researches' },
  { value: 'contribution', label: 'resourcesList.contributions' },
  { value: 'report', label: 'resourcesList.reports' }
]

const TABS: { value: Tab; label: string }[] = [
  { value: 'publications', label: 'resourcesList.publications' },
  { value: 'calculatorItems', label: 'resources.calculatorItems' },
  { value: 'evaluationMethods', label: 'resources.evaluationMethods' }
]

const PAGE_SIZE = 20

function Chip({
  label,
  count,
  selected,
  onClick
}: {
  label: string
  count?: number
  selected: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-full text-sm font-semibold flex items-center gap-2 hover:cursor-pointer ${
        selected
          ? 'bg-green-primary text-green-secondary'
          : 'bg-card-primary text-white hover:bg-card-primary/70'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={selected ? 'text-green-secondary/70' : 'text-gray-400'}>{count}</span>
      )}
    </button>
  )
}

function Publications(): JSX.Element {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const { resources, isLoading, isError, refetch } = usePublishedResources()
  const [visible, setVisible] = useState(PAGE_SIZE)
  const typeParam = params.get('type') as Filter | null
  const filter: Filter = FILTERS.some((item) => item.value === typeParam) ? typeParam! : 'all'

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: resources.length,
      research: 0,
      contribution: 0,
      report: 0
    }
    resources.forEach((resource) => (result[resource.type] += 1))
    return result
  }, [resources])

  const shown = filter === 'all' ? resources : resources.filter((item) => item.type === filter)

  function changeFilter(value: Filter): void {
    setParams(value === 'all' ? {} : { type: value }, { replace: true })
    setVisible(PAGE_SIZE)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Chip
            key={item.value}
            label={t(item.label)}
            count={isLoading ? undefined : counts[item.value]}
            selected={item.value === filter}
            onClick={() => changeFilter(item.value)}
          />
        ))}
      </div>

      {isLoading ? (
        [0, 1, 2].map((index) => (
          <div key={index} className="h-40 rounded-2xl bg-card-primary animate-pulse" />
        ))
      ) : shown.length === 0 ? (
        <div className="p-8 rounded-2xl bg-card-primary text-center flex flex-col items-center gap-3">
          <p className="text-gray-300">
            {isError ? t('resourcesList.error') : t('resourcesList.empty')}
          </p>
          {isError && (
            <button
              className="text-green-primary font-semibold hover:cursor-pointer"
              onClick={() => refetch()}
            >
              {t('home.tryAgain')}
            </button>
          )}
        </div>
      ) : (
        <>
          {shown.slice(0, visible).map((resource) => (
            <ResourceCard key={`${resource.type}-${resource.id}`} resource={resource} />
          ))}
          {visible < shown.length && (
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
  )
}

/** Researches, contributions and development reports in one place, plus the research outputs. */
export function ResourcesPage(): JSX.Element {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('publications')

  return (
    <ScreenPage pageTitle={t('resourcesList.title')}>
      <div className="flex flex-col gap-6 max-w-[820px] mx-auto">
        <div className="flex gap-6 border-b border-card-primary">
          {TABS.map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`pb-3 -mb-px text-sm font-semibold border-b-2 hover:cursor-pointer ${
                tab === item.value
                  ? 'border-green-primary text-green-primary'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        {tab === 'publications' && <Publications />}
        {tab === 'calculatorItems' && <CalculatorItemsTab />}
        {tab === 'evaluationMethods' && <EvaluationMethodsTab />}
      </div>
    </ScreenPage>
  )
}
