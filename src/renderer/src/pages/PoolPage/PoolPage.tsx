import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Abi } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi'

import { ProgressBar } from '@renderer/components/ProgressBar/ProgressBar'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { usePoolEraDetails, usePoolOverview, usePoolUserPosition } from '@renderer/hooks/usePools'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { canUsePool, POOLS, PoolOverview } from '@renderer/services/pools/poolService'
import { POOL_DESCRIPTION_KEY, POOL_NAME_KEY, POOL_SLUG } from '../PoolsPage/poolLabels'

const TYPE_BY_SLUG = Object.fromEntries(
  Object.entries(POOL_SLUG).map(([type, slug]) => [slug, Number(type)])
)

function Stat({
  label,
  value,
  hint
}: {
  label: string
  value: string
  hint?: string
}): JSX.Element {
  return (
    <div className="flex-1 p-3 rounded-xl bg-card-secondary flex flex-col gap-1">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-white font-bold">{value}</span>
      {hint && <span className="text-gray-500 text-[11px]">{hint}</span>}
    </div>
  )
}

function PoolHero({ overview }: { overview: PoolOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const formatBlocks = useBlocksDuration()
  const format = (value: number, digits = 0): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)

  return (
    <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-5">
      <div>
        <h2 className="text-white text-xl font-bold">{t(POOL_NAME_KEY[overview.poolType])}</h2>
        <p className="text-gray-300 text-sm">{t(POOL_DESCRIPTION_KEY[overview.poolType])}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-400 text-xs">{t('pools.distributed')}</p>
            <p className="text-green-primary text-2xl font-bold">
              {format(overview.distributed)} RC
            </p>
          </div>
          <p className="text-gray-300 text-sm">{format(overview.distributedPercentage, 2)}%</p>
        </div>
        <ProgressBar value={overview.distributedPercentage} />
        <p className="text-gray-400 text-xs">
          {t('pools.ofTotal', {
            total: format(overview.totalTokens),
            balance: format(overview.balance)
          })}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <Stat label={t('pools.currentEra')} value={String(overview.currentEra)} />
        <Stat label={t('pools.perEra')} value={`${format(overview.tokensPerEra)} RC`} />
        <Stat
          label={t('pools.epoch')}
          value={String(overview.currentEpoch)}
          hint={t('pools.epochHint')}
        />
        <Stat
          label={t('pools.eraEndsIn')}
          value={formatBlocks(overview.blocksToNextEra).split(' (')[0]}
        />
      </div>
    </section>
  )
}

