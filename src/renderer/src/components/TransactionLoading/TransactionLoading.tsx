/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

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

  function handleCopyHash(): void {
    navigator.clipboard.writeText(transactionHash as string)
    alert(t('txLoading.copiedToClipboard'))
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-card-2 p-6 rounded-2xl shadow-2xl min-w-96 relative overflow-hidden max-h-[600px]">
        <button className="absolute top-3 right-3 hover:cursor-pointer" onClick={close}>
          <MdClose size={25} color="white" />
        </button>
        {uploadedError && (
          <div className="w-full h-20 flex flex-col items-center justify-center">
            <p className="text-red-500">{t('txLoading.erroOnUploadFileToIpfs')}</p>
          </div>
        )}

        {uploadingFile && (
          <div className="w-full h-20 flex flex-col items-center justify-center">
            <p className="text-white">{t('txLoading.uploadingFile')}</p>
          </div>
        )}

        {isPending && (
          <div className="w-full h-20 flex flex-col items-center justify-center">
            <p className="text-white">{t('txLoading.confirmInYourWallet')}...</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-5 w-full items-center pt-5">
            <div className="w-20 h-20 rounded-sm bg-green-primary animate-spin" />
            <p className="text-white">{t('txLoading.processingTransaction')}...</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center">
            <p className="text-green-600">{t('txLoading.transactionCompletedSuccessfully')}</p>
          </div>
        )}

        {transactionHash && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <p className="text-white text-ellipsis truncate text-sm mt-5 max-w-84">
                {transactionHash}
              </p>

              <button className="hover:cursor-pointer ml-5" onClick={handleCopyHash}>
                <FaRegCopy size={25} color="white" />
              </button>
            </div>
            <p className="text-gray-400 text-xs">{t('txLoading.transactionHash')}</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center mt-5">
            <button
              className="text-white px-10 h-10 rounded-2xl bg-green-600 font-semibold hover:cursor-pointer"
              onClick={ok}
            >
              {t('continue')}
            </button>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center">
            <p className="text-red-500">{t('txLoading.errorOnExecuteTransaction')}!</p>

            <p className="text-white mt-5 text-start text-wrap">{errorMessage}</p>
            <button
              className="text-white px-10 h-10 rounded-2xl bg-green-600 font-semibold hover:cursor-pointer mt-5"
              onClick={close}
            >
              {t('txLoading.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
