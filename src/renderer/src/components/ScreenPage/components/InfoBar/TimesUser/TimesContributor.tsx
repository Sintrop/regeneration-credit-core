import { useTranslation } from 'react-i18next'

import { useCanPublishContribution } from '@renderer/domain/Contributor/useCases/useCanPublishContribution'

export function TimesContributor(): JSX.Element {
  const { t } = useTranslation()
  const { canPublish, waitBlocks } = useCanPublishContribution()

  return (
    <div className="flex gap-8 items-center">
      <p className="text-gray-300 text-sm">
        {t('infoBar.canPublishContribution')}:{' '}
        <span className="text-white font-semibold text-base">
          {t(canPublish ? 'common.yes' : 'common.no')}
          {waitBlocks > 0 && ` (${t('common.wait')} ${waitBlocks} ${t('common.blocks')})`}
        </span>
      </p>
    </div>
  )
}
