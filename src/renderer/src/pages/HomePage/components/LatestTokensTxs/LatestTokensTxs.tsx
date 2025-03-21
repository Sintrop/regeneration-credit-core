import { ActivityIndicator } from '@renderer/components/ActivityIndicator/ActivityIndicator'
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
    <section className="">
      <p className="text-white">{t('latestTokenTransactions')}</p>
      {loading ? (
        <div className="flex flex-col items-center mt-10">
          <ActivityIndicator />
        </div>
      ) : (
        <>
          {listTxs.slice(0, 5).map((item) => (
            // <TransactionWeb3Item key={item.hash} transaction={item} />
            <div key={item.hash}>{item.hash}</div>
          ))}
        </>
      )}
    </section>
  )
}
