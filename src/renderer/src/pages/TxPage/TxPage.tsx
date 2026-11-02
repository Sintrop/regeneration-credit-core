import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt, FaRegCopy } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Abi, decodeEventLog, formatUnits } from 'viem'
import { useTransaction, useTransactionReceipt } from 'wagmi'

import { DataRow } from '@renderer/components/DataRow/DataRow'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { contractsMainnet, rcAbi, rcAddress } from '@renderer/services/contracts'

const EXPLORER = 'https://explorer.sintrop.com'

/** A contract of the protocol by address, or an address of a person. */
function Party({ address, label }: { address?: string | null; label: string }): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  if (!address) return <DataRow label={label} value="—" />
  const contract = contractsMainnet.find(
    (item) => item.address.toLowerCase() === address.toLowerCase()
  )
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      {contract ? (
        <button
          className="text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/contracts/${contract.address}`)}
        >
          {contract.label ? t(contract.label) : contract.name}
        </button>
      ) : (
        <UserBadge address={address} />
      )}
    </div>
  )
}

export function TxPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { hash } = useParams()
  const txHash = hash as `0x${string}`
  const { data: tx, isLoading } = useTransaction({ hash: txHash })
  const { data: receipt } = useTransactionReceipt({ hash: txHash })
  const format = (value: bigint, digits = 5): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(
      Number(formatUnits(value, 18))
    )

  const transfers = (receipt?.logs ?? [])
    .filter((log) => log.address.toLowerCase() === rcAddress.toLowerCase())
    .map((log) => {
      try {
        const event = decodeEventLog({ abi: rcAbi as Abi, data: log.data, topics: log.topics })
        return event.eventName === 'Transfer'
          ? (event.args as unknown as { from: string; to: string; value: bigint })
          : null
      } catch {
        return null
      }
    })
    .filter((item): item is { from: string; to: string; value: bigint } => !!item)

  function copy(): void {
    navigator.clipboard.writeText(txHash)
    toast.success(t('txPage.hashCopied'))
  }

  const status = !receipt ? 'pending' : receipt.status === 'success' ? 'success' : 'failed'
  const statusStyle = {
    pending: 'bg-amber-400/20 text-amber-300',
    success: 'bg-green-primary/20 text-green-primary',
    failed: 'bg-red-400/15 text-red-300'
  }[status]

  return (
    <ScreenPage pageTitle={t('txPage.title')}>
      <div className="max-w-[820px] mx-auto flex flex-col gap-5">
        <section className="p-6 rounded-2xl bg-card-primary flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
              {t(`txPage.status.${status}`)}
            </span>
            <a
              href={`${EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-green-primary text-sm font-semibold hover:underline"
            >
              {t('contracts.openExplorer')}
              <FaExternalLinkAlt size={11} />
            </a>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card-secondary">
            <span className="flex-1 min-w-0 text-white text-sm font-mono truncate">{txHash}</span>
            <button
              className="p-1 text-gray-300 hover:text-white hover:cursor-pointer"
              onClick={copy}
            >
              <FaRegCopy size={15} />
            </button>
          </div>
        </section>

        {isLoading ? (
          <div className="h-48 rounded-2xl bg-card-primary animate-pulse" />
        ) : !tx ? (
          <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
            {t('txPage.notFound')}
          </p>
        ) : (
          <>
            <section className="p-5 rounded-2xl bg-card-primary">
              <DataRow
                label={t('txPage.block')}
                value={
                  tx.blockNumber
                    ? Intl.NumberFormat(i18n.language).format(Number(tx.blockNumber))
                    : '—'
                }
              />
              <Party label={t('myTokens.from')} address={tx.from} />
              <Party label={t('myTokens.to')} address={tx.to} />
              <DataRow label={t('txPage.value')} value={`${format(tx.value)} SIN`} />
              {receipt && (
                <DataRow
                  label={t('txPage.fee')}
                  value={`${format(receipt.gasUsed * receipt.effectiveGasPrice, 8)} SIN`}
                />
              )}
            </section>

            {transfers.length > 0 && (
              <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
                <p className="text-white font-bold">{t('txPage.rcTransfers')}</p>
                {transfers.map((item, index) => (
                  <div key={index} className="p-3 rounded-xl bg-card-secondary flex flex-col gap-2">
                    <Party label={t('myTokens.from')} address={item.from} />
                    <Party label={t('myTokens.to')} address={item.to} />
                    <DataRow label={t('myTokens.amount')} value={`${format(item.value, 2)} RC`} />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </ScreenPage>
  )
}
