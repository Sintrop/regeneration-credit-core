import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import ImageCoin from '@renderer/assets/images/icon-chain.png'

/** The app only runs on the Sintrop network; the chip names it and leads to the mining guide. */
export function ChainSwitch(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const active = useLocation().pathname === '/mining'
  return (
    <button
      onClick={() => navigate('/mining')}
      title={t('mining.title')}
      className={`px-3 h-9 rounded-xl flex items-center gap-2 hover:cursor-pointer ${
        active
          ? 'bg-green-primary/20 ring-1 ring-green-primary'
          : 'bg-card-primary hover:bg-card-primary/70'
      }`}
    >
      <img src={ImageCoin} className="w-6 h-6 object-contain" />
      <span className="text-white font-semibold text-sm">Sintrop</span>
    </button>
  )
}
