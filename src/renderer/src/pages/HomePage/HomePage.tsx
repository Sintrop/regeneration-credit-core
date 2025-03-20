import { useEffect, useState } from 'react'
import { Header } from '@renderer/components/Header/Header'
import {
  getListTransactionsWeb3Feed,
  paginateListTransactionsWeb3
} from '@renderer/services/transactionsWeb3'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { PageSelect } from './components/PageSelect'
import { ActivityIndicator } from '@renderer/components/ActivityIndicator/ActivityIndicator'

export function HomePage(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [atualPage, setAtualPage] = useState(1)
  const [listTxs, setListTxs] = useState<TransactionWeb3Props[]>([])
  const [listAtualPage, setListAtualPage] = useState<TransactionWeb3Props[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    getTxs()
  }, [])

  useEffect(() => {
    pageChanged()
  }, [atualPage])

  async function getTxs(): Promise<void> {
    setLoading(true)
    const response = await getListTransactionsWeb3Feed()
    if (response.success) {
      setListTxs(response.txs)
      setListAtualPage(response.page1Txs)
      setTotalPages(response.totalPages)
    }
    setLoading(false)
  }

  function pageChanged(): void {
    if (listTxs.length === 0) return

    const response = paginateListTransactionsWeb3(listTxs, 10, atualPage)
    setListAtualPage(response)
  }

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col w-screen h-screen pt-24">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex flex-col items-center mt-10">
              <ActivityIndicator />
            </div>
          ) : (
            <>
              <PageSelect atualPage={atualPage} totalPages={totalPages} onChange={setAtualPage} />

              {listAtualPage.map((item) => (
                // <TransactionWeb3Item key={item.hash} transaction={item} />
                <div key={item.hash}>{item.hash}</div>
              ))}

              <PageSelect atualPage={atualPage} totalPages={totalPages} onChange={setAtualPage} />
            </>
          )}
        </div>
      </main>
    </>
  )
}
