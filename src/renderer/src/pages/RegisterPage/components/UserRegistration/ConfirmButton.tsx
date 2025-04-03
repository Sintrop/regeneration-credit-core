import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'

interface Props {
  handleRegister: () => void
  btnDisabled: boolean
  isPending?: boolean
  isLoading?: boolean
  isSuccess?: boolean
  hash?: string
  error?: WriteContractErrorType
  uploadingImage?: boolean
}

export function ConfirmButton({
  handleRegister,
  btnDisabled,
  isLoading,
  isPending,
  hash,
  error,
  isSuccess,
  uploadingImage
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <button
        className={`bg-green-btn rounded-2xl px-10 h-10 text-white mt-10 w-fit hover:cursor-pointer ${btnDisabled ? 'opacity-50' : 'opacity-100'}`}
        onClick={handleRegister}
        disabled={btnDisabled || isPending || isLoading || uploadingImage}
      >
        {uploadingImage
          ? t('uploadingProofPhoto')
          : isPending
            ? t('confirmInYourWallet...')
            : t('register')}
      </button>

      {hash && (
        <div className="flex flex-col">
          <p className="text-white">Transaction hash: {hash}</p>
          {isLoading && (
            <>
              <p className="text-white">Waiting for confirmation...</p>
              <div className="w-10 h-10 bg-green-btn animate-spin" />
            </>
          )}
          {isSuccess && <p className="text-green-600">{t('transactionSuccess')}</p>}
        </div>
      )}

      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
