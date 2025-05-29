/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../../ActionComponent'
import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'

export function DeclareReduction({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [itemId, setItemId] = useState<number>()

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  async function handleSendTransaction(): Promise<void> {
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'declareReductionCommitment',
      args: [itemId]
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <SelectCalculatorItem onChangeItem={(item) => setItemId(item?.id)} />

      <SendTransactionButton
        label={t('declare')}
        handleSendTransaction={handleSendTransaction}
        disabled={!itemId || isPending || isLoading}
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
