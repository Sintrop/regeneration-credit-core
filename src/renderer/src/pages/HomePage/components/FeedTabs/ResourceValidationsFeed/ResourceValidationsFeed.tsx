import { useTranslation } from 'react-i18next'
import { ResourceValidationFeedItem } from './ResourceValidationFeedItem'

interface Props {
  resourceId: number
  resourceType: 'report' | 'contribution' | 'inspection' | 'research'
  validationsCount: number
}

export function ResourceValidationsFeed({
  resourceId,
  resourceType,
  validationsCount
}: Props): JSX.Element {
  const { t } = useTranslation()

  if (validationsCount === 0) {
    return <div />
  }

  let validationsIds: number[] = []

  const ids = Array.from({ length: validationsCount }, (_, i) => i)
  validationsIds = ids.reverse()

  return (
    <div className="mt-3 flex flex-col border-t border-container-secondary pt-3">
      <p className="text-xs text-gray-300">
        {t('validations')}: {validationsCount}
      </p>

      <div className="flex flex-col gap-3 mt-2">
        {validationsIds.map((item) => (
          <ResourceValidationFeedItem
            key={item}
            resourceId={resourceId}
            resourceType={resourceType}
            validationId={item}
          />
        ))}
      </div>
    </div>
  )
}
