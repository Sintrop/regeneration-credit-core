/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { parseUnits, WriteContractErrorType } from 'viem'
import { useState } from 'react'
import { SendTransactionButton } from '../../../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'
import { ActionContractProps } from '../../../ActionComponent'
import { SelectCalculatorItem } from '../ModalSelectCalculatorItem/SelectCalculatorItem'

export function Offsetting({ abi, addressContract }: ActionContractProps): JSX.Element {
  const { t } = useTranslation()
  const [inputAmmount, setInputAmmount] = useState('')
  const [itemId, setItemId] = useState<number>()

  const { writeContract, isPending, data: hash } = useWriteContract()
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({ hash })

  async function handleSendTransaction(): Promise<void> {
    writeContract({
      //@ts-ignore
      address: addressContract ? addressContract : '',
      abi: abi ? abi : [],
      functionName: 'offset',
      args: [parseUnits(inputAmmount, 18), itemId]
    })
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
