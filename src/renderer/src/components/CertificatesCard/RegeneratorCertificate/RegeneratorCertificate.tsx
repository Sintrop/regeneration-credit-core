import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo'
import RCLogo from '@renderer/assets/images/rc.png'
import BGdefault from '@renderer/assets/images/bg-florest.jpg'
import { Jazzicon } from '@ukstv/jazzicon-react'

interface Props {
  address: string
  url: string
  name?: string
  proofPhoto?: string
  totalInspections?: number
  totalArea?: number
  score?: number
}

export function RegeneratorCertificate({
  address,
  name,
  score,
  totalArea,
  totalInspections,
  proofPhoto,
  url
}: Props): JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white w-full border">
      <div className="w-full bg-green-700 h-16 flex items-center relative">
        <img src={BGdefault} className="w-full h-full object-cover" />

        <div className="flex items-center pl-5 gap-5 w-full h-full bg-black/50 absolute top-0 left-0">
          <div className="flex items-center gap-2">
            <img src={RCLogo} className="w-9 h-9 object-contain" />
            <p className="font-semibold text-white uppercase">{t('regenerationCredit')}</p>
          </div>

          <div className="h-0.5 w-[50%] bg-white" />
        </div>
      </div>

      <div className="flex w-full">
        <div className="w-[160px] h-[170px] border-r flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full relative">
            <Jazzicon address={address} className="w-full h-full" />
            {proofPhoto && (
              <img
                src={`https://ipfs.sintrop.com/ipfs/${proofPhoto}`}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          <p className="font-bold text-black text-center text-sm mt-2">{name}</p>
          <p className="text-center text-xs">{t('regenerator')}</p>
        </div>

        <div className="flex flex-col p-3 flex-1 bg-[#155915]/10">
          <div className="flex flex-col w-full h-full border">
            <div className="flex w-full h-9 pl-3 items-center border-b">
              <p className="text-xs">
                {t('totalArea')}: {totalArea} m2
              </p>
            </div>
            <div className="flex w-full h-9 pl-3 items-center border-b">
              <p className="text-xs">
                {t('totalInspections')}: {totalInspections}
              </p>
            </div>
            <div className="flex w-full h-9 pl-3 items-center border-b">
              <p className="text-xs">
                {t('biodiversity')}: {totalInspections}
              </p>
            </div>
            <div className="flex w-full h-9 pl-3 items-center">
              <p className="text-xs">
                {t('trees')}: {totalInspections}
              </p>
            </div>
          </div>
        </div>

        <div className="w-[160px] h-[170px] border-l flex flex-col items-center justify-center">
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

      <div className="flex w-full h-10 bg-[#155915]/10 px-5 items-center border-t border-b">
        <p className="text-black text-sm">
          {t('regenerationScore')}: {score}
        </p>
      </div>

      <div className="flex w-full h-10 px-5 items-center justify-between">
        <p className="text-black text-xs">{address}</p>
      </div>
    </div>
  )
}
