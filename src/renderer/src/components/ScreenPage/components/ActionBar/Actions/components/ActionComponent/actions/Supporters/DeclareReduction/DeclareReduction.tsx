/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../../ActionComponent'
import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function DeclareReduction({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [itemId, setItemId] = useState<number | null>()

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
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'declareReductionCommitment',
      args: [itemId]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('declaredReduction'))
    setItemId(null)
  }

  return (
    <div className="flex flex-col pt-5">
      <SelectCalculatorItem onChangeItem={(item) => setItemId(item?.id)} />

      <SendTransactionButton
        label={t('declare')}
        handleSendTransaction={handleSendTransaction}
        disabled={!itemId || isLoading}
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
