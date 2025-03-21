import { ActivityIndicator } from '@renderer/components/ActivityIndicator/ActivityIndicator'
import { TxItem } from '@renderer/components/TxItem/TxItem'
import { getListTransactionsWeb3Feed } from '@renderer/services/transactionsWeb3'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LatestTokensTxs(): JSX.Element {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [listTxs, setListTxs] = useState<TransactionWeb3Props[]>([])

  useEffect(() => {
    getTxs()
  }, [])

  async function getTxs(): Promise<void> {
    setLoading(true)
    const response = await getListTransactionsWeb3Feed()
    if (response.success) {
      setListTxs(response.txs)
    }
    setLoading(false)
  }

  return (
    <section className="bg-container-primary rounded-2xl flex flex-col overflow-hidden">
      <div className="w-full px-5 pb-1 pt-2 bg-container-secondary">
        <p className="text-white">{t('latestTokenTransactions')}</p>
      </div>
      {loading ? (
        <div className="flex flex-col items-center mt-10">
          <ActivityIndicator />
        </div>
      ) : (
        <>
          {listTxs.slice(0, 5).map((item) => (
            <TxItem key={item.hash} tx={item} />
          ))}
        </>
      )}
    </section>
  )
}
