import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ActionComponent } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/ActionComponent/ActionComponent'
import { useIsDenied } from '@renderer/domain/Community/useCases/useIsDenied'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { useUserTimers } from '@renderer/hooks/useUserTimers'
import { TimerRow as Row, timerRows } from '@renderer/services/timers/timerActions'
import { UserTimer } from '@renderer/services/timers/userTimers'

const STATUS_COLOR: Record<UserTimer['status'], string> = {
  available: 'bg-green-primary',
  waiting: 'bg-amber-400',
  inProgress: 'bg-blue-primary',
  blocked: 'bg-red-400',
  done: 'bg-gray-400'
}

function useTimerDescription(): (timer: UserTimer) => string {
  const { t } = useTranslation()
  const formatBlocks = useBlocksDuration()

  return (timer: UserTimer): string => {
    const duration = timer.blocks ? formatBlocks(timer.blocks) : ''
    switch (timer.status) {
      case 'available':
        return t('timers.availableNow')
      case 'waiting':
        return timer.reason === 'eraEnding'
          ? t('timers.opensNextEra', { duration })
          : t('timers.availableIn', { duration })
      case 'inProgress':
        return timer.key === 'requestInspection'
          ? t('timers.pendingInspection')
          : t('timers.inspectionInProgress', { duration })
      case 'blocked':
        return t(`timers.blocked.${timer.reason}`)
      case 'done':
        return t('timers.missionComplete')
    }
  }
}

function RowContent({
  row,
  description,
  onClick
}: {
  row: Row
  description: string
  onClick?: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const { status } = row.timer
  const actionable = !!onClick && (status === 'available' || status === 'inProgress')

  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left ${
        actionable ? 'hover:bg-card-secondary hover:cursor-pointer' : 'cursor-default'
      }`}
      onClick={actionable ? onClick : undefined}
      disabled={!actionable}
    >
      <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${STATUS_COLOR[status]}`} />
      <span className="flex-1 min-w-0">
        <span className="block text-white text-sm">{t(row.label)}</span>
        <span
          className={`block text-xs ${status === 'available' ? 'text-green-primary' : 'text-gray-400'}`}
        >
          {description}
        </span>
      </span>
      {actionable && <span className="text-green-primary text-lg">›</span>}
    </button>
  )
}

/** Every time-gated action of the connected user, read from the contracts; each row opens its action. */
export function UserTimersCard(): JSX.Element | null {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { address, userType } = useUserContext()
  const { isDenied } = useIsDenied({ address: address ?? '' })
  const { timers, lastPublishedAt, isLoading } = useUserTimers()
  const describe = useTimerDescription()

  if (!address || userType === 0 || userType === 8 || isDenied) return null
  if (!isLoading && timers.length === 0) return null

  const rows = timerRows(timers, userType)
  const available = timers.filter((timer) => timer.status === 'available').length

  return (
    <section className="p-4 rounded-2xl bg-card-primary flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-white font-bold">{t('timers.title')}</p>
        {available > 0 && (
          <span className="px-2 h-6 rounded-full bg-green-primary text-green-secondary text-xs font-bold flex items-center">
            {available}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-10 rounded-xl bg-skeleton" />
          ))}
        </div>
      ) : (
        rows.map((row) => {
          const description = describe(row.timer)
          const target = row.target
          if (target?.type === 'modal') {
            return (
              <ActionComponent
                key={row.id}
                actionName={target.actionName}
                addressContract={target.addressContract}
                abi={target.abi}
                userTypeToInvite={target.userTypeToInvite}
                lastPublishedWork={lastPublishedAt}
                label={row.label.startsWith('actions.') ? row.label.slice(8) : undefined}
                renderTrigger={(open) => (
                  <RowContent row={row} description={description} onClick={open} />
                )}
              />
            )
          }
          if (target?.type === 'route') {
            const path = target.path
            return (
              <RowContent
                key={row.id}
                row={row}
                description={description}
                onClick={() => navigate(path)}
              />
            )
          }
          return <RowContent key={row.id} row={row} description={description} />
        })
      )}
    </section>
  )
}
