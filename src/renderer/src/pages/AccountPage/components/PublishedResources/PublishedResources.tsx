import { useTranslation } from 'react-i18next'

import { usePublishedResources } from '@renderer/hooks/usePublishedResources'
import { ResourceCard } from '../../../ResourcesPage/components/ResourceCard'

/** Valid researches, reports or contributions published by this address. */
export function PublishedResources({ address }: { address: string }): JSX.Element {
  const { t } = useTranslation()
  const { resources, isLoading } = usePublishedResources()
  const mine = resources.filter((item) => item.author.toLowerCase() === address.toLowerCase())

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-white font-bold text-lg">{t('profile.publishedResources')}</p>
        {!isLoading && <span className="text-gray-400 text-sm">{mine.length}</span>}
      </div>
      {isLoading ? (
        <div className="h-32 rounded-2xl bg-card-primary animate-pulse" />
      ) : mine.length === 0 ? (
        <p className="p-5 rounded-2xl bg-card-primary text-gray-400">
          {t('profile.noPublishedResources')}
        </p>
      ) : (
        mine.map((resource) => (
          <ResourceCard key={`${resource.type}-${resource.id}`} resource={resource} hideAuthor />
        ))
      )}
    </section>
  )
}
