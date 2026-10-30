import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Img } from 'react-image'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import RCLogo from '@renderer/assets/images/rc.png'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useFeedUser } from '@renderer/hooks/useFeedUser'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'
import { FeedEvent } from '@renderer/services/feed/feedTypes'
import { SECONDS_PER_BLOCK } from '@renderer/utils/blocksToDuration'

type Tone = 'green' | 'blue' | 'amber' | 'teal' | 'red'

const TONES: Record<Tone, string> = {
  green: 'bg-green-primary/10 text-green-primary',
  blue: 'bg-blue-primary/10 text-blue-primary',
  amber: 'bg-amber-400/10 text-amber-300',
  teal: 'bg-teal-300/10 text-teal-200',
  red: 'bg-red-400/10 text-red-300'
}

function shortAddress(address: string): string {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}

function useFormat(): (value: number, digits?: number) => string {
  const { i18n } = useTranslation()
  return (value, digits = 2) => Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)
}

/** "~3 days ago" from the block distance, at the Sintrop block time. */
function useAgo(): (blockNumber: number, currentBlock: number) => string {
  const { t } = useTranslation()
  return (blockNumber, currentBlock) => {
    if (!currentBlock || currentBlock <= blockNumber) return ''
    const seconds = (currentBlock - blockNumber) * SECONDS_PER_BLOCK
    if (seconds < 3600) return t('feedNews.agoMinutes', { count: Math.max(1, Math.round(seconds / 60)) })
    if (seconds < 86400) return t('feedNews.agoHours', { count: Math.round(seconds / 3600) })
    return t('feedNews.agoDays', { count: Math.round(seconds / 86400) })
  }
}

