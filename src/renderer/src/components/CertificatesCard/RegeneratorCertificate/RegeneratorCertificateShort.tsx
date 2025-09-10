import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo'
import { BiSolidDownload } from 'react-icons/bi'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'

import RCLogo from '@renderer/assets/images/rc.png'

interface Props {
  address: string
  url: string
  showDownload?: boolean
}

export function RegeneratorCertificateShort({ address, url, showDownload }: Props): JSX.Element {
  const { t } = useTranslation()

  async function handleDownload(): Promise<void> {
    const certificate = document.getElementById('regenerator-certificate-version-short')
    if (!certificate) return

    htmlToImage
      .toPng(certificate)
      .then((dataUrl) => download(dataUrl, 'regenerator-certificate-version-short'))
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <p className="text-gray-300 text-sm">{t('certificate.versionShort')}</p>

        {showDownload && (
          <button onClick={handleDownload} className="flex items-center gap-1 hover:cursor-pointer">
            <BiSolidDownload size={20} color="white" />
            <p className="text-white font-semibold">{t('certificate.download')}</p>
          </button>
        )}
      </div>
      <div
        id="regenerator-certificate-version-short"
        className="flex flex-col rounded-2xl gap-5 bg-green-card p-3 w-[250px] border border-white"
      >
        <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
          <div className="flex gap-3 items-center">
            <img src={RCLogo} className="w-8 h-8 object-contain" />
            <p className="font-semibold text-white">{t('common.regenerationCredit')}</p>
          </div>
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

        <p className="text-white text-center text-xs max-w-[240px] text-ellipsis truncate">
          {address}
        </p>
      </div>
    </div>
  )
}
