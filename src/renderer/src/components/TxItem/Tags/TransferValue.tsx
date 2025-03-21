import { getTxData } from '@renderer/services/transactionsWeb3'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { useEffect, useState } from 'react'
import { formatEther } from 'viem'
import RCIcon from '../../../assets/images/rc.png'

interface Props {
  txHash: string
}
export function TransferValue({ txHash }: Props): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    handleGetTxData()
  }, [txHash])

  async function handleGetTxData(): Promise<void> {
    if (!txHash) {
      return
    }
    setLoading(true)

    const response = await getTxData(txHash)
    if (response.success) {
      if (response.txData) getTokensWithdraw(response.txData)
    }

    setLoading(false)
  }

  function getTokensWithdraw(tx: TransactionWeb3Props): void {
    if (tx.token_transfers.length === 0) {
      setValue(0)
      return
    }

    const transfer0 = tx.token_transfers[0]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const valueFromWei = parseInt(formatEther(transfer0.total.value))
    setValue(valueFromWei)
  }

  return (
    <div className="bg-container-secondary rounded-md px-3 py-1 flex items-center gap-2">
      <img src={RCIcon} className="w-5 h-5 rounded-full object-contain" />
      <p className="text-white text-sm leading-2.5">{Intl.NumberFormat('pt-BR').format(value)}</p>
    </div>
  )
}
