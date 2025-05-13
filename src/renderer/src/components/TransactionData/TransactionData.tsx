import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'

interface Props {
  hash?: string
  isLoading?: boolean
  isPending?: boolean
  isSuccess?: boolean
  errorTx: WriteContractErrorType | null
  isError?: boolean
}
export function TransactionData({
  errorTx,
  hash,
  isLoading,
  isPending,
  isSuccess,
  isError
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col mt-3">
      {isPending && <p className="text-white">{t('confirmInYourWallet')}...</p>}
      {hash && (
        <p className="text-white text-sm">
          {t('transactionHash')}: {hash}
        </p>
      )}

      {isLoading && <div className="w-5 h-5 bg-green-btn animate-spin" />}

      {isError && <p className="text-red-500">{errorTx?.message}</p>}

      {isSuccess && <p className="text-green-500">{t('successTransaction')}</p>}
    </div>
  )
}
