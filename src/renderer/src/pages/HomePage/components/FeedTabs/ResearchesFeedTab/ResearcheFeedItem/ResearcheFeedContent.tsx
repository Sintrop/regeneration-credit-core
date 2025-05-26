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
    <div className="flex flex-col mt-2">
      <div className="flex justify-end w-full">
        <ValidTag valid={valid} />
      </div>

      <p className="text-gray-300 text-sm text-center">{t('publishedAResearch')}</p>

      <p className="text-gray-300 text-sm mt-2">{t('title')}</p>
      <p className="text-white">{title}</p>
      <p className="text-sm text-gray-300 mt-2">{t('thesis')}</p>
      <p className="text-white">{thesis}</p>

      <button
        className="text-green-500 underline hover:cursor-pointer mt-3"
        onClick={handleGoToResourceDetails}
      >
        {t('seeResearch')}
      </button>
    </div>
  )
}
