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
import { useState } from 'react'
import { SendTransactionButton } from '../../SendTransactionButton/SendTransactionButton'
import { TransactionData } from '@renderer/components/TransactionData/TransactionData'

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

  const { writeContract, isPending, data: hash, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  function handleSendTransaction(): void {
    const value = parseEther(input, 'wei')

    writeContract({
      address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
      abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
      functionName: 'burnTokens',
      args: [value]
    })
  }

  return (
    <div className="flex flex-col pt-5">
      <p className="text-white">
        {t('yourBalance')}:{' '}
        {data ? Intl.NumberFormat().format(parseFloat(formatUnits(BigInt(data as string), 18))) : 0}{' '}
        RC
      </p>

      <p className="text-sm mt-3 text-gray-300">{t('howMuchDoYouWantToBurn')}:</p>
      <input
        value={input}
        className="w-full rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder={t('typeHere')}
        onChange={(e) => setInput(e.target.value)}
        type="number"
      />

      <SendTransactionButton
        label={t('burnTokens')}
        handleSendTransaction={handleSendTransaction}
        disabled={!input.trim() || isPending}
      />

      <TransactionData
        hash={hash}
        isLoading={isLoading}
        isPending={isPending}
        isSuccess={isSuccess}
        error={error ? true : false}
        errorMessage={error ? error.message : undefined}
      />
    </div>
  )
}
