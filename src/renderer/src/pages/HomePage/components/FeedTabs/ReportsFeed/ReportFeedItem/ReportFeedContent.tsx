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
    <div className="flex flex-col mt-2 border border-white rounded-2xl p-3 relative">
      <div className="absolute top-3 right-3">
        <ValidTag valid={valid} />
      </div>

      <p className="text-white font-semibold text-sm">{t('feed.publishedAReport')}</p>

      <p className="text-sm text-gray-300">{t('feed.description')}</p>
      <p className="text-white text-sm mt-1">{description}</p>

      <button
        className="text-green-500 underline hover:cursor-pointer mt-3 text-start w-fit"
        onClick={handleGoToResourceDetails}
      >
        {t('feed.see')}
      </button>
    </div>
  )
}
