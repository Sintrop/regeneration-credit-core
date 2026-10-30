import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdExpandLess, MdExpandMore, MdSearch } from 'react-icons/md'
import { Abi } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

import RCLogo from '@renderer/assets/images/rc.png'
import { CertificatesCard } from '@renderer/components/CertificatesCard/CertificatesCard'
import { ActionComponent } from '@renderer/components/ScreenPage/components/ActionBar/Actions/components/ActionComponent/ActionComponent'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useUserContext } from '@renderer/hooks/useUserContext'
import {
  researcherAbi,
  researcherAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { CalculatorItemProps } from '@renderer/types/researcher'
import { formatArea } from '@renderer/utils/formatArea'
import { formatCarbon } from '@renderer/utils/formatCarbon'
import { parseAmountInput } from '@renderer/utils/tokenAmount'
import { ModalDeclareCalculator } from './components/OffsetCalculator/ModalDeclareCalculator'
import { ModalOffsetCalculator } from './components/OffsetCalculator/ModalOffsetCalculator/ModalOffsetCalculator'

const researcher = { address: researcherAddress as `0x${string}`, abi: researcherAbi as Abi }

function useFormat(): (value: number, digits?: number) => string {
  const { i18n } = useTranslation()
  return (value, digits = 2) =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value || 0)
}

function ImpactPerToken(): JSX.Element {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const impact = useImpactPerToken()
  const significant = (value: number): string =>
    Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 4 }).format(value || 0)
  const tokensPerTree = impact.treesPerToken > 0 ? 1 / impact.treesPerToken : 0
  const tiles = [
    { label: t('trees'), value: significant(impact.treesPerToken) },
    { label: t('carbon'), value: formatCarbon(impact.carbonPerToken, i18n.language) },
    { label: t('biodiversity'), value: significant(impact.biodiversityPerToken) },
    { label: t('home.area'), value: formatArea(impact.soilPerToken, i18n.language) }
  ]

  return (
    <section className="p-6 rounded-2xl bg-card-primary border border-green-primary/40 flex gap-6 items-center">
      <div className="w-[280px] shrink-0">
        <p className="flex items-center gap-2 text-green-primary text-xl font-bold">
          <img src={RCLogo} className="w-6 h-6" />
          {t('impactCalculator.treeEqualsTokens', { tokens: format(tokensPerTree) })}
        </p>
        <p className="text-gray-300 text-sm mt-1">
          {t('impactCalculator.tokensPerTreeDescription', { tokens: format(tokensPerTree) })}
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-gray-300 text-sm">{t('impactCalculator.impactPerToken')}</p>
        <div className="grid grid-cols-4 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="p-3 rounded-xl bg-card-secondary">
              <p className="text-white font-bold">{impact.isLoading ? '—' : tile.value}</p>
              <p className="text-gray-400 text-xs">{tile.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FundTrees(): JSX.Element {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const { isConnected } = useAccount()
  const { treesPerToken } = useImpactPerToken()
  const [trees, setTrees] = useState('')
  const amount = parseAmountInput(trees, i18n.language)
  const tokens = amount > 0 && treesPerToken > 0 ? amount / treesPerToken : 0

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div>
        <p className="text-white font-bold text-lg">{t('impactCalculator.burnTokens')}</p>
        <p className="text-gray-300 text-sm">{t('impactCalculator.descBurnTokens')}</p>
      </div>
      <label className="flex flex-col gap-2 p-4 rounded-xl border border-green-primary/30">
        <span className="text-gray-300 text-sm">{t('impactCalculator.howManyTreesToFund')}</span>
        <input
          value={trees}
          onChange={(event) => setTrees(event.target.value)}
          inputMode="decimal"
          placeholder="10"
          className="h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
        />
        {tokens > 0 && (
          <span className="text-green-primary font-semibold">
            {t('common.compensateTokens', { tokens: format(tokens) })}
          </span>
        )}
      </label>
      <ActionComponent
        actionName="burnTokens"
        abi={supporterAbi as Abi}
        addressContract={supporterAddress}
        renderTrigger={(open) => (
          <button
            className="h-11 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={open}
            disabled={!isConnected}
          >
            {isConnected ? t('actions.compensate') : t('actionBar.youAreNotConnected')}
          </button>
        )}
      />
    </section>
  )
}

function CalculatorItemCard({
  id,
  carbonPerToken
}: {
  id: number
  carbonPerToken: number
}): JSX.Element | null {
  const { t, i18n } = useTranslation()
  const format = useFormat()
  const { userType } = useUserContext()
  const [expanded, setExpanded] = useState(false)
  const [quantity, setQuantity] = useState('')
  const { data } = useReadContract({
    ...researcher,
    functionName: 'getCalculatorItem',
    args: [BigInt(id)]
  })
  const item = data as CalculatorItemProps | undefined
  if (!item) return <div className="h-20 rounded-2xl bg-card-primary animate-pulse" />

  const carbonImpact = Number(item.carbonImpact)
  const rcPerUnit = carbonPerToken > 0 ? carbonImpact / carbonPerToken : 0
  const units = parseAmountInput(quantity, i18n.language)
  const rcNeeded = units > 0 ? units * rcPerUnit : 0

  return (
    <article className="rounded-2xl bg-card-primary overflow-hidden">
      <button
        className="w-full p-5 flex items-center justify-between gap-4 text-left hover:cursor-pointer"
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="min-w-0">
          <span className="block text-white font-bold">{item.item}</span>
          <span className="text-gray-400 text-xs">
            {formatCarbon(carbonImpact, i18n.language)} CO₂ / {item.unit}
          </span>
        </span>
        <span className="flex items-center gap-4 shrink-0">
          <span className="text-right">
            <span className="block text-green-primary font-bold">{format(rcPerUnit)} RC</span>
            <span className="text-gray-400 text-[11px]">
              {t('impactCalculator.perOneUnit', { unit: item.unit })}
            </span>
          </span>
          {expanded ? (
            <MdExpandLess className="text-gray-300" size={22} />
          ) : (
            <MdExpandMore className="text-gray-300" size={22} />
          )}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-4 border-t border-card-secondary flex flex-col gap-4">
          {item.thesis?.trim() && <p className="text-gray-200 text-sm">{item.thesis.trim()}</p>}
          <UserBadge address={item.createdBy} label={t('resourcesList.publishedBy')} />
          <label className="flex flex-col gap-2 p-4 rounded-xl border border-green-primary/30">
            <span className="text-gray-300 text-sm">
              {t('offset.howManyUnitsToOffset', { unit: item.unit })}
            </span>
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              inputMode="decimal"
              placeholder="10"
              className="h-11 px-3 rounded-xl bg-card-secondary text-white outline-none focus:ring-1 focus:ring-green-primary"
            />
            {rcNeeded > 0 && (
              <span className="text-green-primary font-semibold">
                {t('impactCalculator.quickResult', {
                  tokens: format(rcNeeded),
                  carbon: format((units * carbonImpact) / 1000)
                })}
              </span>
            )}
          </label>
          {userType === 7 ? (
            <div className="grid grid-cols-2 gap-3">
              <ModalOffsetCalculator item={item} />
              <ModalDeclareCalculator item={item} />
            </div>
          ) : (
            <p className="text-gray-400 text-xs">{t('impactCalculator.supporterOnly')}</p>
          )}
        </div>
      )}
    </article>
  )
}

