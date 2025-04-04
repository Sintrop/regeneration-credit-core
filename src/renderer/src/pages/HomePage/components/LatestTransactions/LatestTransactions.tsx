import { ActivityIndicator } from '@renderer/components/ActivityIndicator/ActivityIndicator'
import { TransactionWeb3Props } from '@renderer/types/transaction'
import { useTranslation } from 'react-i18next'
import { TxItem } from '@renderer/components/TxItem/TxItem'

interface Props {
  txs: TransactionWeb3Props[]
  loading?: boolean
}
export function LatestTransactions({ txs, loading }: Props): JSX.Element {
  const { t } = useTranslation()

  return <div />

  return (
    <section className="bg-container-primary rounded-2xl flex flex-col overflow-hidden">
      <div className="w-full px-5 pb-1 pt-2 bg-container-secondary">
        <p className="text-white">{t('latestTransactions')}</p>
      </div>
      {loading ? (
        <div className="flex flex-col items-center mt-10">
          <ActivityIndicator />
        </div>
      ) : (
        <>
          {txs.slice(0, 5).map((item) => (
            <TxItem key={item.hash} tx={item} />
          ))}
        </>
      )}
    </section>
  )
}
