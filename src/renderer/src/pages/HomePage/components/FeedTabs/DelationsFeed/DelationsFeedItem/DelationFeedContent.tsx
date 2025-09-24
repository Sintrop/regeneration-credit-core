import { useTranslation } from 'react-i18next'
import { Reported } from './Reported'
import { ValidTag } from '@renderer/components/ValidTag/ValidTag'

interface Props {
  reported: string
  title: string
  description: string
  delationId: number
  thumbsUp: number
  thumbsDown: number
}

export function DelationFeedContent({
  description,
  title,
  reported,
  thumbsDown,
  thumbsUp
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col mt-2 border border-white rounded-2xl p-3 relative">
      <div className="absolute top-3 right-3">
        <ValidTag valid={thumbsUp >= thumbsDown} />
      </div>

      <p className="text-white font-semibold text-sm">{t('feed.reportedAnUser')}</p>

      <Reported reported={reported} />

      <p className="text-sm text-gray-300 mt-3">{t('feed.titleDelation')}</p>
      <p className="text-white text-sm">{title}</p>

      <p className="text-sm text-gray-300 mt-3">{t('feed.description')}</p>
      <p className="text-white text-sm">{description}</p>
    </div>
  )
}