function ItemName({
  id,
  query,
  children
}: {
  id: number
  query: string
  children: JSX.Element
}): JSX.Element | null {
  const { data } = useReadContract({
    ...researcher,
    functionName: 'getCalculatorItem',
    args: [BigInt(id)]
  })
  const item = data as CalculatorItemProps | undefined
  const normalize = (text: string): string =>
    text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  if (query && item && !normalize(`${item.item} ${item.unit}`).includes(normalize(query)))
    return null
  return children
}

function CalculatorItems(): JSX.Element {
  const { t } = useTranslation()
  const { carbonPerToken } = useImpactPerToken()
  const [query, setQuery] = useState('')
  const { data, isLoading } = useReadContract({
    ...researcher,
    functionName: 'calculatorItemsCount'
  })
  const count = Number(data ?? 0)
  const ids = Array.from({ length: count }, (_, index) => index + 1)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-white text-lg font-bold">{t('impactCalculator.calculatorItems')}</p>
        {!isLoading && <span className="text-gray-400 text-sm">{count}</span>}
      </div>
      <p className="-mt-2 text-gray-300 text-sm">{t('impactCalculator.descOffset')}</p>
      {count > 4 && (
        <label className="flex items-center gap-2 h-11 px-4 rounded-xl bg-card-primary">
          <MdSearch className="text-gray-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('impactCalculator.searchItem')}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </label>
      )}
      {isLoading ? (
        <div className="h-20 rounded-2xl bg-card-primary animate-pulse" />
      ) : count === 0 ? (
        <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
          {t('impactCalculator.noItems')}
        </p>
      ) : (
        ids.map((id) => (
          <ItemName key={id} id={id} query={query.trim()}>
            <CalculatorItemCard id={id} carbonPerToken={carbonPerToken} />
          </ItemName>
        ))
      )}
    </section>
  )
}

export function ImpactCalculator(): JSX.Element {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()

  return (
    <ScreenPage pageTitle={t('impactCalculator.title')}>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-5">
        <ImpactPerToken />
        <div className="grid grid-cols-2 gap-5 items-start">
          <FundTrees />
          {isConnected && address ? (
            <CertificatesCard address={address} userType={7} impactCalculatorPage />
          ) : (
            <section className="p-5 rounded-2xl bg-card-primary">
              <p className="text-white font-bold">{t('profile.certificates')}</p>
              <p className="text-gray-400 text-sm mt-1">
                {t('impactCalculator.connectToSeeCertificate')}
              </p>
            </section>
          )}
        </div>
        <CalculatorItems />
      </div>
    </ScreenPage>
  )
}
