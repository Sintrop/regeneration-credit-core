import { useEffect, useState } from 'react'
import { Header } from '@renderer/components/Header/Header'
import { LatestTransactions } from './components/LatestTransactions/LatestTransactions'
import { LatestTokensTxs } from './components/LatestTokensTxs/LatestTokensTxs'
import { Stats } from './components/Stats/Stats'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { getListTransactionsWeb3Feed } from '@renderer/services/transactionsWeb3'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'

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
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col gap-10 py-30 pl-[320px]">
          <PageTitle title="dashboard" />
          <div className="flex gap-10 w-full">
            <div className="w-full flex flex-col gap-10">
              <section className="w-full p-3">
                <Stats />
              </section>

              <section className="w-full p-3">
                <LatestTransactions txs={listTxs} loading={loading} />
              </section>

              <section className="w-full p-3">
                <LatestTokensTxs txs={listTokenTxs} loading={loading} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
