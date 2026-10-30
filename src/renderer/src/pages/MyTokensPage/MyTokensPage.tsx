import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEyeSlash, FaRegCopy, FaRegEye } from 'react-icons/fa'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { formatUnits } from 'viem'
import { useAccount, useBalance, useConnect, useReadContract } from 'wagmi'

import ImageSIN from '@renderer/assets/images/icon-chain.png'
import ImageRC from '@renderer/assets/images/rc.png'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TransferModal } from '@renderer/components/TransferModal/TransferModal'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useBlocksDuration } from '@renderer/hooks/useBlocksDuration'
import { useFeedUser } from '@renderer/hooks/useFeedUser'
import { useTokenHistory } from '@renderer/hooks/useTokenHistory'
import { rcAbi, rcAddress } from '@renderer/services/contracts'
import { TokenTx } from '@renderer/services/myTokens/transfersService'

type Tab = 'transfers' | 'commissions'

function Counterparty({ address, prefix }: { address: string; prefix: string }): JSX.Element {
  const user = useFeedUser(address)
  return (
    <span className="text-white font-semibold truncate">
      {prefix} {user.name || `${address.slice(0, 6)}…${address.slice(-4)}`}
    </span>
  )
}

function TxRow({ tx, currentBlock }: { tx: TokenTx; currentBlock: number }): JSX.Element {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const formatBlocks = useBlocksDuration()
  const incoming = tx.kind === 'receive' || tx.kind === 'poolWithdraw'
  const amount = Intl.NumberFormat(i18n.language, { maximumFractionDigits: 2 }).format(
    Number(formatUnits(tx.value, 18))
  )
  const ago =
    currentBlock > tx.blockNumber
      ? t('myTokens.ago', { duration: formatBlocks(currentBlock - tx.blockNumber).split(' (')[0] })
      : ''

  return (
    <button
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card-primary text-left hover:bg-card-primary/80 hover:cursor-pointer"
      onClick={() => navigate(`/tx/${tx.hash}`)}
    >
      <span
        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
          incoming
            ? 'bg-green-primary/15 text-green-primary'
            : tx.kind === 'burn'
              ? 'bg-amber-400/15 text-amber-300'
              : 'bg-red-400/15 text-red-300'
        }`}
      >
        {incoming ? <MdArrowDownward size={18} /> : <MdArrowUpward size={18} />}
      </span>
      <span className="flex-1 min-w-0 flex flex-col">
        {tx.kind === 'burn' ? (
          <span className="text-white font-semibold">{t('myTokens.kind.burn')}</span>
        ) : tx.kind === 'poolWithdraw' ? (
          <span className="text-white font-semibold">
            {t('myTokens.kind.poolWithdraw', { pool: t(`feedNews.pool.${tx.poolType ?? 1}`) })}
          </span>
        ) : (
          <Counterparty
            address={incoming ? tx.from : tx.to}
            prefix={incoming ? t('myTokens.from') : t('myTokens.to')}
          />
        )}
        <span className="text-gray-400 text-xs">
          {ago} ·{' '}
          {t('myTokens.block', { block: Intl.NumberFormat(i18n.language).format(tx.blockNumber) })}
        </span>
      </span>
      <span className={`font-bold shrink-0 ${incoming ? 'text-green-primary' : 'text-white'}`}>
        {incoming ? '+' : '−'}
        {amount} RC
      </span>
    </button>
  )
}

export function MyTokensPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { blockNumber } = useCurrentBlock()
  const [visible, setVisible] = useState(true)
  const [tab, setTab] = useState<Tab>('transfers')
  const [transferring, setTransferring] = useState(false)
  const history = useTokenHistory(address, tab)

  const { data: rc } = useReadContract({
    address: rcAddress,
    abi: rcAbi,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address }
  })
  const { data: sin } = useBalance({ address })
  const format = (wei: bigint | undefined): string =>
    visible
      ? Intl.NumberFormat(i18n.language, { maximumFractionDigits: 5 }).format(
          Number(formatUnits(wei ?? 0n, 18))
        )
      : '••••••'

  function copyAddress(): void {
    if (!address) return
    navigator.clipboard.writeText(address)
    toast.success(t('common.addressCopied'))
  }

  return (
    <ScreenPage pageTitle={t('myTokens.title')}>
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/20 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-gray-300 text-sm">{t('myTokens.balance')}</p>
            <button
              className={`flex items-center gap-2 text-gray-300 text-sm hover:text-white hover:cursor-pointer ${isConnected ? '' : 'invisible'}`}
              onClick={() => setVisible((value) => !value)}
            >
              {visible ? <FaEyeSlash /> : <FaRegEye />}
              {visible ? t('myTokens.hideBalance') : t('myTokens.showBalance')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card-secondary flex items-center gap-3">
              <img src={ImageRC} className="w-9 h-9 object-contain" />
              <div>
                <p className="text-white text-xl font-bold">{format(rc as bigint | undefined)}</p>
                <p className="text-gray-400 text-xs">RC</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card-secondary flex items-center gap-3">
              <img src={ImageSIN} className="w-9 h-9 object-contain" />
              <div>
                <p className="text-white text-xl font-bold">{format(sin?.value)}</p>
                <p className="text-gray-400 text-xs">SIN</p>
              </div>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-3">
              <button
                className="h-11 px-6 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
                onClick={() => setTransferring(true)}
              >
                {t('myTokens.transfer')}
              </button>
              <button
                className="h-11 px-4 rounded-xl border border-green-primary/50 text-green-primary text-sm font-semibold flex items-center gap-2 hover:bg-green-primary/10 hover:cursor-pointer"
                onClick={copyAddress}
                title={address}
              >
                <FaRegCopy size={14} />
                {t('myTokens.receive')}
              </button>
              <p className="text-gray-400 text-xs">{t('myTokens.receiveHint')}</p>
            </div>
          )}
        </section>

        {!isConnected && (
          <section className="p-6 rounded-2xl bg-card-primary flex flex-col items-center gap-4 text-center">
            <p className="text-gray-300">{t('myTokens.connectToSee')}</p>
            <button
              className="h-11 px-6 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
              onClick={() => connect({ connector: connectors[0] })}
            >
              {t('actionBar.connectWallet')}
            </button>
          </section>
        )}

        {isConnected && (
          <>
            <div className="flex gap-6 border-b border-card-primary">
              {(['transfers', 'commissions'] as Tab[]).map((value) => (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  className={`pb-3 -mb-px text-sm font-semibold border-b-2 hover:cursor-pointer ${
                    tab === value
                      ? 'border-green-primary text-green-primary'
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  {t(value === 'transfers' ? 'myTokens.txs' : 'myTokens.commissions')}
                </button>
              ))}
            </div>

            {history.isLoading ? (
              [0, 1, 2, 3].map((index) => (
                <div key={index} className="h-[72px] rounded-2xl bg-card-primary animate-pulse" />
              ))
            ) : history.txs.length === 0 ? (
              <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-400">
                {history.isError
                  ? t('resourcesList.error')
                  : t(tab === 'transfers' ? 'myTokens.noTxs' : 'myTokens.noReceivedCommissions')}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.txs.map((tx) => (
                  <TxRow key={`${tx.hash}-${tx.logIndex}`} tx={tx} currentBlock={blockNumber} />
                ))}
              </div>
            )}
            <p className="text-gray-500 text-xs text-center">
              {t('myTokens.onlyRcTxsWillBeShowHere')}
            </p>
          </>
        )}
      </div>

      {transferring && <TransferModal onClose={() => setTransferring(false)} />}
    </ScreenPage>
  )
}
