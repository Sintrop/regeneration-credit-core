import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Icon, IconName } from '@renderer/components/Icon/Icon'

const SHORTCUTS: { path: string; icon: IconName; label: string }[] = [
  { path: '/my-tokens', icon: 'myTokens', label: 'home.shortcuts.myTokens' },
  { path: '/pools', icon: 'pools', label: 'home.shortcuts.withdrawTokens' },
  { path: '/market', icon: 'rc', label: 'home.shortcuts.market' },
  { path: '/impact-calculator', icon: 'impactCalculator', label: 'home.shortcuts.calculator' },
  { path: '/rcstats', icon: 'rcStats', label: 'home.shortcuts.impact' },
  { path: '/community', icon: 'community', label: 'home.shortcuts.community' },
  { path: '/inspections', icon: 'inspections', label: 'home.shortcuts.inspections' },
  { path: '/resources', icon: 'researches', label: 'home.shortcuts.resources' }
]

export function HomeShortcuts(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-8 gap-1">
      {SHORTCUTS.map((shortcut) => (
        <button
          key={shortcut.path}
          className="flex flex-col items-center gap-2 py-2 rounded-2xl hover:bg-card-primary hover:cursor-pointer group"
          onClick={() => navigate(shortcut.path)}
        >
          <span className="w-12 h-12 rounded-2xl flex items-center justify-center bg-card-primary border border-green-primary/20 group-hover:border-green-primary/60">
            <Icon name={shortcut.icon} size={24} />
          </span>
          <span className="w-full text-white text-[11px] text-center leading-tight hyphens-auto">
            {t(shortcut.label)}
          </span>
        </button>
      ))}
    </div>
  )
}
