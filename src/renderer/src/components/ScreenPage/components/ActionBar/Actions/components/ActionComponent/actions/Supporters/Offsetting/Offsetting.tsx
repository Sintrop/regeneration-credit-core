/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { parseUnits } from 'viem'
import { SendTransactionButton } from '../../../../SendTransactionButton/SendTransactionButton'
import { ActionContractProps } from '../../../ActionComponent'
import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function Offsetting({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
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
      functionName: 'offset',
      args: [parseUnits(inputAmmount, 18), itemId]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('publishedOffset'))
    setInputAmmount('')
    setItemId(null)
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-sm mt-3 text-gray-300">{t('ammount')}:</p>
      <input
        value={inputAmmount}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInputAmmount(e.target.value)}
        type="number"
      />

      <p className="text-sm mt-3 text-gray-300">{t('calculatorItem')}:</p>
      <SelectCalculatorItem onChangeItem={(item) => setItemId(item?.id)} />

      <SendTransactionButton
        label={t('offsetting')}
        handleSendTransaction={handleSendTransaction}
        disabled={!inputAmmount.trim() || !itemId || isPending}
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
