import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { PublishedResourceType } from '@renderer/services/resources/resourcesService'
import { InspectionDetail } from './components/InspectionDetail'
import { PublishedResourceDetail } from './components/PublishedResourceDetail'

/** Route segment of each published resource type. */
const PUBLISHED_TYPE: Record<string, PublishedResourceType> = {
  researche: 'research',
  contribution: 'contribution',
  report: 'report'
}

export function ResourceDetailsPage(): JSX.Element {
  const { t } = useTranslation()
  const { resourceType, id } = useParams()
  const resourceId = parseInt(id as string)
  const publishedType = PUBLISHED_TYPE[resourceType as string]

  if (publishedType) {
    return (
      <ScreenPage pageTitle={`${t(`resourcesList.${publishedType}`)} #${id}`}>
        <PublishedResourceDetail type={publishedType} id={resourceId} />
      </ScreenPage>
    )
  }

  return (
    <ScreenPage pageTitle={`${t('inspections.inspection')} #${id}`}>
      <InspectionDetail id={resourceId} />
    </ScreenPage>
  )
}
