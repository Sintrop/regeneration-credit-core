import { useState } from 'react'
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { rcAbi, sequoiaRcAbi, rcAddress, sequoiaRcAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits, parseEther } from 'viem'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'

export function BurnTokens(): JSX.Element {
  const chainId = useChainId()
  const { address } = useAccount()
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const { data } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
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

  function handleSendTransaction(): void {
    const value = parseEther(input, 'wei')

    setDisplayLoadingTx(true)
    writeContract({
      address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
      abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
      functionName: 'burnTokens',
      args: [value]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    alert(t('actions.burnedTokens'))
    setInput('')
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
        type="number"
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
