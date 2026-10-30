import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useVotingContext } from '@renderer/hooks/usePublishedResources'
import {
  DETAILS_SEGMENT,
  PublishedResource,
  PublishedResourceType
} from '@renderer/services/resources/resourcesService'
import { cleanResourceText, resourceHeading } from '@renderer/utils/resourceText'

const TYPE_STYLE: Record<PublishedResourceType, { label: string; badge: string }> = {
  research: { label: 'resourcesList.research', badge: 'bg-green-primary/20 text-green-primary' },
  contribution: {
    label: 'resourcesList.contribution',
    badge: 'bg-blue-primary/20 text-blue-primary'
  },
  report: { label: 'resourcesList.report', badge: 'bg-amber-400/20 text-amber-300' }
}

export function ResourceCard({ resource }: { resource: PublishedResource }): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const voting = useVotingContext()
  const style = TYPE_STYLE[resource.type]
  const heading = resourceHeading(resource.title, resource.body)
  const summary = resource.title ? cleanResourceText(resource.body) : ''
  const votingOpen = !!voting && voting.currentEra[resource.type] === resource.era

  return (
    <article
      className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3 hover:cursor-pointer hover:bg-card-primary/80"
      onClick={() => navigate(`/resource-details/${DETAILS_SEGMENT[resource.type]}/${resource.id}`)}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
          {t(style.label)} #{resource.id}
        </span>
        <span className="text-gray-400 text-xs">
          {t('resourcesList.era', { era: resource.era })}
        </span>
      </div>

      <h3 className="text-white text-base font-bold line-clamp-3">{heading}</h3>

      {votingOpen && voting && (
        <span className="self-start text-xs font-semibold px-3 py-1 rounded-full bg-red-400/15 text-red-300">
          {t('invalidation.openChip', {
            votes: resource.validationsCount,
            needed: voting.votesNeeded
          })}
        </span>
      )}

      {!!summary && <p className="text-gray-300 text-sm line-clamp-3">{summary}</p>}

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-card-secondary">
        <UserBadge address={resource.author} label={t('resourcesList.publishedBy')} />
        <span className="text-green-primary text-sm font-semibold shrink-0">
          {t('resourcesList.open')} ›
        </span>
      </div>
    </article>
  )
}
