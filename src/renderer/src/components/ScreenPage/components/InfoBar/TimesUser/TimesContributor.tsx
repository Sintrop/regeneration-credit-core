import { useTranslation } from 'react-i18next'

import { useCanPublishContribution } from '@renderer/domain/Contributor/useCases/useCanPublishContribution'
import { useCanVote } from '@renderer/domain/Vote/useCases/useCanVote'

export function TimesContributor(): JSX.Element {
  const { t } = useTranslation()
  const { canPublish, waitBlocks } = useCanPublishContribution()
  const { isVoter, canVoteBlocks, canVoteNow } = useCanVote()

  return (
    <div className="flex gap-8 items-center">
      <p className="text-gray-300 text-xs">
        {t('infoBar.canPublishContribution')}:{' '}
        <span className="text-white font-semibold text-sm">
          {t(canPublish ? 'common.yes' : 'common.no')}
          {waitBlocks > 0 && ` (${t('common.wait')} ${waitBlocks} ${t('common.blocks')})`}
        </span>
      </p>

      <p className="text-gray-300 text-xs">
        {t('infoBar.isVoter')}:{' '}
        <span className="text-white font-semibold text-sm">
          {t(isVoter ? 'common.yes' : 'common.no')}
        </span>
      </p>

      <p className="text-gray-300 text-xs">
        {t('infoBar.canVoteNow')}:{' '}
        <span className="text-white font-semibold text-sm">
          {t(canVoteNow ? 'common.yes' : 'common.no')}
          {canVoteBlocks > 0 && ` (${t('common.wait')} ${canVoteBlocks} ${t('common.blocks')})`}
        </span>
      </p>
    </div>
  )
}
