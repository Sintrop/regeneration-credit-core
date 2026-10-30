import { Icon, IconName } from '@renderer/components/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavEntry {
  label: string
  path: string
  icon?: IconName
}

const SECTIONS: { title: string; items: NavEntry[] }[] = [
  {
    title: 'nav.explore',
    items: [
      { icon: 'dashboard', label: 'feed.title', path: '/' },
      { icon: 'myTokens', label: 'myTokens.title', path: '/my-tokens' },
      { icon: 'pools', label: 'pools.title', path: '/pools' },
      { icon: 'impactCalculator', label: 'impactCalculator.title', path: '/impact-calculator' },
      { icon: 'rcStats', label: 'tokenImpact.title', path: '/rcstats' },
      { icon: 'rcIndex', label: 'rcIndex.title', path: '/rc-index' }
    ]
  },
  {
    title: 'nav.community',
    items: [
      { icon: 'community', label: 'community.title', path: '/community' },
      { icon: 'inspections', label: 'resources.inspections', path: '/inspections' },
      { icon: 'researches', label: 'resources.researches', path: '/researches' },
      { icon: 'development', label: 'resources.development', path: '/development' },
      { icon: 'contributions', label: 'resources.contributions', path: '/contributions' }
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

  return (
    <nav className="flex flex-col gap-6">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {t(section.title)}
          </p>
          {section.items.map((item) => {
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
                {item.icon && <Icon name={item.icon} size={20} />}
                {t(item.label)}
              </button>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
