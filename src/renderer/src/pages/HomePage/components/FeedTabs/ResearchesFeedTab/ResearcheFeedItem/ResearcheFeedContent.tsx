import { ValidTag } from '@renderer/components/ValidTag/ValidTag'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Props {
  researchId: number
  title: string
  thesis: string
  valid: boolean
}

export function ResearcheFeedContent({ researchId, thesis, title, valid }: Props): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleGoToResourceDetails(): void {
    navigate(`/resource-details/researche/${researchId}`)
  }

  return (
    <div className="flex flex-col mt-2 border border-white rounded-2xl p-3 relative">
      <div className="absolute top-3 right-3">
        <ValidTag valid={valid} />
      </div>

      <p className="text-white font-semibold text-sm">{t('publishedAResearch')}</p>

      <p className="text-gray-300 text-xs mt-2">{t('title')}</p>
      <p className="text-white text-sm">{title}</p>
      <p className="text-xs text-gray-300 mt-2">{t('thesis')}</p>
      <p className="text-white text-sm">{thesis}</p>

      <button
        className="text-green-500 underline hover:cursor-pointer mt-3 w-fit"
        onClick={handleGoToResourceDetails}
      >
        {t('seeResearch')}
      </button>
    </div>
  )
}
