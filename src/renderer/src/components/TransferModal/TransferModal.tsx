import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { formatUnits, isAddress } from 'viem'
import {
  useAccount,
  useBalance,
  useGasPrice,
  useReadContract,
  useWaitForTransactionReceipt
} from 'wagmi'

import { Modal } from '@renderer/components/Modal/Modal'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSendTransaction, useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { rcAbi, rcAddress } from '@renderer/services/contracts'
import { amountToWei, weiToInput } from '@renderer/utils/tokenAmount'

type Token = 'RC' | 'SIN'

/** Gas of a plain native transfer. */
const TRANSFER_GAS = 21_000n

interface Props {
  onClose: () => void
  /** Fixed recipient, e.g. when transferring from a profile; the address field is then hidden. */
  recipient?: { address: string; name?: string }
}

/** Sends RC (ERC-20 transfer) or SIN (native) from the connected wallet. */
export function TransferModal({ onClose, recipient }: Props): JSX.Element {
  const { t, i18n } = useTranslation()
  const { address } = useAccount()
  const [token, setToken] = useState<Token>('RC')
  const [to, setTo] = useState(recipient?.address ?? '')
  const [amount, setAmount] = useState('')
  const [showTx, setShowTx] = useState(false)

  const { data: rcBalance, refetch: refetchRc } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'balanceOf',
    args: [address]
  })
  const { data: sinBalance, refetch: refetchSin } = useBalance({ address })
  const { data: gasPrice } = useGasPrice()

  const rc = useWriteContract()
  const sin = useSendTransaction()
  const tx = token === 'RC' ? rc : sin
  const receipt = useWaitForTransactionReceipt({ hash: tx.data })

  const balanceWei =
    token === 'RC' ? ((rcBalance as bigint | undefined) ?? 0n) : (sinBalance?.value ?? 0n)
  const gasReserve = token === 'SIN' ? TRANSFER_GAS * (gasPrice ?? 0n) : 0n
  const maxWei = balanceWei > gasReserve ? balanceWei - gasReserve : 0n
  const valueWei = amountToWei(amount, i18n.language)
  const addressValid = isAddress(to.trim())
  const insufficient = valueWei !== null && valueWei > maxWei
  const canSend = addressValid && valueWei !== null && valueWei > 0n && !insufficient
  const format = (wei: bigint): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: 5 }).format(
      Number(formatUnits(wei, 18))
    )

  function send(): void {
    if (!canSend || valueWei === null) return
    setShowTx(true)
    if (token === 'RC') {
      rc.writeContract({
        address: rcAddress,
        abi: rcAbi,
        functionName: 'transfer',
        args: [to.trim(), valueWei]
      })
    } else {
      sin.sendTransaction({ to: to.trim() as `0x${string}`, value: valueWei })
    }
  }

  function done(): void {
    setShowTx(false)
    toast.success(t('myTokens.transferDone'))
    refetchRc()
    refetchSin()
    onClose()
  }

  return (
    <>
      <Modal title={t('myTokens.transfer')} onClose={onClose} width="w-[440px]">
        <div className="flex flex-col gap-5">
          <div className="flex p-1 rounded-xl bg-card-secondary">
            {(['RC', 'SIN'] as Token[]).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setToken(item)
                  setAmount('')
                }}
                className={`flex-1 h-10 rounded-lg font-semibold hover:cursor-pointer ${
                  token === item ? 'bg-green-primary text-green-secondary' : 'text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
            <p className="text-gray-400 text-sm">{t('common.yourBalance')}</p>
            <p className="text-white text-xl font-semibold">
              {format(balanceWei)} {token}
            </p>
          </div>

          {recipient ? (
            <div className="p-3 rounded-xl bg-card-secondary">
              <p className="text-gray-400 text-xs">{t('myTokens.recipient')}</p>
              {recipient.name && <p className="text-white font-semibold">{recipient.name}</p>}
              <p className="text-gray-300 text-xs break-all">{recipient.address}</p>
            </div>
          ) : (
            <label className="flex flex-col gap-2">
              <span className="text-gray-300 text-sm">{t('myTokens.recipientAddress')}</span>
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="0x..."
                className="h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
              />
              {to.trim() && !addressValid && (
                <span className="text-red-400 text-xs">{t('myTokens.invalidAddress')}</span>
              )}
            </label>
          )}

          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{t('myTokens.amount')}</span>
              <button
                type="button"
                className="text-green-primary font-semibold hover:cursor-pointer"
                onClick={() => setAmount(weiToInput(maxWei, i18n.language))}
              >
                {t('myTokens.max')}
              </button>
            </span>
            <span className="flex items-center gap-3">
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                placeholder="0"
                className="flex-1 h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
              />
              <span className="w-12 text-white font-semibold">{token}</span>
            </span>
            {insufficient && (
              <span className="text-red-400 text-xs">{t('common.insufficientBalance')}</span>
            )}
            {amount.trim() && valueWei === null && (
              <span className="text-red-400 text-xs">{t('myTokens.invalidAmount')}</span>
            )}
          </label>

          <button
            className="h-12 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!canSend || tx.isPending}
            onClick={send}
          >
            {t('myTokens.transfer')}
          </button>
          <p className="text-gray-400 text-xs text-center">{t('myTokens.transferInfo')}</p>
        </div>
      </Modal>

      {showTx && (
        <TransactionLoading
          close={() => setShowTx(false)}
          ok={done}
          isError={tx.isError || receipt.isError}
          isPending={tx.isPending}
          isSuccess={receipt.isSuccess}
          loading={receipt.isLoading}
          errorMessage={tx.error?.message ?? receipt.error?.message ?? ''}
          transactionHash={tx.data}
        />
      )}
    </>
  )
}
