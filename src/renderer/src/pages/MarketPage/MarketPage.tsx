import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Abi, isAddress } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'

import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { Modal as BaseModal } from '@renderer/components/Modal/Modal'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useMarketLimits, useMarketOffers } from '@renderer/hooks/useMarket'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { rcMarketAbi, rcMarketAddress } from '@renderer/services/contracts'
import { formatOfferPrice, MarketOffer } from '@renderer/services/market/marketService'
import { clampToBytes } from '@renderer/utils/byteLength'

const PAYMENT_METHODS = ['PIX', 'TED', 'Dinheiro']
const input =
  'w-full h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary'
type Filter = 'all' | 'mine'

function Modal({
  title,
  onClose,
  children
}: {
  title: string
  onClose: () => void
  children: ReactNode
}): JSX.Element {
  return (
    <BaseModal title={title} onClose={onClose} width="w-[480px]">
      <div className="flex flex-col gap-4">{children}</div>
    </BaseModal>
  )
}

/** Sends one RCMarket transaction and reports when it is mined. */
function useMarketTx(onDone: (message: string) => void): {
  send: (functionName: string, args: unknown[], message: string) => void
  loading: JSX.Element | null
} {
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash })
  const [message, setMessage] = useState<string | null>(null)

  function send(functionName: string, args: unknown[], doneMessage: string): void {
    setMessage(doneMessage)
    writeContract({ address: rcMarketAddress, abi: rcMarketAbi as Abi, functionName, args })
  }

  const loading = message ? (
    <TransactionLoading
      close={() => setMessage(null)}
      ok={() => {
        onDone(message)
        setMessage(null)
      }}
      isError={isError || receipt.isError}
      isPending={isPending}
      isSuccess={receipt.isSuccess}
      loading={receipt.isLoading}
      errorMessage={error?.message ?? receipt.error?.message ?? ''}
      transactionHash={hash}
    />
  ) : null
  return { send, loading }
}

function NewOffer({
  onClose,
  onSend
}: {
  onClose: () => void
  onSend: (args: unknown[]) => void
}): JSX.Element {
  const { t } = useTranslation()
  const limits = useMarketLimits()
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [method, setMethod] = useState('PIX')
  const [description, setDescription] = useState('')
  const validAmount = /^\d+$/.test(amount.trim()) && Number(amount) > 0
  const canSend = validAmount && price.trim() && description.trim()

  return (
    <Modal title={t('market.newOffer')} onClose={onClose}>
      <p className="-mt-2 text-gray-400 text-xs">{t('marketPage.newOfferHint')}</p>
      <label className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('market.amountLabel')}</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
          inputMode="numeric"
          placeholder="100"
          className={input}
        />
        {amount && !validAmount && (
          <span className="text-red-300 text-xs">{t('marketPage.integerAmount')}</span>
        )}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('market.priceLabel')}</span>
        <input
          value={price}
          onChange={(e) => setPrice(clampToBytes(e.target.value, limits.price))}
          placeholder="0,15"
          className={input}
        />
      </label>
      <div className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('market.paymentMethodLabel')}</span>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((item) => (
            <button
              key={item}
              onClick={() => setMethod(item)}
              className={`h-10 rounded-xl font-semibold hover:cursor-pointer ${method === item ? 'bg-green-primary text-green-secondary' : 'bg-card-secondary text-white'}`}
            >
              {item === 'Dinheiro' ? t('market.cash') : item}
            </button>
          ))}
        </div>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-gray-300 text-sm">{t('market.descriptionLabel')}</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(clampToBytes(e.target.value, limits.description))}
          placeholder={t('market.descriptionPlaceholder')}
          className="w-full h-28 p-3 rounded-xl bg-card-secondary text-white outline-none resize-none focus:ring-1 focus:ring-green-primary"
        />
        <ByteCounter text={description} max={limits.description} />
      </label>
      <button
        className="h-12 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!canSend}
        onClick={() => onSend([BigInt(amount), price.trim(), method, description.trim()])}
      >
        {t('market.publish')}
      </button>
    </Modal>
  )
}

