import { TabItem } from '@renderer/components/TabItem/TabItem'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SendRC } from './SendRC'
import { SendSIN } from './SendSIN'

export function SendTx(): JSX.Element {
  const { t } = useTranslation()
  const [txType, setTxType] = useState<'RC' | 'SIN'>('RC')

  return (
    <div className="flex flex-col my-10">
      <p className="text-gray-400 text-sm">{t('myTokens.sendTransaction')}</p>
      <div className="flex items-center gap-5">
        <TabItem
          value="RC"
          onChange={(value) => setTxType(value as 'RC')}
          isSelected={txType === 'RC'}
          label="RC"
        />

        <TabItem
          value="SIN"
          onChange={(value) => setTxType(value as 'SIN')}
          isSelected={txType === 'SIN'}
          label="SIN"
        />
      </div>

      <div className="mt-3">
        {txType === 'RC' && <SendRC />}
        {txType === 'SIN' && <SendSIN />}
      </div>
    </div>
  )
}
