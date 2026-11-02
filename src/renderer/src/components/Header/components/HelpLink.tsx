import { useTranslation } from 'react-i18next'
import { MdHelpOutline } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

export function HelpLink(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = pathname === '/help'
  return (
    <button
      onClick={() => navigate('/help')}
      className={`w-9 h-9 rounded-xl flex items-center justify-center hover:cursor-pointer ${
        active
          ? 'bg-green-primary text-green-secondary'
          : 'bg-card-primary text-white hover:bg-card-primary/70'
      }`}
      title={t('help.title')}
    >
      <MdHelpOutline size={20} />
    </button>
  )
}
