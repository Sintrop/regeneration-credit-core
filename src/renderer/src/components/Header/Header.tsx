import { useTranslation } from 'react-i18next'
import LogoRC from '../../assets/images/rc.png'
import { useNavigate } from 'react-router-dom'
import { ChainSwitch } from './components/ChainSwitch'
import { FaGear } from 'react-icons/fa6'
import { DocsLink } from './components/DocsLink'

export function Header(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleBackToHome(): void {
    navigate('/', { replace: true })
  }

  function handleGoToSettings(): void {
    navigate('/settings')
  }

  return (
    <header className="w-screen h-[80px] bg-green-header fixed z-10">
      <div className="px-10 flex items-center justify-between h-full">
        <button className="flex items-center gap-3 hover:cursor-pointer" onClick={handleBackToHome}>
          <img src={LogoRC} alt="Logo regeneration credit" className="w-10 h-10 object-contain" />
          <p className="text-white font-bold text-xl">{t('common.regenerationCredit')}</p>
        </button>

        <div className="flex items-center gap-5">
          <DocsLink />
          <ChainSwitch />
          <button onClick={handleGoToSettings} className="hover:cursor-pointer">
            <FaGear size={25} color="white" />
          </button>
        </div>
      </div>
    </header>
  )
}
