import { useTranslation } from 'react-i18next'
import LogoRC from '../../assets/images/rc.png'
import { ConnectionWalletButton } from './components/ConnectionWalletButton'
import { useNavigate } from 'react-router-dom'
import { NavMenu } from './components/NavMenu'

export function Header(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleBackToHome(): void {
    navigate('/', { replace: true })
  }

  return (
    <header className="w-screen h-[80px] bg-green-header fixed z-10">
      <div className="px-10 flex items-center justify-between h-full">
        <button className="flex items-center gap-3 hover:cursor-pointer" onClick={handleBackToHome}>
          <img src={LogoRC} alt="Logo regeneration credit" className="w-10 h-10 object-contain" />
          <p className="text-white font-bold text-xl">{t('regenerationCredit')}</p>
        </button>

        <div className="flex items-center gap-5">
          <NavMenu />
          <ConnectionWalletButton />
        </div>
      </div>
    </header>
  )
}