function OfferCard({
  offer,
  own,
  onBuy,
  onCancel,
  onConfirm
}: {
  offer: MarketOffer
  own: boolean
  onBuy: () => void
  onCancel: () => void
  onConfirm: () => void
}): JSX.Element {
  const { t, i18n } = useTranslation()
  return (
    <article className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-sm">{t('market.offer', { id: offer.id })}</span>
        <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-card-secondary">
          {offer.paymentMethod === 'Dinheiro' ? t('market.cash') : offer.paymentMethod}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-gray-400 text-xs">{t('market.amount')}</p>
          <p className="text-white text-2xl font-bold">
            {Intl.NumberFormat(i18n.language).format(offer.amount)} RC
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">{t('market.unitPrice')}</p>
          <p className="text-green-primary text-xl font-bold">
            {formatOfferPrice(offer.unitPrice, i18n.language)}
          </p>
        </div>
      </div>
      {offer.description && (
        <p className="p-3 rounded-xl bg-card-secondary text-gray-200 text-sm whitespace-pre-line break-words">
          {offer.description}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-card-secondary">
        <UserBadge address={offer.seller} label={t('market.seller')} />
        <div className="flex gap-2 shrink-0">
          {own ? (
            <>
              <button
                className="h-10 px-4 rounded-xl border border-red-400/60 text-red-300 text-sm font-semibold hover:bg-red-400/10 hover:cursor-pointer"
                onClick={onCancel}
              >
                {t('market.cancel')}
              </button>
              <button
                className="h-10 px-4 rounded-xl bg-blue-primary text-white text-sm font-semibold hover:cursor-pointer"
                onClick={onConfirm}
              >
                {t('market.complete')}
              </button>
            </>
          ) : (
            <button
              className="h-10 px-5 rounded-xl bg-green-primary text-green-secondary text-sm font-bold hover:cursor-pointer"
              onClick={onBuy}
            >
              {t('market.buy')}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export function MarketPage(): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { offers, isLoading, refetch } = useMarketOffers()
  const [filter, setFilter] = useState<Filter>('all')
  const [creating, setCreating] = useState(false)
  const [buying, setBuying] = useState<MarketOffer | null>(null)
  const [cancelling, setCancelling] = useState<MarketOffer | null>(null)
  const [confirming, setConfirming] = useState<MarketOffer | null>(null)
  const [buyer, setBuyer] = useState('')
  const tx = useMarketTx((message) => {
    toast.success(t(message))
    refetch()
  })

  const isOwn = (offer: MarketOffer): boolean =>
    !!address && offer.seller.toLowerCase() === address.toLowerCase()
  const active = offers.filter((offer) => offer.active)
  const shown = filter === 'mine' ? active.filter(isOwn) : active
  const sold = offers.filter((offer) => !offer.active && !/^0x0+$/.test(offer.buyer)).length

  return (
    <ScreenPage pageTitle={t('market.title')}>
      <div className="max-w-[820px] mx-auto flex flex-col gap-5">
        <section className="p-5 rounded-2xl bg-card-primary flex items-center gap-6">
          <div className="flex-1">
            <p className="text-white font-bold">{t('marketPage.howTitle')}</p>
            <p className="text-gray-300 text-sm">{t('market.buyMessage')}</p>
          </div>
          <div className="flex gap-3 shrink-0 text-center">
            <div className="p-3 rounded-xl bg-card-secondary w-24">
              <p className="text-white text-xl font-bold">{isLoading ? '—' : active.length}</p>
              <p className="text-gray-400 text-xs">{t('marketPage.activeOffers')}</p>
            </div>
            <div className="p-3 rounded-xl bg-card-secondary w-24">
              <p className="text-white text-xl font-bold">{isLoading ? '—' : sold}</p>
              <p className="text-gray-400 text-xs">{t('marketPage.sales')}</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <div className="flex p-1 rounded-xl bg-card-primary">
            {(['all', 'mine'] as Filter[]).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                disabled={item === 'mine' && !isConnected}
                className={`h-9 px-4 rounded-lg text-sm font-semibold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${filter === item ? 'bg-green-primary text-green-secondary' : 'text-white'}`}
              >
                {t(`marketPage.filter.${item}`)}
              </button>
            ))}
          </div>
          <button
            className="h-11 px-5 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!isConnected}
            title={isConnected ? undefined : t('market.connectWalletFirst')}
            onClick={() => setCreating(true)}
          >
            {t('market.publishOffer')}
          </button>
        </div>

        {isLoading ? (
          [0, 1].map((index) => (
            <div key={index} className="h-52 rounded-2xl bg-card-primary animate-pulse" />
          ))
        ) : shown.length === 0 ? (
          <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
            {t('market.noOffers')}
          </p>
        ) : (
          shown.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              own={isOwn(offer)}
              onBuy={() => setBuying(offer)}
              onCancel={() => setCancelling(offer)}
              onConfirm={() => {
                setBuyer('')
                setConfirming(offer)
              }}
            />
          ))
        )}
      </div>

      {creating && (
        <NewOffer
          onClose={() => setCreating(false)}
          onSend={(args) => {
            setCreating(false)
            tx.send('createOffer', args, 'market.offerCreated')
          }}
        />
      )}

      {buying && (
        <Modal title={t('market.buyTitle')} onClose={() => setBuying(null)}>
          <p className="text-gray-300 text-sm">{t('market.buyMessage')}</p>
          {buying.description && (
            <p className="p-3 rounded-xl bg-card-secondary text-gray-200 text-sm whitespace-pre-line break-words">
              {buying.description}
            </p>
          )}
          <UserBadge address={buying.seller} label={t('market.seller')} />
        </Modal>
      )}

      {cancelling && (
        <Modal title={t('market.cancelOfferTitle')} onClose={() => setCancelling(null)}>
          <p className="text-gray-300 text-sm">{t('market.cancelOfferMessage')}</p>
          <button
            className="h-11 rounded-xl border border-red-400/60 text-red-300 font-semibold hover:bg-red-400/10 hover:cursor-pointer"
            onClick={() => {
              const offerId = cancelling.id
              setCancelling(null)
              tx.send('cancelOffer', [BigInt(offerId)], 'market.offerCancelled')
            }}
          >
            {t('market.cancelOfferTitle')}
          </button>
        </Modal>
      )}

      {confirming && (
        <Modal title={t('market.confirmSaleTitle')} onClose={() => setConfirming(null)}>
          <p className="text-gray-300 text-sm">{t('marketPage.confirmHint')}</p>
          <label className="flex flex-col gap-2">
            <span className="text-gray-300 text-sm">{t('market.confirmSaleMessage')}</span>
            <input
              value={buyer}
              onChange={(e) => setBuyer(e.target.value)}
              placeholder="0x..."
              className={input}
            />
            {buyer.trim() && !isAddress(buyer.trim()) && (
              <span className="text-red-300 text-xs">{t('myTokens.invalidAddress')}</span>
            )}
          </label>
          <button
            className="h-11 rounded-xl bg-blue-primary text-white font-semibold hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!isAddress(buyer.trim())}
            onClick={() => {
              const offerId = confirming.id
              setConfirming(null)
              tx.send('confirmSale', [BigInt(offerId), buyer.trim()], 'market.saleConfirmed')
            }}
          >
            {t('market.complete')}
          </button>
        </Modal>
      )}

      {tx.loading}
    </ScreenPage>
  )
}
