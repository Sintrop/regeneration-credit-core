import { TransactionWeb3Props } from '@renderer/types/transaction'
import { GoArrowSwitch } from 'react-icons/go'
import { TransactionStatusTag } from './Tags/TransactionStatusTag'
import { TransactionMethodTag } from './Tags/TransactionMethodTag'
import { AddressTx } from './AddressTx'
import { useTranslation } from 'react-i18next'

interface Props {
  tx: TransactionWeb3Props
}

export function TxItem({ tx }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="w-full px-3 py-5 border-b border-container-secondary flex items-center justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <TransactionStatusTag status={tx.status} />

          <TransactionMethodTag method={tx.method} />
        </div>

        <div className="flex items-center gap-5">
          <GoArrowSwitch size={20} color="white" />
          <p className="text-white max-w-[70%] truncate text-ellipsis">{tx.hash}</p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex flex-col gap-5 ">
          <div className="flex items-center justify-end gap-2 max-w-[200px]">
            <p className="text-xs text-gray-500">{t('from')}:</p>
            <AddressTx address={tx.from.hash} />
          </div>
          <div className="flex items-center justify-end gap-2 max-w-[200px]">
            <p className="text-xs text-gray-500">{t('to')}:</p>
            <AddressTx address={tx.to.hash} />
          </div>
        </div>
      </div>
    </div>
  )
}
