import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useInspectionValidations } from '@renderer/domain/Inspection/events/useInspectionValidations'
import { useVotingContext } from '@renderer/hooks/usePublishedResources'
import { useProtocolRules } from '@renderer/hooks/useProtocolRules'
import { inspectionAbi, inspectionAddress } from '@renderer/services/contracts'
import {
  InspectionStatus,
  inspectionStatus,
  toInspectionSummary
} from '@renderer/services/inspections/inspectionsService'
import { PdfTab } from './PdfTab/PdfTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

const STATUS_STYLE: Record<InspectionStatus, string> = {
  open: 'bg-amber-400/15 text-amber-300',
  accepted: 'bg-blue-primary/20 text-blue-primary',
  realized: 'bg-green-primary/20 text-green-primary',
  invalidated: 'bg-red-400/15 text-red-300',
  expired: 'bg-orange-400/15 text-orange-300'
}

type Tab = 'report' | 'photos' | 'validations'

function Stat({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="flex-1 p-4 rounded-2xl bg-card-secondary">
      <p className="text-white text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  )
}

/** Inspection results, the inspector's report and photos, and the invalidation vote. */
export function InspectionDetail({ id }: { id: number }): JSX.Element {
  const { t, i18n } = useTranslation()
  const [tab, setTab] = useState<Tab>('report')
  const { validations } = useInspectionValidations({ inspectionId: id })
  const { blockNumber } = useCurrentBlock()
  const { rules } = useProtocolRules()
  const voting = useVotingContext()
  const { data, isLoading } = useReadContract({
    address: inspectionAddress as `0x${string}`,
    abi: inspectionAbi as Abi,
    functionName: 'getInspection',
    args: [BigInt(id)]
  })

  if (isLoading || !data) {
    return (
      <div className="flex gap-6 animate-pulse">
        <div className="flex-1 h-72 rounded-2xl bg-card-primary" />
        <div className="w-[320px] h-72 rounded-2xl bg-card-primary" />
      </div>
    )
  }

  const raw = data as { proofPhotos?: string; justificationReport?: string }
  const inspection = toInspectionSummary(data)
  const status = inspectionStatus(
    inspection,
    blockNumber,
    rules?.blocksToExpireAcceptedInspection ?? Infinity
  )
  const format = (value: number): string =>
    value ? Intl.NumberFormat(i18n.language).format(value) : '—'
  const votingOpen =
    status === 'realized' && !!voting && voting.currentEra.inspection === inspection.inspectedAtEra
  const hasResult = status === 'realized' || status === 'invalidated'
  const tabs: Tab[] = hasResult ? ['report', 'photos', 'validations'] : ['validations']
  const current = tabs.includes(tab) ? tab : tabs[0]
  const tabLabel: Record<Tab, string> = {
    report: t('report'),
    photos: t('proofPhotos'),
    validations: `${t('validations')} · ${validations.length}`
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {status === 'invalidated' && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-red-300 font-semibold">
            {t('common.invalidatedResource')}
          </div>
        )}

        <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold">
              {t('inspections.inspection')} #{id}
            </h2>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[status]}`}
            >
              {t(`inspections.status.${status}`)}
            </span>
          </div>
          {hasResult ? (
            <div className="flex gap-3">
              <Stat label={t('trees')} value={inspection.treesResult} />
              <Stat label={t('biodiversity')} value={inspection.biodiversityResult} />
              <Stat label={t('regenerationScore')} value={inspection.regenerationScore} />
            </div>
          ) : (
            <p className="text-gray-300 text-sm">{t('inspectionDetails.noResultYet')}</p>
          )}
        </section>

        <div className="flex gap-6 border-b border-card-primary">
          {tabs.map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`pb-3 -mb-px text-sm font-semibold border-b-2 hover:cursor-pointer ${
                current === value
                  ? 'border-green-primary text-green-primary'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {tabLabel[value]}
            </button>
          ))}
        </div>

        {current === 'report' && <PdfTab report={raw.justificationReport} />}
        {current === 'photos' && <PdfTab report={raw.proofPhotos} />}
        {current === 'validations' && <ValidationsTab validations={validations} />}
      </div>

      <aside className="w-[320px] shrink-0 flex flex-col gap-4">
        <section className="p-4 rounded-2xl bg-card-primary flex flex-col gap-4">
          <UserBadge address={inspection.regenerator} label={t('regenerator')} />
          {status !== 'open' && <UserBadge address={inspection.inspector} label={t('inspector')} />}
        </section>

        <section className="p-4 rounded-2xl bg-card-primary">
          <DataRow label={t('createdAt')} value={format(inspection.createdAt)} />
          <DataRow label={t('acceptedAt')} value={format(inspection.acceptedAt)} />
          <DataRow label={t('inspectedAt')} value={format(inspection.inspectedAt)} />
          <DataRow label={t('inspectedAtEra')} value={inspection.inspectedAtEra || '—'} />
          <DataRow
            label={t('feed.votes')}
            value={
              voting
                ? `${inspection.validationsCount}/${voting.votesNeeded}`
                : inspection.validationsCount
            }
          />
        </section>

        {votingOpen && (
          <section className="p-4 rounded-2xl bg-card-primary flex flex-col gap-3">
            <p className="text-gray-300 text-sm">{t('inspectionDetails.voteHint')}</p>
            <VoteToInvalidate resourceId={id} resourceType="inspection" wFull />
          </section>
        )}
        {status === 'realized' && !votingOpen && voting && (
          <p className="px-1 text-gray-400 text-xs">{t('inspectionDetails.votingClosed')}</p>
        )}
      </aside>
    </div>
  )
}
