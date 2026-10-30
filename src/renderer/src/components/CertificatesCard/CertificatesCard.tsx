import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'
import { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BiSolidDownload } from 'react-icons/bi'
import { QRCode } from 'react-qrcode-logo'
import { toast } from 'react-toastify'
import { Abi, formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { Jazzicon } from '@ukstv/jazzicon-react'

import BGFlorest from '@renderer/assets/images/bg-florest.jpg'
import RCLogo from '@renderer/assets/images/rc.png'
import { useCurrentBlock } from '@renderer/domain/Chain/useCases/useBlockNumber'
import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useRegeneratorInspections } from '@renderer/hooks/useRegeneratorInspections'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import {
  rcAbi,
  rcAddress,
  regeneratorAbi,
  regeneratorAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { formatArea } from '@renderer/utils/formatArea'
import { formatCarbon } from '@renderer/utils/formatCarbon'
import { profileUrl } from '@renderer/utils/profileUrl'

interface CertificateProps {
  fileName: string
  title: string
  name: string
  photo?: string
  address: string
  typeLabel: string
  highlight: { label: string; value: string }
  stats: { label: string; value: string }[]
  qr: string
}

/** One certificate layout for every type; it is also what gets saved as PNG. */
function Certificate({
  fileName,
  title,
  name,
  photo,
  address,
  typeLabel,
  highlight,
  stats,
  qr
}: CertificateProps): JSX.Element {
  const { t, i18n } = useTranslation()
  const { ipfsGatewayURL } = useSettingsContext()
  const { blockNumber } = useCurrentBlock()
  const node = useRef<HTMLDivElement>(null)

  async function save(): Promise<void> {
    if (!node.current) return
    try {
      const dataUrl = await htmlToImage.toPng(node.current, { pixelRatio: 2, cacheBust: true })
      download(dataUrl, `${fileName}.png`)
    } catch {
      toast.error(t('certificate.downloadError'))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={node}
        className="w-full rounded-2xl overflow-hidden bg-[#0b2219] border border-green-primary/40 text-white"
      >
        <div className="relative h-24">
          <img src={BGFlorest} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2219] via-[#0b2219]/80 to-transparent" />
          <div className="relative h-full px-6 flex items-center gap-3">
            <img src={RCLogo} className="w-10 h-10 object-contain" />
            <div>
              <p className="font-bold uppercase tracking-wide">{t('common.regenerationCredit')}</p>
              <p className="text-green-primary text-xs font-semibold uppercase tracking-wider">
                {title}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-green-primary">
                <Jazzicon address={address} className="w-full h-full" />
                {photo && (
                  <img
                    src={`${ipfsGatewayURL}/ipfs/${photo}`}
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold truncate">{name}</p>
                <p className="text-green-primary text-sm">{typeLabel}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs">{highlight.label}</p>
              <p className="text-green-primary text-3xl font-bold">{highlight.value}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-[#173d2e]">
                  <p className="font-bold">{stat.value}</p>
                  <p className="text-gray-400 text-[11px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center gap-2">
            <div className="p-2 rounded-xl bg-white">
              <QRCode
                value={qr}
                size={132}
                qrStyle="fluid"
                logoImage={RCLogo}
                logoWidth={28}
                logoHeight={28}
                logoPadding={2}
                logoPaddingStyle="circle"
                quietZone={0}
              />
            </div>
            <p className="text-gray-400 text-[11px] text-center w-[148px]">
              {t('certificate.scanToVerify')}
            </p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between gap-4 text-[11px] text-gray-400">
          <span className="font-mono truncate">{address}</span>
          <span className="shrink-0">
            {t('certificate.verifiedAt', {
              block: Intl.NumberFormat(i18n.language).format(blockNumber)
            })}
          </span>
        </div>
      </div>
      <button
        onClick={save}
        className="self-end flex items-center gap-2 h-9 px-4 rounded-xl border border-green-primary/50 text-green-primary text-sm font-semibold hover:bg-green-primary/10 hover:cursor-pointer"
      >
        <BiSolidDownload size={16} />
        {t('certificate.download')}
      </button>
    </div>
  )
}

function RegeneratorCertificate({ address }: { address: string }): JSX.Element | null {
  const { t, i18n } = useTranslation()
  const { data } = useReadContract({
    address: regeneratorAddress as `0x${string}`,
    abi: regeneratorAbi as Abi,
    functionName: 'getRegenerator',
    args: [address]
  })
  const { treesAverage, bioAverage, isLoading } = useRegeneratorInspections(address)
  const regenerator = data as
    | {
        name: string
        proofPhoto: string
        totalArea: bigint
        totalInspections: bigint
        regenerationScore: { score: bigint }
      }
    | undefined
  if (!regenerator) return null
  const format = (value: number): string => Intl.NumberFormat(i18n.language).format(value)
  const pending = isLoading ? '—' : undefined

  return (
    <Certificate
      fileName={`regenerator-certificate-${address.slice(2, 8)}`}
      title={t('certificate.regeneratorTitle')}
      name={regenerator.name}
      photo={regenerator.proofPhoto}
      address={address}
      typeLabel={t('regenerator')}
      highlight={{
        label: t('certificate.regenerationScore'),
        value: format(Number(regenerator.regenerationScore.score))
      }}
      stats={[
        {
          label: t('certificate.totalArea'),
          value: formatArea(Number(regenerator.totalArea), i18n.language)
        },
        {
          label: t('certificate.totalInspections'),
          value: format(Number(regenerator.totalInspections))
        },
        { label: t('certificate.treesAverage'), value: pending ?? format(treesAverage) },
        { label: t('certificate.bioAverage'), value: pending ?? format(bioAverage) }
      ]}
      qr={profileUrl('regenerator', address, regenerator.name)}
    />
  )
}

function SupporterCertificate({ address }: { address: string }): JSX.Element {
  const { t, i18n } = useTranslation()
  const impact = useImpactPerToken()
  const { data: supporter } = useReadContract({
    address: supporterAddress as `0x${string}`,
    abi: supporterAbi as Abi,
    functionName: 'getSupporter',
    args: [address]
  })
  const { data: certified } = useReadContract({
    address: rcAddress as `0x${string}`,
    abi: rcAbi as Abi,
    functionName: 'certificate',
    args: [address]
  })
  const tokens = Number(formatUnits((certified as bigint | undefined) ?? 0n, 18))
  const name = (supporter as { name?: string; profilePhoto?: string } | undefined)?.name ?? ''
  const photo = (supporter as { profilePhoto?: string } | undefined)?.profilePhoto
  const format = (value: number, digits = 2): string =>
    Intl.NumberFormat(i18n.language, { maximumFractionDigits: digits }).format(value)

  return (
    <Certificate
      fileName={`supporter-certificate-${address.slice(2, 8)}`}
      title={t('certificate.supporterTitle')}
      name={name}
      photo={photo}
      address={address}
      typeLabel={t('supporter')}
      highlight={{ label: t('certificate.contributedWith'), value: `${format(tokens)} RC` }}
      stats={[
        {
          label: t('supporterProfile.carbon'),
          value: formatCarbon(tokens * impact.carbonPerToken, i18n.language)
        },
        { label: t('trees'), value: format(tokens * impact.treesPerToken) },
        { label: t('biodiversity'), value: format(tokens * impact.biodiversityPerToken) },
        { label: t('home.area'), value: formatArea(tokens * impact.soilPerToken, i18n.language) }
      ]}
      qr={profileUrl('supporter', address, name)}
    />
  )
}

function Section({ children }: { children: ReactNode }): JSX.Element {
  const { t } = useTranslation()
  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
      <div>
        <p className="text-white font-bold">{t('certificate.certificates')}</p>
        <p className="text-gray-400 text-xs">{t('certificate.hint')}</p>
      </div>
      {children}
    </section>
  )
}

interface Props {
  address: string
  userType: number
  /** On the impact calculator the certificate shows without the section frame. */
  impactCalculatorPage?: boolean
}

export function CertificatesCard({
  address,
  userType,
  impactCalculatorPage
}: Props): JSX.Element | null {
  if (userType === 1) {
    return (
      <Section>
        <RegeneratorCertificate address={address} />
      </Section>
    )
  }
  if (userType === 7 || impactCalculatorPage) {
    return impactCalculatorPage ? (
      <SupporterCertificate address={address} />
    ) : (
      <Section>
        <SupporterCertificate address={address} />
      </Section>
    )
  }
  return null
}
