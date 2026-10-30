import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ProgressBar } from '@renderer/components/ProgressBar/ProgressBar'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useErasOverview } from '@renderer/hooks/useEras'
import { POOL_HALVING } from '@renderer/services/pools/poolService'
import { blocksToDuration } from '@renderer/utils/blocksToDuration'
import { POOL_NAME_KEY, POOL_SLUG } from '../PoolsPage/poolLabels'

function useFormat(): (value: number, digits?: number) => string {
  const { i18n } = useTranslation()
  return (value, digits = 0) =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)
}

function Concept({
  step,
  title,
  value,
  text
}: {
  step: string
  title: string
  value: string
  text: string
}): JSX.Element {
  return (
    <div className="p-5 rounded-2xl bg-card-primary flex flex-col gap-2">
      <span className="text-green-primary text-xs font-bold uppercase tracking-wider">{step}</span>
      <p className="text-white text-lg font-bold">{title}</p>
      <p className="text-green-primary text-xl font-bold">{value}</p>
      <p className="text-gray-300 text-sm">{text}</p>
    </div>
  )
}

export function ErasPage(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const format = useFormat()
  const formatBlocks = useBlocksDuration()
  const { overview, isLoading } = useErasOverview()

  if (isLoading || !overview) {
    return (
      <ScreenPage pageTitle={t('eras.title')}>
        <div className="max-w-[1000px] mx-auto h-72 rounded-2xl bg-card-primary animate-pulse" />
      </ScreenPage>
    )
  }

  const { currentEra, currentEpoch, blocksPerEra, blocksToNextEra, pools, schedule } = overview
  const elapsed = Math.max(0, blocksPerEra - blocksToNextEra)
  const progress = blocksPerEra > 0 ? (elapsed / blocksPerEra) * 100 : 0
  const eraDays = blocksToDuration(blocksPerEra).value
  const epochYears = (eraDays * POOL_HALVING) / 365
  const firstEraOfEpoch = (currentEpoch - 1) * POOL_HALVING + 1
  const total = pools.reduce((sum, pool) => sum + pool.total, 0)
  const peak = schedule[0]?.perEra ?? 1

  return (
    <ScreenPage pageTitle={t('eras.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-gray-300 text-sm">{t('eras.now')}</p>
              <p className="text-green-primary text-5xl font-bold">
                {t('eras.eraEpoch', { era: currentEra, epoch: currentEpoch })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">{t('pools.eraEndsIn')}</p>
              <p className="text-white text-lg font-bold">{formatBlocks(blocksToNextEra)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ProgressBar value={progress} />
            <p className="text-gray-400 text-xs">
              {t('eras.progress', {
                elapsed: format(elapsed),
                total: format(blocksPerEra),
                percent: format(progress, 1)
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-300 text-sm">
              {t('eras.erasOfEpoch', { epoch: currentEpoch })}
            </p>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: POOL_HALVING }, (_, index) => firstEraOfEpoch + index).map(
                (era) => (
                  <div
                    key={era}
                    className={`h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      era < currentEra
                        ? 'bg-green-primary/30 text-green-primary'
                        : era === currentEra
                          ? 'bg-green-primary text-green-secondary'
                          : 'bg-card-secondary text-gray-400'
                    }`}
                    title={t('pools.eraChip', { era })}
                  >
                    {era}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-4">
          <Concept
            step="1"
            title={t('eras.eraTitle')}
            value={t('eras.eraValue', { blocks: format(blocksPerEra), days: eraDays })}
            text={t('eras.eraText')}
          />
          <Concept
            step="2"
            title={t('eras.epochTitle')}
            value={t('eras.epochValue', { eras: POOL_HALVING, years: format(epochYears, 1) })}
            text={t('eras.epochText')}
          />
          <Concept
            step="3"
            title={t('eras.halvingTitle')}
            value={t('eras.halvingValue')}
            text={t('eras.halvingText')}
          />
        </div>

        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
          <div>
            <p className="text-white text-lg font-bold">{t('eras.scheduleTitle')}</p>
            <p className="text-gray-300 text-sm">{t('eras.scheduleText')}</p>
          </div>
          <div className="flex items-end gap-3 h-56 pt-6">
            {schedule.map((item) => (
              <div
                key={item.epoch}
                className="flex-1 h-full flex flex-col items-center justify-end gap-2"
              >
                <span className="text-white text-xs font-semibold">
                  {format(item.perEra / 1e6, 1)}M
                </span>
                <div
                  className={`w-full rounded-t-lg ${item.epoch === currentEpoch ? 'bg-green-primary' : 'bg-green-primary/30'}`}
                  style={{ height: `${Math.max(4, (item.perEra / peak) * 100)}%` }}
                />
                <span
                  className={`text-xs ${item.epoch === currentEpoch ? 'text-green-primary font-bold' : 'text-gray-400'}`}
                >
                  {t('eras.epochShort', { epoch: item.epoch })}
                </span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-[11px]">{t('eras.scheduleNote')}</p>
        </section>

        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
          <div>
            <p className="text-white text-lg font-bold">{t('eras.distributionTitle')}</p>
            <p className="text-gray-300 text-sm">
              {t('eras.distributionText', { total: format(total) })}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {pools.map((pool) => (
              <button
                key={pool.poolType}
                className="flex items-center gap-4 text-left hover:cursor-pointer group"
                onClick={() => navigate(`/pools/${POOL_SLUG[pool.poolType]}`)}
              >
                <span className="w-48 shrink-0 text-white text-sm group-hover:underline">
                  {t(POOL_NAME_KEY[pool.poolType])}
                </span>
                <span className="flex-1 h-3 rounded-full bg-card-secondary overflow-hidden">
                  <span
                    className="block h-full rounded-full bg-green-primary"
                    style={{ width: `${(pool.total / total) * 100}%` }}
                  />
                </span>
                <span className="w-40 shrink-0 text-right text-sm">
                  <span className="text-white font-semibold">{format(pool.total / 1e6)}M RC</span>
                  <span className="text-gray-400"> · {format((pool.total / total) * 100, 1)}%</span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-sm">{t('eras.levelsText')}</p>
          <button
            className="self-start text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer"
            onClick={() => navigate('/pools')}
          >
            {t('eras.openPools')} ›
          </button>
        </section>

        <p className="text-center text-gray-500 text-xs">{t('tokenImpact.source')}</p>
      </div>
    </ScreenPage>
  )
}
