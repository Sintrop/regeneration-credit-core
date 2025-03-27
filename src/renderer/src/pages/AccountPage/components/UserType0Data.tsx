import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function UserType0Data(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  function handleGoToRegister(): void {
    navigate('/register')
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('youAreNotRegistered')}</p>

      <button
        className="text-white font-semibold rounded-2xl bg-blue-primary hover:cursor-pointer h-10 w-fit px-10"
        onClick={handleGoToRegister}
      >
        {t('register')}
      </button>
    </div>
  )
}
