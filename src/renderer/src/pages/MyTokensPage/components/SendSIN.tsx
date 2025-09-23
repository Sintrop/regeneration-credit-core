import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits, parseEther } from 'viem'
import { useAccount, useBalance, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi'
import { toast } from 'react-toastify'

import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function SendSIN(): JSX.Element {
  const { t } = useTranslation()
  const [to, setTo] = useState('')
  const [value, setValue] = useState('')
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { address, isDisconnected } = useAccount()
  const { data } = useBalance({ address })

  const { data: hash, sendTransaction, error, isError, isPending } = useSendTransaction()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  const balance = data ? parseFloat(formatUnits(data.value, 18)) : 0

  useEffect(() => {
    if (parseFloat(value) > balance) {
      setInsufficientBalance(true)
    } else {
      setInsufficientBalance(false)
    }
  }, [balance, value])

  function handleSendTransaction(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    setDisplayLoadingTx(true)
    sendTransaction({ to: to as `0x${string}`, value: parseEther(value) })
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
          type="number"
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
