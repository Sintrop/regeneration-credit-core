import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { MdCheckCircle, MdError } from 'react-icons/md'
import { toast } from 'react-toastify'

import { Modal } from '@renderer/components/Modal/Modal'

interface Props {
  transactionHash?: `0x${string}`
  loading: boolean
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  errorMessage?: string
  ok: () => void
  close: () => void
  uploadingFile?: boolean
  uploadedError?: boolean
}

function Spinner(): JSX.Element {
  return (
    <div className="w-12 h-12 rounded-full border-4 border-green-primary/20 border-t-green-primary animate-spin" />
  )
}

/** Progress of a transaction: wallet confirmation, mining, then success or the error. */
export function TransactionLoading({
  transactionHash,
  loading,
  isPending,
  isError,
  isSuccess,
  errorMessage,
  close,
  ok,
  uploadingFile,
  uploadedError
}: Props): JSX.Element {
  const { t } = useTranslation()

  function copyHash(): void {
    navigator.clipboard.writeText(transactionHash as string)
    toast.success(t('txLoading.copiedToClipboard'))
  }

  return (
    <Modal priority width="w-[440px]" onClose={close}>
      <div className="flex flex-col items-center gap-4 text-center pt-2">
        {uploadedError ? (
          <>
            <MdError className="text-red-300" size={44} />
            <p className="text-red-300 font-semibold">{t('txLoading.erroOnUploadFileToIpfs')}</p>
          </>
        ) : isError ? (
          <>
            <MdError className="text-red-300" size={44} />
            <p className="text-white font-bold">{t('txLoading.errorOnExecuteTransaction')}</p>
            {errorMessage && (
              <p className="w-full max-h-40 overflow-y-auto p-3 rounded-xl bg-card-secondary text-gray-300 text-xs text-left break-words">
                {errorMessage}
              </p>
            )}
          </>
        ) : isSuccess ? (
          <>
            <MdCheckCircle className="text-green-primary" size={48} />
            <p className="text-white font-bold">
              {t('txLoading.transactionCompletedSuccessfully')}
            </p>
          </>
        ) : (
          <>
            <Spinner />
            <p className="text-white font-semibold">
              {uploadingFile
                ? t('txLoading.uploadingFile')
                : isPending
                  ? t('txLoading.confirmInYourWallet')
                  : loading
                    ? t('txLoading.processingTransaction')
                    : t('txLoading.confirmInYourWallet')}
            </p>
            {isPending && <p className="text-gray-400 text-xs">{t('txLoading.walletHint')}</p>}
          </>
        )}

        {transactionHash && (
          <button
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-card-secondary text-left hover:cursor-pointer"
            onClick={copyHash}
          >
            <span className="flex-1 min-w-0">
              <span className="block text-gray-400 text-xs">{t('txLoading.transactionHash')}</span>
              <span className="block text-white text-xs font-mono truncate">{transactionHash}</span>
            </span>
            <FaRegCopy className="shrink-0 text-gray-300" size={14} />
          </button>
        )}

        {isSuccess && (
          <button
            className="w-full h-11 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
            onClick={ok}
          >
            {t('continue')}
          </button>
        )}
        {(isError || uploadedError) && (
          <button
            className="w-full h-11 rounded-xl border border-green-primary text-green-primary font-semibold hover:cursor-pointer"
            onClick={close}
          >
            {t('txLoading.close')}
          </button>
        )}
      </div>
    </Modal>
  )
}
