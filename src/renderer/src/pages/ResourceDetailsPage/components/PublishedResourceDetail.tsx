import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { useContributionValidations } from '@renderer/domain/Contributor/events/useContributionValidations'
import { useReportValidations } from '@renderer/domain/Developer/events/useReportValidations'
import { useResearchValidations } from '@renderer/domain/Researcher/events/useResearchValidations'
import { useVotingContext } from '@renderer/hooks/usePublishedResources'
import {
  PublishedResourceType,
  RESOURCE_SOURCES,
  toPublishedResource
} from '@renderer/services/resources/resourcesService'
import { ResourceValidationProps } from '@renderer/types/validation'
import { cleanResourceText, resourceHeading } from '@renderer/utils/resourceText'
import { PdfTab } from './PdfTab/PdfTab'
import { ValidationsTab } from './ValidationsTab/ValidationsTab'

const TYPE_STYLE: Record<PublishedResourceType, { label: string; badge: string }> = {
  research: { label: 'resourcesList.research', badge: 'bg-green-primary/20 text-green-primary' },
  contribution: {
    label: 'resourcesList.contribution',
    badge: 'bg-blue-primary/20 text-blue-primary'
  },
  report: { label: 'resourcesList.report', badge: 'bg-amber-400/20 text-amber-300' }
}

function DataRow({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  )
}

/** On-chain text, one paragraph per line, without markdown marks or field labels. Short "#" lines stay as headings. */
function ResourceBody({ text }: { text: string }): JSX.Element {
  const lines = text
    .split('\n')
    .map((line) => ({ heading: /^#+\s/.test(line), text: cleanResourceText(line) }))
    .filter((line) => line.text)
  return (
    <div className="flex flex-col gap-2 text-gray-200 leading-relaxed">
      {lines.map((line, index) => (
        <p
          key={index}
          className={line.heading && line.text.length <= 80 ? 'text-white font-semibold' : ''}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}

interface ViewProps {
  type: PublishedResourceType
  id: number
  validations: ResourceValidationProps[]
}

function ResourceDetailView({ type, id, validations }: ViewProps): JSX.Element {
  const { t, i18n } = useTranslation()
  const [tab, setTab] = useState<'file' | 'validations'>('file')
  const voting = useVotingContext()
  const source = RESOURCE_SOURCES[type]
  const { data, isLoading } = useReadContract({
    address: source.address as `0x${string}`,
    abi: source.abi as Abi,
    functionName: source.getter,
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

  const raw = data as { valid?: boolean; invalidatedAt?: bigint }
  const resource = toPublishedResource(type, data)
  const style = TYPE_STYLE[type]
  const heading = resourceHeading(resource.title, resource.body)
  const valid = !!raw.valid
  const votingOpen = valid && !!voting && voting.currentEra[type] === resource.era
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {!valid && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-red-300 font-semibold">
            {t('common.invalidatedResource')}
          </div>
        )}

        <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
              {t(style.label)} #{resource.id}
            </span>
            <span className="text-gray-400 text-xs">
              {t('resourcesList.era', { era: resource.era })}
            </span>
          </div>
          <h2 className="text-white text-2xl font-bold leading-snug">{heading}</h2>
          {heading !== cleanResourceText(resource.body) && <ResourceBody text={resource.body} />}
        </section>

        <div className="flex gap-6 border-b border-card-primary">
          {(['file', 'validations'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`pb-3 -mb-px text-sm font-semibold border-b-2 hover:cursor-pointer ${
                tab === value
                  ? 'border-green-primary text-green-primary'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {value === 'file'
                ? t('resourceDetails.file')
                : `${t('validations')} · ${validations.length}`}
            </button>
          ))}
        </div>

        {tab === 'file' && <PdfTab report={resource.file} />}
        {tab === 'validations' && <ValidationsTab validations={validations} />}
      </div>

      <aside className="w-[320px] shrink-0 flex flex-col gap-4">
        <section className="p-4 rounded-2xl bg-card-primary">
          <UserBadge address={resource.author} label={t('resourcesList.publishedBy')} />
        </section>

        <section className="p-4 rounded-2xl bg-card-primary">
          <DataRow
            label={t('resourceDetails.publishedAtBlock')}
            value={format(resource.createdAtBlock)}
          />
          <DataRow label={t('era')} value={resource.era} />
          <DataRow
            label={t('feed.votes')}
            value={
              voting
                ? `${resource.validationsCount}/${voting.votesNeeded}`
                : resource.validationsCount
            }
          />
          <DataRow label={t('resourceDetails.status')} value={valid ? t('valid') : t('invalid')} />
        </section>

        {votingOpen && (
          <section className="p-4 rounded-2xl bg-card-primary flex flex-col gap-3">
            <p className="text-gray-300 text-sm">{t('resourceDetails.votingOpen')}</p>
            <VoteToInvalidate resourceId={id} resourceType={type} wFull />
          </section>
        )}
        {valid && !votingOpen && voting && (
          <p className="px-1 text-gray-400 text-xs">{t('resourceDetails.votingClosed')}</p>
        )}
      </aside>
    </div>
  )
}

function ResearchDetail({ id }: { id: number }): JSX.Element {
  const { validations } = useResearchValidations({ researchId: id })
  return <ResourceDetailView type="research" id={id} validations={validations} />
}

function ContributionDetail({ id }: { id: number }): JSX.Element {
  const { validations } = useContributionValidations({ contributionId: id })
  return <ResourceDetailView type="contribution" id={id} validations={validations} />
}

function ReportDetail({ id }: { id: number }): JSX.Element {
  const { validations } = useReportValidations({ reportId: id })
  return <ResourceDetailView type="report" id={id} validations={validations} />
}

/** Research, contribution or development report: content, file, author and invalidation vote. */
export function PublishedResourceDetail({
  type,
  id
}: {
  type: PublishedResourceType
  id: number
}): JSX.Element {
  if (type === 'research') return <ResearchDetail id={id} />
  if (type === 'contribution') return <ContributionDetail id={id} />
  return <ReportDetail id={id} />
}
