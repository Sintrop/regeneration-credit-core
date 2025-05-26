/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { Abi, WriteContractErrorType } from 'viem'

interface Props {
  addressContract?: string
  abi?: Abi
}
export function RequestInspection({ abi, addressContract }: Props): JSX.Element {
  const { t } = useTranslation()

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  function handleSendTransaction(): void {
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'requestInspection'
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <SendTransactionButton
        label={t('requestInspection')}
        handleSendTransaction={handleSendTransaction}
        disabled={isPending || isLoading}
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
