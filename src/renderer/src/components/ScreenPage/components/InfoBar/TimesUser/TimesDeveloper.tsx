import { useTranslation } from 'react-i18next'

import { useCanPublishReport } from '@renderer/domain/Developer/useCases/useCanPublishReport'

export function TimesDeveloper(): JSX.Element {
  const { t } = useTranslation()
  const { canPublish } = useCanPublishReport()

  return (
    <div className="flex gap-8 items-center">
      <p className="text-gray-300 text-sm">
        {t('infoBar.canPublishReport')}:{' '}
        <span className="text-white font-semibold text-base">
          {t(canPublish ? 'common.yes' : 'common.no')}
        </span>
      </p>
    </div>
  )
}
