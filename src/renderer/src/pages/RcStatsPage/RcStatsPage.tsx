import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import RCLogo from '@renderer/assets/images/rc.png'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useImpactEras, useImpactOverview } from '@renderer/hooks/useImpact'
import { useEra } from '@renderer/hooks/useEra'
import { ImpactOverview } from '@renderer/services/impact/impactService'
import { formatArea } from '@renderer/utils/formatArea'
import { formatCarbon } from '@renderer/utils/formatCarbon'
import {
  averageTreesPerInspection,
  eraImpactStatus,
  tokenSupplyBreakdown
} from '@renderer/utils/impactBreakdown'

function useFormat(): (value: number, digits?: number) => string {
  const { i18n } = useTranslation()
  return (value, digits = 0) =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value || 0)
}

function Tile({ value, label }: { value: string; label: string }): JSX.Element {
  return (
    <div className="p-3 rounded-xl bg-card-secondary min-w-0">
      <p className="text-white text-lg font-bold truncate">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

function Card({
  title,
  description,
  children
}: {
  title: string
  description?: string
  children: ReactNode
}): JSX.Element {
  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div>
        <p className="text-white font-bold text-lg">{title}</p>
        {description && <p className="text-gray-300 text-sm">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function SystemImpact({ overview }: { overview: ImpactOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const { total, perToken } = overview
  const tokensPerTree = perToken.trees > 0 ? 1 / perToken.trees : 0

  return (
    <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-gray-300 text-sm">{t('tokenImpact.systemImpact')}</p>
          <p className="text-green-primary text-5xl font-bold">
            {formatCarbon(total.carbon, i18n.language)}
          </p>
          <p className="text-gray-300 text-sm">{t('tokenImpact.carbonSequestered')}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-primary/10 border border-green-primary/40 max-w-[280px]">
          <p className="flex items-center gap-2 text-green-primary font-bold">
            <img src={RCLogo} className="w-5 h-5" />
            {t('impactCalculator.treeEqualsTokens', { tokens: format(tokensPerTree, 2) })}
          </p>
          <p className="text-gray-300 text-xs mt-1">
            {t('impactCalculator.tokensPerTreeDescription', { tokens: format(tokensPerTree, 2) })}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Tile value={format(total.trees)} label={t('trees')} />
        <Tile value={format(total.biodiversity)} label={t('tokenImpact.species')} />
        <Tile
          value={formatArea(total.area, i18n.language)}
          label={t('tokenImpact.areaInRegeneration')}
        />
      </div>
      <p className="text-gray-500 text-[11px]">{t('tokenImpact.systemImpactNote')}</p>
    </section>
  )
}

function ImpactPerRc({ overview }: { overview: ImpactOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const significant = (value: number): string =>
    Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 4 }).format(value || 0)
  const { perToken } = overview
  return (
    <Card
      title={t('tokenImpact.impactPerToken')}
      description={t('tokenImpact.impactPerTokenDescription')}
    >
      <div className="grid grid-cols-2 gap-3">
        <Tile value={formatCarbon(perToken.carbon, i18n.language)} label={t('carbon')} />
        <Tile value={significant(perToken.trees)} label={t('trees')} />
        <Tile value={significant(perToken.biodiversity)} label={t('tokenImpact.species')} />
        <Tile value={formatArea(perToken.area, i18n.language)} label={t('home.area')} />
      </div>
    </Card>
  )
}

function Step({
  index,
  title,
  value
}: {
  index: number
  title: string
  value: string
}): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 shrink-0 rounded-full bg-green-primary/20 text-green-primary text-xs font-bold flex items-center justify-center">
        {index}
      </span>
      <span className="flex-1 text-gray-200 text-sm">{title}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}

function HowItIsCalculated({ overview }: { overview: ImpactOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const { settlement, total, supply, carbonPerTree } = overview
  const { effective } = tokenSupplyBreakdown(
    supply.totalSupply,
    supply.totalLocked,
    supply.totalCertified
  )
  const average = averageTreesPerInspection(
    settlement.inspectionsTrees,
    settlement.realizedInspections
  )

  return (
    <Card title={t('tokenImpact.howTitle')} description={t('tokenImpact.howDescription')}>
      <div className="flex flex-col gap-3">
        <Step
          index={1}
          title={t('tokenImpact.howAverage', { count: settlement.realizedInspections })}
          value={format(average, 1)}
        />
        <Step
          index={2}
          title={t('tokenImpact.howRegenerators')}
          value={`× ${format(settlement.certifiedRegenerators)}`}
        />
        <Step index={3} title={t('tokenImpact.howTrees')} value={format(total.trees)} />
        <Step
          index={4}
          title={t('tokenImpact.howCarbon', { kg: carbonPerTree / 1000 })}
          value={formatCarbon(total.carbon, i18n.language)}
        />
        <Step index={5} title={t('tokenImpact.howPerToken')} value={`÷ ${format(effective)} RC`} />
      </div>
      <p className="text-gray-500 text-[11px]">{t('tokenImpact.howNote')}</p>
    </Card>
  )
}

function TokenSupply({ overview }: { overview: ImpactOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const { totalSupply, totalLocked, totalCertified } = overview.supply
  const { circulating, effective } = tokenSupplyBreakdown(totalSupply, totalLocked, totalCertified)
  const issued = totalSupply + totalCertified
  const percent = (value: number): string =>
    Intl.NumberFormat(i18n.language, { style: 'percent', maximumFractionDigits: 1 }).format(
      issued > 0 ? value / issued : 0
    )
  const rows = [
    { color: 'bg-gray-500', label: t('tokenImpact.inPools'), value: totalLocked },
    { color: 'bg-green-primary', label: t('tokenImpact.circulatingSupply'), value: circulating },
    { color: 'bg-amber-400', label: t('tokenImpact.totalCertified'), value: totalCertified }
  ]

  return (
    <Card title={t('tokenImpact.tokenData')} description={t('tokenImpact.tokenDataDescription')}>
      <div className="h-3 rounded-full overflow-hidden flex bg-card-secondary">
        {rows.map((row) => (
          <div
            key={row.label}
            className={row.color}
            style={{ flexGrow: row.value, minWidth: row.value > 0 ? 3 : 0 }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${row.color}`} />
            <span className="flex-1 text-gray-200 text-sm">{row.label}</span>
            <span className="text-white font-semibold">{format(row.value)} RC</span>
            <span className="w-14 text-right text-gray-400 text-xs">{percent(row.value)}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-card-secondary flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">{t('tokenImpact.totalSupply')}</span>
          <span className="text-white font-semibold">{format(totalSupply)} RC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">{t('tokenImpact.effectiveSupply')}</span>
          <span className="text-white font-semibold">{format(effective)} RC</span>
        </div>
      </div>
    </Card>
  )
}

const STATUS_STYLE = {
  settled: 'bg-green-primary/20 text-green-primary',
  pending: 'bg-amber-400/20 text-amber-300',
  current: 'bg-blue-primary/20 text-blue-primary'
}

function ImpactByEra({ overview }: { overview: ImpactOverview }): JSX.Element {
  const { t } = useTranslation()
  const format = useFormat()
  const { currentEra } = useEra()
  const { eras, isLoading } = useImpactEras(currentEra)
  const [selected, setSelected] = useState<number | null>(null)
  const chosen = eras.find(
    (item) =>
      item.era === (selected ?? eras.find((e) => e.realizedInspections > 0)?.era ?? currentEra)
  )
  const status = chosen
    ? eraImpactStatus(chosen.era, currentEra, overview.settlement.lastSettledEra)
    : null

  return (
    <Card
      title={t('tokenImpact.totalImpactPerEra')}
      description={t('tokenImpact.perEraDescription')}
    >
      {isLoading || !chosen ? (
        <div className="h-32 rounded-xl bg-card-secondary animate-pulse" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {eras.map((item) => (
              <button
                key={item.era}
                onClick={() => setSelected(item.era)}
                className={`h-9 px-4 rounded-full text-sm font-semibold hover:cursor-pointer ${
                  item.era === chosen.era
                    ? 'bg-green-primary text-green-secondary'
                    : 'bg-card-secondary text-white'
                }`}
              >
                {t('tokenImpact.era', { era: item.era })}
                {item.era === currentEra ? ` · ${t('tokenImpact.current')}` : ''}
              </button>
            ))}
          </div>
          {status && (
            <span
              className={`self-start text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[status]}`}
            >
              {t(`tokenImpact.status.${status}`)}
            </span>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Tile value={format(chosen.realizedInspections)} label={t('inspections.title')} />
            <Tile value={format(chosen.trees)} label={t('tokenImpact.treesCounted')} />
            <Tile value={format(chosen.biodiversity)} label={t('tokenImpact.speciesCounted')} />
            <Tile
              value={format(averageTreesPerInspection(chosen.trees, chosen.realizedInspections), 1)}
              label={t('tokenImpact.treesPerInspection')}
            />
          </div>
          {status && (
            <p className="text-gray-500 text-[11px]">{t(`tokenImpact.statusNote.${status}`)}</p>
          )}
        </>
      )}
    </Card>
  )
}

export function RcStatsPage(): JSX.Element {
  const { t } = useTranslation()
  const { overview, isLoading } = useImpactOverview()

  return (
    <ScreenPage pageTitle={t('tokenImpact.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
        {isLoading || !overview ? (
          <div className="h-72 rounded-2xl bg-card-primary animate-pulse" />
        ) : (
          <>
            <SystemImpact overview={overview} />
            <div className="grid grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-4">
                <ImpactPerRc overview={overview} />
                <TokenSupply overview={overview} />
              </div>
              <div className="flex flex-col gap-4">
                <HowItIsCalculated overview={overview} />
                <ImpactByEra overview={overview} />
              </div>
            </div>
            <p className="flex items-center justify-center gap-2 text-gray-400 text-xs opacity-70">
              <img src={RCLogo} className="w-4 h-4" />
              {t('tokenImpact.source')}
            </p>
          </>
        )}
      </div>
    </ScreenPage>
  )
}
