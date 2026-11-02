import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useInspectionsList } from '@renderer/hooks/useInspectionsList'
import { useProtocolRules } from '@renderer/hooks/useProtocolRules'
import {
  InspectionStatus,
  inspectionStatus
} from '@renderer/services/inspections/inspectionsService'
import { InspectionCard } from './components/InspectionCard'
import { InspectionsTable } from './components/InspectionsTable'

type Filter = 'all' | InspectionStatus
const FILTERS: Filter[] = ['all', 'open', 'accepted', 'realized', 'expired', 'invalidated']
const PAGE_SIZE = 20
type ViewMode = 'table' | 'cards'

function Summary({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex-1 p-4 rounded-2xl bg-card-primary">
      <p className="text-green-primary text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

export function InspectionsPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { inspections, isLoading, isError, refetch } = useInspectionsList()
  const { blockNumber } = useCurrentBlock()
  const { rules } = useProtocolRules()
  const [filter, setFilter] = useState<Filter>('all')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [mode, setMode] = useState<ViewMode>('table')

  const blocksToExpire = rules?.blocksToExpireAcceptedInspection ?? Infinity
  const acceptDelay = rules?.acceptInspectionDelayBlocks ?? 0

  const withStatus = useMemo(
    () =>
      inspections.map((inspection) => ({
        inspection,
        status: inspectionStatus(inspection, blockNumber, blocksToExpire)
      })),
    [inspections, blockNumber, blocksToExpire]
  )

  const counts = useMemo(() => {
    const result = { all: withStatus.length } as Record<Filter, number>
    FILTERS.slice(1).forEach((item) => (result[item] = 0))
    withStatus.forEach(({ status }) => (result[status] += 1))
    return result
  }, [withStatus])

  const realized = withStatus.filter(({ status }) => status === 'realized')
  const format = (value: number, digits = 0): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)
  const trees = realized.reduce((sum, { inspection }) => sum + inspection.treesResult, 0)
  const avgScore = realized.length
    ? realized.reduce((sum, { inspection }) => sum + inspection.regenerationScore, 0) /
      realized.length
    : 0

  const shown = filter === 'all' ? withStatus : withStatus.filter((item) => item.status === filter)

  return (
    <ScreenPage pageTitle={t('inspections.title')}>
      <div className="flex flex-col gap-5 max-w-[1000px] mx-auto">
        <div className="flex gap-3">
          <Summary
            label={t('inspections.realizedCount')}
            value={isLoading ? '—' : format(realized.length)}
          />
          <Summary label={t('inspections.treesCounted')} value={isLoading ? '—' : format(trees)} />
          <Summary
            label={t('inspections.avgScore')}
            value={isLoading ? '—' : format(avgScore, 1)}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const selected = item === filter
              return (
                <button
                  key={item}
                  onClick={() => {
                    setFilter(item)
                    setVisible(PAGE_SIZE)
                  }}
                  className={`h-9 px-4 rounded-full text-sm font-semibold flex items-center gap-2 hover:cursor-pointer ${
                    selected
                      ? 'bg-green-primary text-green-secondary'
                      : 'bg-card-primary text-white hover:bg-card-primary/70'
                  }`}
                >
                  {t(item === 'all' ? 'resourcesList.filterAll' : `inspections.status.${item}`)}
                  {!isLoading && (
                    <span className={selected ? 'text-green-secondary/70' : 'text-gray-400'}>
                      {counts[item]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex shrink-0 p-1 rounded-xl bg-card-primary">
            {(['table', 'cards'] as ViewMode[]).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`h-8 px-4 rounded-lg text-sm font-semibold hover:cursor-pointer ${
                  mode === item ? 'bg-green-primary text-green-secondary' : 'text-white'
                }`}
              >
                {t(`inspections.view.${item}`)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-2xl bg-card-primary animate-pulse" />
        ) : shown.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card-primary text-center flex flex-col items-center gap-3">
            <p className="text-gray-300">
              {isError ? t('resourcesList.error') : t('resources.noInspectionsAvailable')}
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
        ) : mode === 'table' ? (
          <InspectionsTable
            rows={shown}
            currentBlock={blockNumber}
            acceptDelay={acceptDelay}
            onChanged={refetch}
          />
        ) : (
          <>
            <div className="flex flex-col gap-4 max-w-[720px] w-full mx-auto">
              {shown.slice(0, visible).map(({ inspection, status }) => (
                <InspectionCard
                  key={inspection.id}
                  inspection={inspection}
                  status={status}
                  currentBlock={blockNumber}
                  blocksToExpire={blocksToExpire}
                  acceptDelay={acceptDelay}
                  onChanged={refetch}
                />
              ))}
            </div>
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
    </ScreenPage>
  )
}
