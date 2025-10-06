/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { SendTransactionButton } from '../../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../../ActionComponent'
import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'
import { useSwitchChain } from '@renderer/hooks/useChainSwitch'

export function DeclareReduction({
  abi,
  addressContract,
  close
}: ActionContractProps): JSX.Element {
  const { switchChain, isSuccess: isSuccessSwitch } = useSwitchChain()

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

    await switchChain()
    if (!isSuccessSwitch) {
      setDisplayLoadingTx(false)
      return
    }

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
    toast(t('declaredReduction'), { type: 'success' })
    setItemId(null)
    close()
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
