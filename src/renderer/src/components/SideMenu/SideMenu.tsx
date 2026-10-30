import { useTranslation } from 'react-i18next'
import { FaGear } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router-dom'

import LogoRC from '../../assets/images/rc.png'
import { Nav } from './components/Nav'

export function SideMenu(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="w-[248px] h-screen fixed left-0 top-0 bg-green-header border-r border-card-primary flex flex-col">
      <button
        className="flex items-center gap-3 h-16 px-5 hover:cursor-pointer shrink-0"
        onClick={() => navigate('/', { replace: true })}
      >
        <img src={LogoRC} alt="" className="w-9 h-9 object-contain" />
        <p className="text-white font-bold text-left leading-tight">
          {t('common.regenerationCredit')}
        </p>
      </button>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Nav />
      </div>

      <div className="px-3 py-3 border-t border-card-primary shrink-0">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-semibold hover:cursor-pointer ${
            pathname === '/settings'
              ? 'bg-green-primary/15 text-green-primary'
              : 'text-gray-200 hover:bg-card-primary'
          }`}
        >
          <FaGear size={18} />
          {t('shell.settings')}
        </button>
      </div>
    </aside>
  )
}
