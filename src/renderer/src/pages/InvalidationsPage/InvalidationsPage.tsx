import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdGavel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { ProgressBar } from '@renderer/components/ProgressBar/ProgressBar'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useInvalidations } from '@renderer/hooks/useInvalidations'
import {
  CaseStatus,
  InvalidationCase,
  InvalidationRules
} from '@renderer/services/invalidations/invalidationsService'
import { DETAILS_SEGMENT } from '@renderer/services/resources/resourcesService'

type Filter = 'all' | 'user' | 'resource'

const KIND_LABEL: Record<InvalidationCase['kind'], string> = {
  user: 'invalidation.kind.user',
  research: 'resourcesList.research',
  contribution: 'resourcesList.contribution',
  report: 'resourcesList.report',
  inspection: 'invalidation.kind.inspection'
}

const STATUS_STYLE: Record<CaseStatus, string> = {
  invalidated: 'bg-red-500/20 text-red-300',
  open: 'bg-green-primary/20 text-green-primary',
  closed: 'bg-card-secondary text-gray-300'
}

/** Public record of every invalidation vote and its outcome, read from the contract events. */
export function InvalidationsPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { overview, isLoading, isError } = useInvalidations()
  const [filter, setFilter] = useState<Filter>('all')
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)

  const cases = overview?.cases ?? []
  const shown = cases.filter((c) =>
    filter === 'all' ? true : filter === 'user' ? c.kind === 'user' : c.kind !== 'user'
  )
  const totalVotes = cases.reduce((sum, c) => sum + c.votes.length, 0)
  const invalidatedUsers = cases.filter((c) => c.kind === 'user' && c.status === 'invalidated')
  const invalidatedResources = cases.filter((c) => c.kind !== 'user' && c.status === 'invalidated')
  const counts: Record<Filter, number> = {
    all: cases.length,
    user: cases.filter((c) => c.kind === 'user').length,
    resource: cases.filter((c) => c.kind !== 'user').length
  }

  return (
    <ScreenPage pageTitle={t('invalidation.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/20 flex flex-col gap-5">
          <p className="text-gray-300 text-sm leading-relaxed">{t('invalidation.description')}</p>
          <div className="grid grid-cols-4 gap-3">
            <Stat
              value={overview ? format(overview.rules.votesToInvalidate) : '—'}
              label={t('invalidation.stats.votesNeeded')}
              highlight
            />
            <Stat
              value={overview ? format(totalVotes) : '—'}
              label={t('invalidation.stats.votes')}
            />
            <Stat
              value={overview ? format(invalidatedUsers.length) : '—'}
              label={t('invalidation.stats.users')}
            />
            <Stat
              value={overview ? format(invalidatedResources.length) : '—'}
              label={t('invalidation.stats.resources')}
            />
          </div>
        </section>

        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="flex gap-2">
              {(['all', 'user', 'resource'] as Filter[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`h-9 px-4 rounded-full text-sm font-semibold flex items-center gap-2 hover:cursor-pointer ${
                    filter === item
                      ? 'bg-green-primary text-green-secondary'
                      : 'bg-card-primary text-white'
                  }`}
                >
                  {t(`invalidation.filter.${item}`)}
                  <span className="opacity-70">{format(counts[item])}</span>
                </button>
              ))}
            </div>

            {isLoading ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-card-primary animate-pulse" />
              ))
            ) : isError ? (
              <Empty text={t('invalidation.error')} />
            ) : shown.length === 0 ? (
              <Empty text={t('invalidation.empty')} hint={t('invalidation.emptyHint')} />
            ) : (
              shown.map((item) => (
                <CaseCard
                  key={`${item.kind}-${item.target}-${item.era ?? ''}`}
                  item={item}
                  needed={overview?.rules.votesToInvalidate ?? 0}
                />
              ))
            )}
          </div>

          {overview && <RulesCard rules={overview.rules} />}
        </div>
      </div>
    </ScreenPage>
  )
}

