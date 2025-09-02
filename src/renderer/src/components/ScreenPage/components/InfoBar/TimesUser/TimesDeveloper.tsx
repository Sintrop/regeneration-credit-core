import { useTranslation } from 'react-i18next'

import { useCanPublishReport } from '@renderer/domain/Developer/useCases/useCanPublishReport'

export function TimesDeveloper(): JSX.Element {
  const { t } = useTranslation()
  const { canPublish, waitBlocks } = useCanPublishReport()

  return (
    <div className="flex gap-8 items-center">
      <p className="text-gray-300 text-xs">
        {t('infoBar.canPublishReport')}:{' '}
        <span className="text-white font-semibold text-sm">
          {t(canPublish ? 'common.yes' : 'common.no')}
          {waitBlocks > 0 && ` (${t('common.wait')} ${waitBlocks} ${t('common.blocks')})`}
        </span>
      </p>
    </div>
  )
}
