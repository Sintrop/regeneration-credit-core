import { ValidTag } from '@renderer/components/ValidTag/ValidTag'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Props {
  description: string
  reportId: number
  valid: boolean
}

export function ReportFeedContent({ reportId, description, valid }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleGoToResourceDetails(): void {
    navigate(`/resource-details/report/${reportId}`)
  }

  return (
    <div className="flex flex-col mt-2">
      <div className="flex justify-end w-full">
        <ValidTag valid={valid} />
      </div>

      <p className="text-gray-300 text-sm text-center">{t('publishedAReport')}</p>

      <p className="text-sm text-gray-300 mt-2">{t('description')}</p>
      <p className="text-white">{description}</p>

      <button
        className="text-green-500 underline hover:cursor-pointer mt-3"
        onClick={handleGoToResourceDetails}
      >
        {t('seeReport')}
      </button>
    </div>
  )
}
