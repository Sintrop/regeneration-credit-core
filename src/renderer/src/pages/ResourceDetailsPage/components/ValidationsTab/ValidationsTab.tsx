import { useTranslation } from 'react-i18next'
import { InspectionValidationItem } from './InspectionValidationItem'
import { ResearchValidationItem } from './ResearchValidationItem'
import { ReportValidationItem } from './ReportValidationItem'
import { ContributionValidationItem } from './ContributionValidationItem'

interface Props {
  validationsCount: number
  resourceId: number
  resourceType: string
}
export function ValidationsTab({ validationsCount, resourceId, resourceType }: Props): JSX.Element {
  const { t } = useTranslation()

  const validations = Array.from({ length: validationsCount }, (_, i) => i).reverse()

  return (
    <div className="flex flex-col">
      {validationsCount === 0 ? (
        <div>
          <p className="text-white">{t('thereAreNotValidations')}</p>
        </div>
      ) : (
        <>
          {validations.map((item) => (
            <ValidationItem
              key={item}
              resourceId={resourceId}
              resourceType={resourceType}
              validation={item}
            />
          ))}
        </>
      )}
    </div>
  )
}

interface ValidationItemProps {
  validation: number
  resourceId: number
  resourceType: string
}
function ValidationItem({
  resourceId,
  resourceType,
  validation
}: ValidationItemProps): JSX.Element {
  if (resourceType === 'inspection') {
    return <InspectionValidationItem resourceId={resourceId} validation={validation} />
  }

  if (resourceType === 'researche') {
    return <ResearchValidationItem resourceId={resourceId} validation={validation} />
  }

  if (resourceType === 'report') {
    return <ReportValidationItem resourceId={resourceId} validation={validation} />
  }

  if (resourceType === 'contribution') {
    return <ContributionValidationItem resourceId={resourceId} validation={validation} />
  }

  return <div />
}
