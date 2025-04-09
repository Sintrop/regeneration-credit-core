import { useTranslation } from 'react-i18next'

interface Props {
  hash?: string
  isLoading?: boolean
  isPending?: boolean
  isSuccess?: boolean
  error?: boolean
  errorMessage?: string
}
export function TransactionData({
  error,
  errorMessage,
  hash,
  isLoading,
  isPending,
  isSuccess
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

      {error && <p className="text-red-500">{errorMessage}</p>}

      {isSuccess && <p className="text-green-500">{t('successTransaction')}</p>}
    </div>
  )
}
