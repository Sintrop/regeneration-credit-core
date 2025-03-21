import { TransactionWeb3Props } from '@renderer/types/transaction'
import { GoArrowSwitch } from 'react-icons/go'
import { TransactionStatusTag } from './Tags/TransactionStatusTag'
import { TransactionMethodTag } from './Tags/TransactionMethodTag'

interface Props {
  tx: TransactionWeb3Props
}

export function TxItem({ tx }: Props): JSX.Element {
  return (
    <div className="w-full px-3 py-5 border-b border-container-secondary flex items-center justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-3">
          <TransactionStatusTag status={tx.status} />

          <TransactionMethodTag method={tx.method} />
        </div>

        <div className="flex items-center gap-5">
          <GoArrowSwitch size={20} color="white" />
          <p className="text-white">{tx.hash}</p>
        </div>
      </div>
    </div>
  )
}
