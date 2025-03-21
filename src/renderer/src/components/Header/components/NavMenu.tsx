import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function NavMenu(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleNavigateToContracts(): void {
    navigate('/contracts')
  }

  return (
    <nav className="flex items-center gap-10">
      <button className="hover:cursor-pointer" onClick={handleNavigateToContracts}>
        {t('contracts')}
      </button>
    </nav>
  )
}
