import { Icon, IconName } from '@renderer/components/Icon/Icon'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MdPersonOutline } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

import { useUserContext } from '@renderer/hooks/useUserContext'

interface NavEntry {
  label: string
  path: string
  icon?: IconName
  iconNode?: ReactNode
}

interface NavSection {
  title?: string
  items: (NavEntry & { connectedOnly?: boolean })[]
}

/** Grouped by what the user came to do: their account, the network, the impact, the internals. */
const SECTIONS: NavSection[] = [
  {
    items: [{ icon: 'dashboard', label: 'feed.title', path: '/' }]
  },
  {
    title: 'nav.myAccount',
    items: [
      {
        iconNode: <MdPersonOutline size={21} />,
        label: 'shell.myProfile',
        path: '/account',
        connectedOnly: true
      },
      { icon: 'myTokens', label: 'myTokens.title', path: '/my-tokens' },
      { icon: 'pools', label: 'pools.title', path: '/pools' }
    ]
  },
  {
    title: 'nav.network',
    items: [
      { icon: 'community', label: 'community.title', path: '/community' },
      { icon: 'inspections', label: 'resources.inspections', path: '/inspections' },
      { icon: 'researches', label: 'resources.researches', path: '/researches' },
      { icon: 'development', label: 'resources.development', path: '/development' },
      { icon: 'contributions', label: 'resources.contributions', path: '/contributions' }
    ]
  },
  {
    title: 'nav.impact',
    items: [
      { icon: 'rcStats', label: 'tokenImpact.title', path: '/rcstats' },
      { icon: 'impactCalculator', label: 'impactCalculator.title', path: '/impact-calculator' },
      { icon: 'rcIndex', label: 'rcIndex.title', path: '/rc-index' }
    ]
  },
  {
    title: 'nav.advanced',
    items: [
      { icon: 'contracts', label: 'contracts.title', path: '/contracts' },
      { icon: 'ipfs', label: 'IPFS', path: '/ipfs' }
    ]
  }
]

function isActive(current: string, path: string): boolean {
  if (path === '/') return current === '/'
  return current === path || current.startsWith(`${path}/`)
}

export function Nav(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { address } = useUserContext()

  return (
    <nav className="flex flex-col gap-5">
      {SECTIONS.map((section, index) => (
        <div key={section.title ?? index} className="flex flex-col gap-1">
          {section.title && (
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {t(section.title)}
            </p>
          )}
          {section.items.map((item) => {
            if (item.connectedOnly && !address) return null
            const active = isActive(pathname, item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-semibold hover:cursor-pointer duration-150 ${
                  active
                    ? 'bg-green-primary/15 text-green-primary'
                    : 'text-gray-200 hover:bg-card-primary'
                }`}
              >
                {item.iconNode ?? (item.icon && <Icon name={item.icon} size={20} />)}
                {t(item.label)}
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
