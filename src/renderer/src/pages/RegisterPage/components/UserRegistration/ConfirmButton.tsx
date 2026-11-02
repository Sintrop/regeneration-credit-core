import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'

interface Props {
  handleRegister: () => void
  btnDisabled: boolean
  isPending?: boolean
  isLoading?: boolean
  error?: WriteContractErrorType
  uploadingImage?: boolean
}

export function ConfirmButton({
  handleRegister,
  btnDisabled,
  isLoading,
  isPending,
  error,
  uploadingImage
}: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <button
        className="h-12 mt-6 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={handleRegister}
        disabled={btnDisabled || isPending || isLoading || uploadingImage}
      >
        {uploadingImage
          ? t('register.uploadingProofPhoto')
          : isPending
            ? t('register.confirmInYourWallet')
            : t('register.register')}
      </button>

      {error && <p className="text-red-300 text-sm">{error.message}</p>}
    </div>
  )
}
