import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import RCLogo from '@renderer/assets/images/rc.png'
import { ImageInput } from '@renderer/components/Input/ImageInput'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { usePublish } from '@renderer/domain/Supporter/useCases/usePublish'
import { useWaitForTransactionReceipt } from 'wagmi'

interface Props {
  tokensAllowed: number
  refecthAllowance: () => void
}
export function Content({ tokensAllowed, refecthAllowance }: Props): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [insufficientTokens, setInsufficientTokens] = useState(false)
  const [image, setImage] = useState<string>()
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { isError, isPending, publish, error, hash, uploadingImage, uploadedError } = usePublish()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error : isErrorTx ? errorTx.message : ''

  useEffect(() => {
    if (parseFloat(inputAmmount) > tokensAllowed) {
      setInsufficientTokens(true)
    } else {
      setInsufficientTokens(false)
    }
  }, [inputAmmount, tokensAllowed])

  function handlePublish(): void {
    setDisplayLoadingTx(true)
    publish({
      ammount: parseFloat(inputAmmount),
      description: inputDescription,
      image
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    setInputAmmount('')
    setInputDescription('')
    setImage('')
    refecthAllowance()
  }

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('actions.descPublish')}</p>

      <div className="flex items-center gap-3 my-3">
        <img src={RCLogo} className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <p className="text-gray-300 text-sm">{t('actions.totalTokensAllowed')}</p>
          <p className="font-bold text-white text-xl">
            {Intl.NumberFormat('pt-BR').format(tokensAllowed)} RC
          </p>
        </div>
      </div>

      <p className="text-sm mt-3 text-gray-300">{t('actions.labelAmmountPublish')}:</p>
      <input
        value={inputAmmount}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('common.typeHere')}
        onChange={(e) => setInputAmmount(e.target.value)}
        type="number"
      />
      {insufficientTokens && (
        <p className="text-red-500 mt-2">{t('actions.insufficientTokensAllowed')}</p>
      )}

      <p className="text-sm mt-3 text-gray-300">{t('actions.labelDescPublish')}:</p>
      <input
        value={inputDescription}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('common.typeHere')}
        onChange={(e) => setInputDescription(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('actions.labelImageSelect')}:</p>
      <ImageInput onChange={setImage} />

      <button
        className="w-full h-10 mt-5 rounded-2xl bg-blue-primary text-white font-semibold hover:cursor-pointer disabled:cursor-default disabled:opacity-50"
        onClick={handlePublish}
        disabled={
          insufficientTokens || !inputDescription.trim() || !inputAmmount.trim() || uploadingImage
        }
      >
        {uploadingImage ? t('common.uploadingFile') : t('actions.publish')}
      </button>

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={success}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          errorMessage={errorMessage}
          transactionHash={hash}
          uploadingFile={uploadingImage}
          uploadedError={uploadedError}
        />
      )}
    </div>
  )
}