function UserPositionCard({
  overview,
  onWithdrawn
}: {
  overview: PoolOverview
  onWithdrawn: () => void
}): JSX.Element | null {
  const { t, i18n } = useTranslation()
  const formatBlocks = useBlocksDuration()
  const { address } = useUserContext()
  const { position, isLoading, refetch } = usePoolUserPosition(
    overview.poolType,
    address,
    overview.currentEra
  )
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash })
  const [showTx, setShowTx] = useState(false)
  const format = (value: number): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(value)

  if (isLoading) return <div className="h-40 rounded-2xl bg-card-primary animate-pulse" />
  if (!position) return null

  const ready = position.canWithdraw && !position.blocker
  const emptyEra = position.estimatedTokens <= 0
  const rules = POOLS[overview.poolType].rules

  function withdraw(): void {
    setShowTx(true)
    writeContract({ address: rules.address, abi: rules.abi as Abi, functionName: 'withdraw' })
  }

  return (
    <section className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 flex flex-col gap-4">
      <p className="text-white font-bold">{t('pools.yourPosition')}</p>

      {position.pendingTokens > 0 && !position.blocker && (
        <div>
          <p className="text-gray-400 text-xs">{t('pools.toReceive')}</p>
          <p className="text-green-primary text-3xl font-bold">
            ~{format(position.pendingTokens)} RC
          </p>
          <p className="text-gray-400 text-xs">
            {t('pools.inWithdrawals', { count: position.pendingEras })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t('pools.yourEra')} value={String(position.userEra)} />
        <Stat
          label={t('pools.levelsThisEra', { era: overview.currentEra })}
          value={String(position.currentEraLevels)}
        />
      </div>

      {position.blocker ? (
        <p className="text-amber-300 text-sm">{t(`pools.blocker.${position.blocker}`)}</p>
      ) : position.canWithdraw ? (
        <div className="p-3 rounded-xl bg-green-primary/10 flex flex-col gap-1">
          <p className="text-gray-300 text-xs">
            {t('pools.nextWithdraw', { era: position.userEra })}
          </p>
          {emptyEra ? (
            <p className="text-white text-sm">
              {t('pools.emptyEra', { era: position.userEra, next: position.userEra + 1 })}
            </p>
          ) : (
            <>
              <p className="text-white text-xl font-bold">~{format(position.estimatedTokens)} RC</p>
              <p className="text-gray-400 text-xs">
                {t('pools.estimateDetail', {
                  levels: position.userLevelsInEra,
                  total: position.eraLevels
                })}
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-300 text-sm">
          {t('pools.waitEraEnd', {
            era: position.userEra,
            duration: formatBlocks(position.blocksToUserEraEnd)
          })}
        </p>
      )}

      {ready && (
        <button
          className="h-12 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-50"
          disabled={isPending || receipt.isLoading}
          onClick={withdraw}
        >
          {emptyEra
            ? t('pools.advanceEra', { next: position.userEra + 1 })
            : t('pools.withdrawEra', { era: position.userEra })}
        </button>
      )}
      {ready && position.userEra + 1 < overview.currentEra && (
        <p className="text-gray-400 text-xs">
          {t('pools.oneEraPerWithdraw', { count: overview.currentEra - position.userEra })}
        </p>
      )}

      {showTx && (
        <TransactionLoading
          close={() => setShowTx(false)}
          ok={() => {
            setShowTx(false)
            toast.success(t('pools.withdrawDone'))
            refetch()
            onWithdrawn()
          }}
          isError={isError || receipt.isError}
          isPending={isPending}
          isSuccess={receipt.isSuccess}
          loading={receipt.isLoading}
          errorMessage={error?.message ?? receipt.error?.message ?? ''}
          transactionHash={hash}
        />
      )}
    </section>
  )
}

function EraSection({ overview }: { overview: PoolOverview }): JSX.Element {
  const { t, i18n } = useTranslation()
  const lastClosedEra = Math.max(1, overview.currentEra - 1)
  const [era, setEra] = useState(lastClosedEra)
  const { details, isLoading } = usePoolEraDetails(overview.poolType, era, overview.currentEra)
  const format = (value: number, digits = 0): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)

  useEffect(() => setEra(lastClosedEra), [lastClosedEra])
  const eras = Array.from(
    { length: overview.currentEra },
    (_, index) => overview.currentEra - index
  )

  return (
    <section className="flex flex-col gap-3">
      <p className="text-white text-lg font-bold">{t('pools.erasTitle')}</p>
      <div className="flex flex-wrap gap-2">
        {eras.map((item) => (
          <button
            key={item}
            onClick={() => setEra(item)}
            className={`h-9 px-4 rounded-full text-sm font-semibold hover:cursor-pointer ${
              item === era ? 'bg-green-primary text-green-secondary' : 'bg-card-primary text-white'
            }`}
          >
            {t('pools.eraChip', { era: item })}
            {item === overview.currentEra ? ` · ${t('pools.now')}` : ''}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
        {isLoading || !details ? (
          <div className="h-32 rounded-xl bg-card-secondary animate-pulse" />
        ) : (
          <>
            <span
              className={`self-start text-xs font-semibold px-3 py-1 rounded-full ${
                details.claimable
                  ? 'bg-green-primary/20 text-green-primary'
                  : 'bg-blue-primary/20 text-blue-primary'
              }`}
            >
              {details.claimable ? t('pools.phaseClaimable') : t('pools.phaseCurrent')}
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-xs">{t('pools.withdrawnInEra')}</p>
                  <p className="text-white text-xl font-bold">
                    {format(details.withdrawnTokens)} RC
                  </p>
                </div>
                <p className="text-gray-300 text-sm">{format(details.withdrawnPercentage, 1)}%</p>
              </div>
              <ProgressBar value={details.withdrawnPercentage} />
              <p className="text-gray-400 text-xs">
                {t('pools.eraTokens', { tokens: format(details.tokensToDistribute) })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label={t('pools.levels')} value={String(details.levels)} />
              <Stat label={t('pools.withdrawalsCount')} value={String(details.claimsCount)} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-gray-300 text-sm font-semibold">{t('pools.whoWithdrew')}</p>
              {details.withdrawals.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  {details.claimable ? t('pools.noWithdrawals') : t('pools.noWithdrawalsCurrent')}
                </p>
              ) : (
                details.withdrawals.map((item) => (
                  <div
                    key={`${item.user}-${item.blockNumber}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <UserBadge
                      address={item.user}
                      label={t('myTokens.block', { block: format(item.blockNumber) })}
                    />
                    <span
                      className={`font-bold ${item.amount > 0 ? 'text-green-primary' : 'text-gray-400'}`}
                    >
                      {item.amount > 0 ? `${format(item.amount)} RC` : t('pools.advancedOnly')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export function PoolPage(): JSX.Element {
  const { t } = useTranslation()
  const { poolName } = useParams()
  const poolType = TYPE_BY_SLUG[poolName as string] ?? 1
  const { userType } = useUserContext()
  const { overview, isLoading, refetch } = usePoolOverview(poolType)

  return (
    <ScreenPage pageTitle={t(POOL_NAME_KEY[poolType])}>
      <div className="max-w-[820px] mx-auto flex flex-col gap-5">
        {isLoading || !overview ? (
          <div className="h-60 rounded-2xl bg-card-primary animate-pulse" />
        ) : (
          <>
            <PoolHero overview={overview} />
            {canUsePool(poolType, userType) && (
              <UserPositionCard overview={overview} onWithdrawn={refetch} />
            )}
            <EraSection overview={overview} />
          </>
        )}
      </div>
    </ScreenPage>
  )
}