function Stat({
  value,
  label,
  highlight
}: {
  value: string
  label: string
  highlight?: boolean
}): JSX.Element {
  return (
    <div className="p-4 rounded-xl bg-card-secondary">
      <p className={`text-2xl font-bold ${highlight ? 'text-green-primary' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

function Empty({ text, hint }: { text: string; hint?: string }): JSX.Element {
  return (
    <div className="p-10 rounded-2xl bg-card-primary flex flex-col items-center gap-3 text-center">
      <MdGavel className="text-gray-400" size={36} />
      <p className="text-white font-semibold">{text}</p>
      {hint && <p className="text-gray-400 text-sm max-w-[460px]">{hint}</p>}
    </div>
  )
}

function CaseCard({ item, needed }: { item: InvalidationCase; needed: number }): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)
  const resourcePath =
    item.kind === 'inspection'
      ? `/resource-details/inspection/${item.target}`
      : item.kind !== 'user'
        ? `/resource-details/${DETAILS_SEGMENT[item.kind]}/${item.target}`
        : ''

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex flex-col gap-2">
          <span className="text-gray-400 text-xs">
            {t(KIND_LABEL[item.kind])}
            {item.kind === 'user' && item.era !== undefined && (
              <> · {t('resourcesList.era', { era: item.era })}</>
            )}
          </span>
          {item.kind === 'user' ? (
            <UserBadge address={item.target} />
          ) : (
            <button
              onClick={() => navigate(resourcePath)}
              className="text-white font-bold text-left hover:underline hover:cursor-pointer"
            >
              {t(KIND_LABEL[item.kind])} #{item.target}
            </button>
          )}
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[item.status]}`}
        >
          {t(`invalidation.status.${item.status}`)}
        </span>
      </div>

      {item.votes.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('invalidation.deniedByPenalties')}</p>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span>
                {item.status === 'open'
                  ? t('invalidation.votesOf', { votes: item.votes.length, needed })
                  : t('invalidation.votesCount', { count: item.votes.length })}
              </span>
              <span>{t('invalidation.lastBlock', { block: format(item.lastBlock) })}</span>
            </div>
            <ProgressBar
              value={
                item.status === 'invalidated'
                  ? 100
                  : (item.votes.length / Math.max(1, needed)) * 100
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            {item.votes.map((vote, index) => (
              <div key={index} className="p-3 rounded-xl bg-card-secondary flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <UserBadge address={vote.validator} label={t('invalidation.voter')} />
                  <span className="shrink-0 text-gray-400 text-xs">
                    {t('invalidation.block', { block: format(vote.blockNumber) })}
                  </span>
                </div>
                {vote.justification && (
                  <p className="text-white text-sm break-words">{vote.justification}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function RulesCard({ rules }: { rules: InvalidationRules }): JSX.Element {
  const { t, i18n } = useTranslation()
  const formatBlocks = useBlocksDuration()
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)

  const items = [
    t('invalidation.rules.voters'),
    t('invalidation.rules.threshold', {
      votes: format(rules.votesToInvalidate),
      voters: format(rules.votersCount)
    }),
    t('invalidation.rules.interval', { duration: formatBlocks(rules.timeBetweenVotes) }),
    t('invalidation.rules.resources', { penalties: rules.maxPenalties }),
    t('invalidation.rules.users')
  ]

  return (
    <aside className="w-[340px] shrink-0 p-5 rounded-2xl bg-card-primary flex flex-col gap-3 sticky top-0">
      <p className="text-white font-bold">{t('invalidation.rules.title')}</p>
      <ol className="flex flex-col gap-3">
        {items.map((text, index) => (
          <li key={index} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
            <span className="shrink-0 w-6 h-6 rounded-full bg-card-secondary text-green-primary text-xs font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <p className="text-gray-500 text-xs">{t('invalidation.rules.source')}</p>
    </aside>
  )
}
