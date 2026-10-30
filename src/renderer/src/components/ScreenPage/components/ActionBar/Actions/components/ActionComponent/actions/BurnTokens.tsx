import { amountToWei } from '@renderer/utils/tokenAmount'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { useState } from 'react'
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { rcAbi, rcAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { toast } from 'react-toastify'

interface Props {
  close: () => void
}
export function BurnTokens({ close }: Props): JSX.Element {
  const { address } = useAccount()
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState('')

  const { data } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'balanceOf',
    args: [address]
  })

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
    const value = amountToWei(input, i18n.language)
    if (value === null || value === 0n) return

    setDisplayLoadingTx(true)

    writeContract({
      address: rcAddress,
      abi: rcAbi,
      functionName: 'burnTokens',
      args: [value]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t('actions.burnedTokens'), { type: 'success' })
    setInput('')
    close()
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-white">
        {t('actions.yourBalance')}:{' '}
        {data ? Intl.NumberFormat().format(parseFloat(formatUnits(BigInt(data as string), 18))) : 0}{' '}
        RC
      </p>

      <p className="text-sm mt-3 text-gray-300">{t('actions.howMuchDoYouWantToBurn')}:</p>
      <input
        value={input}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('actions.typeHere')}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        inputMode="decimal"
      />

      <SendTransactionButton
        label={t('actions.burnTokens')}
        handleSendTransaction={handleSendTransaction}
        disabled={!input.trim() || isPending}
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
