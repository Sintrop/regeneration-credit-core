import { useTranslation } from 'react-i18next'
import { Reported } from './Reported'

interface Props {
  reported: string
  title: string
  description: string
  delationId: number
}

export function DelationFeedContent({ description, title, reported }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col mt-2 border border-white rounded-2xl p-3 relative">
      <p className="text-white font-semibold text-sm">{t('feed.reportedAnUser')}</p>

      <Reported reported={reported} />

      <p className="text-sm text-gray-300 mt-3">{t('feed.titleDelation')}</p>
      <p className="text-white text-sm">{title}</p>

      <p className="text-sm text-gray-300 mt-3">{t('feed.description')}</p>
      <p className="text-white text-sm">{description}</p>
    </div>
  )
}
