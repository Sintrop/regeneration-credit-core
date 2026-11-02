import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ProgressBar } from '@renderer/components/ProgressBar/ProgressBar'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { usePoolOverview } from '@renderer/hooks/usePools'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { canUsePool, POOL_TYPES } from '@renderer/services/pools/poolService'
import { POOL_NAME_KEY, POOL_SLUG } from './poolLabels'

function PoolCard({
  poolType,
  isUserPool
}: {
  poolType: number
  isUserPool: boolean
}): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { overview, isLoading } = usePoolOverview(poolType)
  const format = (value: number): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: 0 }).format(value)

  return (
    <button
      className={`w-full p-5 rounded-2xl bg-card-primary flex flex-col gap-3 text-left hover:bg-card-primary/80 hover:cursor-pointer ${
        isUserPool ? 'border border-green-primary' : ''
      }`}
      onClick={() => navigate(`/pools/${POOL_SLUG[poolType]}`)}
    >
      <div className="flex items-center justify-between">
        <span className="text-white text-lg font-bold">{t(POOL_NAME_KEY[poolType])}</span>
        <span className="flex items-center gap-3">
          {isUserPool && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-primary text-green-secondary">
              {t('pools.yourPool')}
            </span>
          )}
          <span className="text-green-primary text-lg">›</span>
        </span>
      </div>
      {isLoading || !overview ? (
        <div className="h-16 rounded-xl bg-card-secondary animate-pulse" />
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-gray-300">
              <span>
                {t('pools.distributedOf', {
                  distributed: format(overview.distributed),
                  total: format(overview.totalTokens)
                })}
              </span>
              <span>
                {Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(
                  overview.distributedPercentage
                )}
                %
              </span>
            </div>
            <ProgressBar value={overview.distributedPercentage} />
          </div>
          <div className="flex justify-between">
            <span>
              <span className="block text-gray-400 text-xs">{t('pools.perEra')}</span>
              <span className="text-white font-semibold">{format(overview.tokensPerEra)} RC</span>
            </span>
            <span className="text-right">
              <span className="block text-gray-400 text-xs">{t('pools.inPool')}</span>
              <span className="text-white font-semibold">{format(overview.balance)} RC</span>
            </span>
          </div>
        </>
      )}
    </button>
  )
}

export function PoolsPage(): JSX.Element {
  const { t } = useTranslation()
  const { userType } = useUserContext()
  const formatBlocks = useBlocksDuration()
  const { overview } = usePoolOverview(1)
  const mine = POOL_TYPES.filter((type) => canUsePool(type, userType))
  const ordered = [...mine, ...POOL_TYPES.filter((type) => !mine.includes(type))]

  return (
    <ScreenPage pageTitle={t('home.shortcuts.withdrawTokens')}>
      <div className="max-w-[720px] mx-auto flex flex-col gap-4">
        <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-2">
          <p className="text-white font-bold">{t('pools.howItWorksTitle')}</p>
          <p className="text-gray-300 text-sm">{t('pools.howItWorks')}</p>
          {overview && (
            <div className="flex justify-between mt-2 pt-3 border-t border-card-secondary">
              <span>
                <span className="block text-gray-400 text-xs">{t('pools.currentEra')}</span>
                <span className="text-white font-semibold">{overview.currentEra}</span>
              </span>
              <span className="text-right">
                <span className="block text-gray-400 text-xs">{t('pools.eraEndsIn')}</span>
                <span className="text-white font-semibold">
                  {formatBlocks(overview.blocksToNextEra)}
                </span>
              </span>
            </div>
          )}
        </section>
        {ordered.map((type) => (
          <PoolCard key={type} poolType={type} isUserPool={mine.includes(type)} />
        ))}
      </div>
    </ScreenPage>
  )
}
