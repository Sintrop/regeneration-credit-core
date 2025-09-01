import { useTranslation } from 'react-i18next'

import { useCanPublishResearcher } from '@renderer/domain/Researcher/useCases/useCanPublishResearcher'

export function TimesResearcher(): JSX.Element {
  const { t } = useTranslation()
  const { canPublish, waitBlocks } = useCanPublishResearcher()

  return (
    <div className="flex gap-8 items-center">
      <p className="text-gray-300 text-sm">
        {t('infoBar.canPublishResearch')}:{' '}
        <span className="text-white font-semibold text-base">
          {t(canPublish ? 'common.yes' : 'common.no')}
          {waitBlocks > 0 && ` (${t('common.wait')} ${waitBlocks} ${t('common.blocks')})`}
        </span>
      </p>
    </div>
  )
}
