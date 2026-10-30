import { JSX } from 'react'

import ImageCoin from '@renderer/assets/images/icon-chain.png'

/** The app only runs on the Sintrop network; this chip just names it. */
export function ChainSwitch(): JSX.Element {
  return (
    <div className="px-3 h-9 rounded-xl bg-card-primary flex items-center gap-2">
      <img src={ImageCoin} className="w-6 h-6 object-contain" />
      <p className="text-white font-semibold text-sm">Sintrop</p>
    </div>
  )
}
