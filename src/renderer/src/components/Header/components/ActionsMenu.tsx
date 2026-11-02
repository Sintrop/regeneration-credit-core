import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdBolt } from 'react-icons/md'

import { UserTimersCard } from '@renderer/components/UserTimersCard/UserTimersCard'
import { useIsDenied } from '@renderer/domain/Community/useCases/useIsDenied'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { useUserTimers } from '@renderer/hooks/useUserTimers'

/** "Your actions" on every screen, with how many are open right now. */
export function ActionsMenu(): JSX.Element | null {
  const { t } = useTranslation()
  const { address, userType } = useUserContext()
  const { isDenied } = useIsDenied({ address: address ?? '' })
  const { timers } = useUserTimers()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent): void => {
      const target = event.target as HTMLElement
      // Dialogs opened from the menu render in document.body; clicks in them are not outside clicks.
      if (target.closest?.('[data-modal-root]')) return
      if (!container.current?.contains(target)) setOpen(false)
    }
    window.addEventListener('mousedown', closeOnOutsideClick)
    return (): void => window.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  if (!address || userType < 1 || userType > 7 || isDenied) return null

  // Offsetting is always open, so counting it would keep the badge permanently on.
  const available = timers.filter(
    (timer) => timer.status === 'available' && timer.key !== 'offset'
  ).length

  return (
    <div ref={container} className="relative">
      <button
        className={`h-9 px-3 rounded-xl flex items-center gap-2 text-sm font-semibold hover:cursor-pointer ${
          open ? 'bg-green-primary text-green-secondary' : 'bg-card-primary text-white'
        }`}
        onClick={() => setOpen((value) => !value)}
        title={t('timers.title')}
      >
        <MdBolt size={18} />
        <span className="hidden 2xl:inline">{t('timers.title')}</span>
        {available > 0 && (
          <span
            className={`min-w-5 h-5 px-1 rounded-full text-xs font-bold flex items-center justify-center ${
              open
                ? 'bg-green-secondary text-green-primary'
                : 'bg-green-primary text-green-secondary'
            }`}
          >
            {available}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-[360px] max-h-[75vh] overflow-y-auto p-3 rounded-2xl bg-card-primary border border-green-primary/20 shadow-2xl">
          <UserTimersCard flat />
        </div>
      )}
    </div>
  )
}
