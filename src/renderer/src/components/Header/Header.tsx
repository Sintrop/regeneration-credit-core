import { useTranslation } from 'react-i18next'
import LogoRC from '../../assets/images/rc.png'
import { ConnectionWalletButton } from './components/ConnectionWalletButton'

export function Header(): JSX.Element {
  const { t } = useTranslation()

  return (
    <header className="w-screen h-[80px] bg-green-header fixed">
      <div className="container mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <img src={LogoRC} alt="Logo regeneration credit" className="w-10 h-10 object-contain" />
          <p className="text-white font-bold text-xl">{t('regenerationCredit')}</p>
        </div>

        <div className="flex items-center gap-5">
          <ConnectionWalletButton />
        </div>
      </div>
    </header>
  )
}
