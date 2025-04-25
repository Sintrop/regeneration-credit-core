import { useEffect, useState } from 'react'
import { LatestTransactions } from './components/LatestTransactions/LatestTransactions'
import { LatestTokensTxs } from './components/LatestTokensTxs/LatestTokensTxs'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { getListTransactionsWeb3Feed } from '@renderer/services/transactionsWeb3'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { LatestPublications } from './components/LatestPublications/LatestPublications'
import { LatestOffsets } from './components/LatestOffsets/LatestOffsets'

export function HomePage(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [listTxs, setListTxs] = useState<TransactionWeb3Props[]>([])
  const [listTokenTxs, setListTokenTxs] = useState<TransactionWeb3Props[]>([])

  useEffect(() => {
    getTxs()
  }, [])

  async function getTxs(): Promise<void> {
    setLoading(true)
    const response = await getListTransactionsWeb3Feed()
    if (response.success) {
      setListTxs(response.txs)
      setListTokenTxs(response.txs.filter((tx) => tx.method === 'transfer'))
    }
    setLoading(false)
  }

  return (
    <ScreenPage pageTitle="feed">
      <div className="w-full flex flex-col gap-10">
        <div className="flex gap-5 flex-wrap w-full">
          <section className="min-w-[400px] p-3">
            <LatestPublications />
          </section>

          <section className="min-w-[400px] p-3">
            <LatestOffsets />
          </section>
        </div>

        <section className="w-full p-3">
          <LatestTransactions txs={listTxs} loading={loading} />
        </section>

        <section className="w-full p-3">
          <LatestTokensTxs txs={listTokenTxs} loading={loading} />
        </section>
      </div>
    </ScreenPage>
  )
}
