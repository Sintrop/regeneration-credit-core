import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo'
import { BiSolidDownload } from 'react-icons/bi'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'

import RCLogo from '@renderer/assets/images/rc.png'

interface Props {
  address: string
  url: string
  name?: string
  proofPhoto?: string
  totalInspections?: number
  totalArea?: number
  score?: number
  showDownload?: boolean
}

export function RegeneratorCertificate2({
  name,
  address,
  url,
  score,
  showDownload,
  totalArea,
  totalInspections
}: Props): JSX.Element {
  const { t } = useTranslation()

  async function handleDownload(): Promise<void> {
    const certificate = document.getElementById('regenerator-certificate-version2')
    if (!certificate) return

    htmlToImage
      .toPng(certificate)
      .then((dataUrl) => download(dataUrl, 'regenerator-certificate-version-2'))
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <p className="text-gray-300 text-sm">{t('certificate.version2')}</p>

        {showDownload && (
          <button onClick={handleDownload} className="flex items-center gap-1 hover:cursor-pointer">
            <BiSolidDownload size={20} color="white" />
            <p className="text-white font-semibold">{t('certificate.download')}</p>
          </button>
        )}
      </div>
      <div
        id="regenerator-certificate-version2"
        className="flex flex-col rounded-2xl bg-green-card p-3 w-full border border-white"
      >
        <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
          <div className="flex gap-3 items-center">
            <img src={RCLogo} className="w-10 h-10 object-contain" />
            <p className="font-semibold text-white text-lg">{t('common.regenerationCredit')}</p>
          </div>
        </div>

        <div className="flex items-center h-full w-full mt-3">
          <div className="flex flex-col flex-1 p-3 h-full">
            <p className="text-white">{name}</p>

            <p className="text-gray-300 text-sm mt-1">{t('common.data')}</p>
            <DataItem label={t('certificate.regenerationScore')} value={score} />
            <DataItem
              label={t('certificate.totalArea')}
              value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(
                totalArea ? totalArea : 0
              )}
              suffix="m²"
            />
            <DataItem label={t('certificate.totalInspections')} value={totalInspections} />

            <DataItem label={t('common.bio')} value={totalInspections} />
            <DataItem label={t('common.trees')} value={totalInspections} />
          </div>

          <div className="flex-1 h-full flex flex-col items-center justify-center">
            <QRCode
              value={url}
              size={120}
              qrStyle="fluid"
              logoImage={RCLogo}
              logoWidth={25}
              logoHeight={25}
              logoPadding={1}
              logoPaddingStyle="circle"
            />
          </div>
        </div>

        <p className="text-white text-center text-sm mt-3">{address}</p>
      </div>
    </div>
  )
}

interface DataItemProps {
  label: string
  value?: string | number
  suffix?: string
}
function DataItem({ label, value, suffix }: DataItemProps): JSX.Element {
  return (
    <p className="text-white text-sm">
      {label}: <span className="font-bold">{value}</span> {suffix && suffix}
    </p>
  )
}