function Avatar({ address, photo, size = 40 }: { address: string; photo?: string; size?: number }): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()
  return (
    <div className="relative rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
      <Jazzicon className="w-full h-full" address={address} />
      {photo && (
        <Img src={`${ipfsGatewayURL}/ipfs/${photo}`} className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  )
}

function Header({ event, currentBlock }: { event: FeedEvent; currentBlock: number }): JSX.Element {
  const navigate = useNavigate()
  const ago = useAgo()
  const user = useFeedUser(event.actor)
  const when = ago(event.blockNumber, currentBlock)

  return (
    <button
      className="flex items-center gap-3 text-left hover:cursor-pointer"
      onClick={() => navigate(`/user-details/${event.actor}`)}
    >
      <Avatar address={event.actor} photo={user.photo} />
      <div className="min-w-0">
        <p className="text-white font-semibold truncate">{user.name || shortAddress(event.actor)}</p>
        <p className="text-gray-400 text-xs">
          {shortAddress(event.actor)}
          {when && ` · ${when}`} · {`#${event.blockNumber}`}
        </p>
      </div>
    </button>
  )
}

function Badge({ label, tone }: { label: string; tone: Tone }): JSX.Element {
  return (
    <span className={`self-start inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${TONES[tone]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

function Amount({ value, unit = 'RC' }: { value: number; unit?: string }): JSX.Element {
  const format = useFormat()
  return (
    <div className="flex items-center gap-3">
      {unit === 'RC' && <img src={RCLogo} className="w-8 h-8 object-contain" />}
      <p className="text-white text-2xl font-bold">
        {format(value)} <span className="text-gray-300 text-base font-semibold">{unit}</span>
      </p>
    </div>
  )
}

function Link({ label, onClick }: { label: string; onClick: () => void }): JSX.Element {
  return (
    <button className="self-start text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer" onClick={onClick}>
      {label} ›
    </button>
  )
}

function UserRow({ label, address }: { label: string; address: string }): JSX.Element {
  const navigate = useNavigate()
  const user = useFeedUser(address)
  return (
    <button
      className="flex items-center gap-3 p-3 rounded-xl bg-card-secondary text-left hover:cursor-pointer hover:bg-card-secondary/70"
      onClick={() => navigate(`/user-details/${address}`)}
    >
      <Avatar address={address} photo={user.photo} size={32} />
      <div className="min-w-0">
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white font-semibold truncate">{user.name || shortAddress(address)}</p>
        {user.userType > 0 && <UserTypeToText userType={user.userType} className="text-green-primary text-xs" />}
      </div>
    </button>
  )
}

function Stat({ value, label }: { value: string; label: string }): JSX.Element {
  return (
    <div className="flex-1 p-3 rounded-xl bg-card-secondary">
      <p className="text-white text-lg font-bold">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

function CalculatorItemName({ id }: { id: number }): JSX.Element {
  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi as Abi,
    functionName: 'getCalculatorItem',
    args: [id],
    query: { staleTime: Infinity }
  })
  const item = data as { item?: string } | undefined
  return <>{item?.item ?? `#${id}`}</>
}

function ResearchTitle({ id }: { id: number }): JSX.Element | null {
  const { data } = useReadContract({
    address: researcherAddress,
    abi: researcherAbi as Abi,
    functionName: 'getResearch',
    args: [id],
    query: { staleTime: Infinity }
  })
  const research = data as { title?: string } | undefined
  return research?.title ? <p className="text-white font-semibold">{research.title}</p> : null
}

function Body({ event }: { event: FeedEvent }): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const format = useFormat()
  const { carbonPerToken } = useImpactPerToken()
  const d = event.data
  const n = (key: string): number => Number(d[key] ?? 0)
  const s = (key: string): string => String(d[key] ?? '')
  const resource = (type: string, id: number): void => {
    navigate(`/resource-details/${type}/${id}`)
  }

  switch (event.kind) {
    case 'inspectionRequested':
      return (
        <>
          <Badge label={t('feedNews.inspectionRequested', { id: n('inspectionId') })} tone="amber" />
          <p className="text-gray-200">{t('feedNews.inspectionRequestedText')}</p>
          <Link label={t('feedNews.seeInspection')} onClick={() => resource('inspection', n('inspectionId'))} />
        </>
      )
    case 'inspectionAccepted':
      return (
        <>
          <Badge label={t('feedNews.inspectionAccepted', { id: n('inspectionId') })} tone="blue" />
          <p className="text-gray-200">{t('feedNews.inspectionAcceptedText')}</p>
          <Link label={t('feedNews.seeInspection')} onClick={() => resource('inspection', n('inspectionId'))} />
        </>
      )
    case 'inspectionRealized':
      return (
        <>
          <Badge label={t('feedNews.inspectionRealized', { id: n('inspectionId') })} tone="green" />
          <UserRow label={t('feedNews.regenerator')} address={s('regeneratorAddress')} />
          <div className="flex gap-2">
            <Stat value={format(n('treesResult'), 0)} label={t('feedNews.trees')} />
            <Stat value={format(n('biodiversityResult'), 0)} label={t('feedNews.species')} />
            <Stat value={format(n('regenerationScore'), 0)} label={t('feedNews.score')} />
          </div>
          <Link label={t('feedNews.seeInspection')} onClick={() => resource('inspection', n('inspectionId'))} />
        </>
      )
    case 'regeneratorEnteredPool':
      return (
        <>
          <Badge label={t('feedNews.enteredPoolBadge')} tone="green" />
          <p className="text-gray-200">{t('feedNews.enteredPoolText')}</p>
        </>
      )
    case 'offset':
      return (
        <>
          <Badge label={t('feedNews.offsetBadge')} tone="teal" />
          <Amount value={n('amount')} />
          <p className="text-gray-300">
            {t('feedNews.offsetting')} <CalculatorItemName id={n('calculatorItemId')} />
          </p>
          {!!s('message') && <p className="text-gray-100 italic border-l-2 border-teal-300/50 pl-3">“{s('message')}”</p>}
          {carbonPerToken > 0 && (
            <p className="text-gray-400 text-sm">
              {t('feedNews.offsetImpact', { amount: formatCarbon(n('amount') * carbonPerToken, format) })}
            </p>
          )}
        </>
      )
    case 'treeFunding':
      return (
        <>
          <Badge label={t('feedNews.treeFundingBadge')} tone="green" />
          <Amount value={n('amount')} />
          <p className="text-gray-400 text-sm">{t('feedNews.treeFundingText')}</p>
        </>
      )
    case 'commitment':
      return (
        <>
          <Badge label={t('feedNews.commitmentBadge')} tone="teal" />
          <p className="text-gray-200">
            {t('feedNews.commitmentText')} <span className="font-semibold text-white"><CalculatorItemName id={n('calculatorItemId')} /></span>
          </p>
        </>
      )
    case 'research':
      return (
        <>
          <Badge label={t('feedNews.researchBadge', { id: n('researchId') })} tone="green" />
          <ResearchTitle id={n('researchId')} />
          <Link label={t('feedNews.read')} onClick={() => resource('research', n('researchId'))} />
        </>
      )
    case 'report':
      return (
        <>
          <Badge label={t('feedNews.reportBadge', { id: n('id') })} tone="blue" />
          <p className="text-gray-100 line-clamp-4">{s('description')}</p>
          <Link label={t('feedNews.read')} onClick={() => resource('report', n('id'))} />
        </>
      )
    case 'contribution':
      return (
        <>
          <Badge label={t('feedNews.contributionBadge', { id: n('id') })} tone="amber" />
          <p className="text-gray-100 line-clamp-4">{s('description')}</p>
          <Link label={t('feedNews.read')} onClick={() => resource('contribution', n('id'))} />
        </>
      )
    case 'userRegistered':
      return (
        <>
          <Badge label={t('feedNews.newUserBadge')} tone="green" />
          <p className="text-gray-200">
            {t('feedNews.joinedAs')} <UserTypeToText userType={n('userType')} className="inline text-green-primary font-semibold" />
          </p>
        </>
      )
    case 'invitation':
      return (
        <>
          <Badge label={t('feedNews.invitationBadge')} tone="blue" />
          <p className="text-gray-200">
            {t('feedNews.invitedToBe')} <UserTypeToText userType={n('invitedType')} className="inline text-green-primary font-semibold" />
          </p>
          <UserRow label={t('feedNews.invited')} address={s('invited')} />
        </>
      )
    case 'delation':
      return (
        <>
          <Badge label={t('feedNews.delationBadge')} tone="red" />
          <UserRow label={t('feedNews.reported')} address={s('reported')} />
        </>
      )
    case 'withdrawal':
      return (
        <>
          <Badge label={t('feedNews.withdrawalBadge', { era: n('era') })} tone="green" />
          <Amount value={n('amount')} />
          <p className="text-gray-400 text-sm">{t(`feedNews.pool.${n('poolType')}`)}</p>
        </>
      )
    case 'transfer':
      return (
        <>
          <Badge label={t('feedNews.transferBadge')} tone="teal" />
          <Amount value={n('amount')} />
          <UserRow label={t('feedNews.to')} address={s('to')} />
        </>
      )
  }
}

function formatCarbon(grams: number, format: (value: number, digits?: number) => string): string {
  if (grams >= 1e6) return `${format(grams / 1e6)} t`
  if (grams >= 1e3) return `${format(grams / 1e3)} kg`
  return `${format(Math.max(0, grams))} g`
}

export function FeedCard({ event, currentBlock }: { event: FeedEvent; currentBlock: number }): JSX.Element {
  return (
    <article className="flex flex-col gap-3 p-5 rounded-2xl bg-card-primary">
      <Header event={event} currentBlock={currentBlock} />
      <Body event={event} />
    </article>
  )
}

export function FeedSection({ children }: { children: ReactNode }): JSX.Element {
  return <div className="flex flex-col gap-4">{children}</div>
}
