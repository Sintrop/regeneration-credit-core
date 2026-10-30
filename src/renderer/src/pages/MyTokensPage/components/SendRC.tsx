import { amountToWei, parseAmountInput } from '@renderer/utils/tokenAmount'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { toast } from 'react-toastify'
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi'

import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { rcAbi, rcAddress } from '@renderer/services/contracts'

export function SendRC(): JSX.Element {
  const { t, i18n } = useTranslation()
  const [to, setTo] = useState('')
  const [value, setValue] = useState('')
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { address, isDisconnected } = useAccount()
  const { data } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: hash, writeContract, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  const balance = data ? parseFloat(formatUnits(BigInt(data as string), 18)) : 0

  useEffect(() => {
    if (parseAmountInput(value, i18n.language) > balance) {
      setInsufficientBalance(true)
    } else {
      setInsufficientBalance(false)
    }
  }, [balance, value])

  async function handleSendTransaction(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    const amountWei = amountToWei(value, i18n.language)
    if (amountWei === null) return

    setDisplayLoadingTx(true)

    writeContract({
      address: rcAddress,
      abi: rcAbi,
      functionName: 'transfer',
      args: [to, amountWei]
    })
  }

  function transactionSuccess(): void {
    setDisplayLoadingTx(false)
    setTo('')
    setValue('')
    toast.success('myTokens.transactionSent')
  }

  return (
    <div className="flex flex-col p-5 bg-card-1 rounded-2xl w-fit">
      <form className="flex flex-col w-[400px]" onSubmit={handleSendTransaction}>
        <label className="text-white text-sm">{t('myTokens.to')}:</label>
        <input
          className="w-full h-10 rounded-2xl px-5 bg-card-2 text-white"
          placeholder={t('myTokens.typeHere')}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />

        <label className="text-white text-sm mt-3">{t('myTokens.value')}:</label>
        <input
          className="w-full h-10 rounded-2xl px-5 bg-card-2 text-white"
          placeholder={t('myTokens.typeHere')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          inputMode="decimal"
          required
        />

        {insufficientBalance && (
          <p className="text-red-500 font-semibold mt-1">{t('myTokens.insufficientBalance')}!</p>
        )}

        <button
          className="w-full bg-green-primary h-10 rounded-2xl mt-5 font-semibold text-white hover:cursor-pointer disabled:opacity-45 disabled:cursor-default"
          type="submit"
          disabled={insufficientBalance || !to.trim() || !value.trim() || isDisconnected}
        >
          {t('myTokens.send')}
        </button>
      </form>

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={transactionSuccess}
          isError={isError || isErrorTx}
          errorMessage={errorMessage}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          transactionHash={hash}
        />
      )}
    </div>
  )
}
