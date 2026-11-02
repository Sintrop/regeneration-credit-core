import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { clampToBytes } from '@renderer/utils/byteLength'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { userAddress, userAbi } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

interface Props {
  close: () => void
}
export function AddDelation({ close }: Props): JSX.Element {
  const { t } = useTranslation()
  const [inputAddress, setInputAddress] = useState('')
  const [inputTitle, setInputTitle] = useState('')
  const [inputTestimony, setInputTestimony] = useState('')

  const { writeContract, isPending, data: hash, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  async function handleSendTransaction(): Promise<void> {
    setDisplayLoadingTx(true)

    writeContract({
      address: userAddress,
      abi: userAbi,
      functionName: 'addDelation',
      args: [inputAddress, inputTitle, inputTestimony]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.delationSent'), { type: 'success' })
    setInputAddress('')
    setInputTestimony('')
    setInputTitle('')
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('actions.whoDoYouWantToReport')}:</p>
      <input
        value={inputAddress}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.wallet')}
        onChange={(e) => setInputAddress(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('actions.reportTitle')}:</p>
      <input
        value={inputTitle}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputTitle(clampToBytes(e.target.value, 100))}
      />
      <ByteCounter text={inputTitle} max={100} />

      <p className="text-sm mt-3 text-gray-300">{t('actions.reportTestimony')}:</p>
      <input
        value={inputTestimony}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInputTestimony(clampToBytes(e.target.value, 300))}
      />
      <ByteCounter text={inputTestimony} max={300} />

      <SendTransactionButton
        label={t('actions.report')}
        handleSendTransaction={handleSendTransaction}
        disabled={!inputAddress.trim() || !inputTestimony.trim() || !inputTitle.trim() || isPending}
      />

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
        />
      )}
    </div>
  )
}
