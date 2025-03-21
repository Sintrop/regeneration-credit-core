import { ActivityIndicator } from '@renderer/components/ActivityIndicator/ActivityIndicator'
import { 
  getListTransactionsWeb3Feed,
  paginateListTransactionsWeb3
} from '@renderer/services/transactionsWeb3'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function LatestTransactions(): JSX.Element {
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
    <section className="">
      <p className="text-white">{t('latestTransactions')}</p>
      {loading ? (
        <div className="flex flex-col items-center mt-10">
          <ActivityIndicator />
        </div>
      ) : (
        <>
          {listAtualPage.slice(0, 5).map((item) => (
            // <TransactionWeb3Item key={item.hash} transaction={item} />
            <div key={item.hash}>{item.hash}</div>
          ))}
        </>
      )}
    </section>
  )
}
