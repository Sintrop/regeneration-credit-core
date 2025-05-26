import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  userAddress,
  userAbi,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { WriteContractErrorType } from 'viem'

export function AddDelation(): JSX.Element {
  const chainId = useChainId()
  const { t } = useTranslation()
  const [inputAddress, setInputAddress] = useState('')
  const [inputTitle, setInputTitle] = useState('')
  const [inputTestimony, setInputTestimony] = useState('')

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, error, isError } = useWaitForTransactionReceipt({ hash })

  function handleSendTransaction(): void {
    writeContract({
      address: chainId === 250225 ? userAddress : sequoiaUserAddress,
      abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
      functionName: 'addDelation',
      args: [inputAddress, inputTitle, inputTestimony]
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('whoDoYouWantToReport')}:</p>
      <input
        value={inputAddress}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('Wallet')}
        onChange={(e) => setInputAddress(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('reportTitle')}:</p>
      <input
        value={inputTitle}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputTitle(e.target.value)}
      />

      <p className="text-sm mt-3 text-gray-300">{t('reportTestimony')}:</p>
      <input
        value={inputTestimony}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputTestimony(e.target.value)}
      />

      <SendTransactionButton
        label={t('report')}
        handleSendTransaction={handleSendTransaction}
        disabled={!inputAddress.trim() || !inputTestimony.trim() || !inputTitle.trim() || isPending}
      />

      <TransactionData
        hash={hash}
        isLoading={isLoading}
        isPending={isPending}
        isSuccess={isSuccess}
        errorTx={error as WriteContractErrorType}
        isError={isError}
      />
    </div>
  )
}
