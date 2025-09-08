import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo'
import RCLogo from '@renderer/assets/images/rc.png'

interface Props {
  certificateTokens: string
  url: string
  name?: string
  address?: string
}

export function ContributionCertificate({
  certificateTokens,
  name,
  address,
  url
}: Props): JSX.Element {
  const { t } = useTranslation()
  const { carbonPerToken, biodiversityPerToken, soilPerToken, treesPerToken } = useImpactPerToken()

  let totalCarbonImpact = 0
  let totalSoilImpact = 0
  let totalBiodiversityImpact = 0
  let totalTreesImpact = 0

  totalCarbonImpact = carbonPerToken * parseInt(certificateTokens)
  totalSoilImpact = soilPerToken * parseInt(certificateTokens)
  totalBiodiversityImpact = biodiversityPerToken * parseInt(certificateTokens)
  totalTreesImpact = treesPerToken * parseInt(certificateTokens)

  return (
    <div className="flex flex-col rounded-2xl bg-green-card p-3 w-full">
      <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
        <div className="flex gap-3 items-center">
          <img src={RCLogo} className="w-10 h-10 object-contain" />
          <p className="font-semibold text-white text-lg">{t('common.regenerationCredit')}</p>
        </div>
      </div>

      <div className="flex items-center h-full w-full mt-3">
        <div className="flex flex-col flex-1 p-3 h-full">
          <p className="text-white">{name}</p>
          <p className="text-white">
            {t('certificate.contributedWith')}{' '}
            <span className="font-bold text-green-600">
              {Intl.NumberFormat('pt-BR').format(parseInt(certificateTokens))}
            </span>{' '}
            RC
          </p>

          <p className="text-gray-300 text-sm mt-1">{t('common.impact')}</p>
          <ImpactItem
            label={t('common.carbon')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalCarbonImpact
            )}
            suffix="g"
          />
          <ImpactItem
            label={t('common.area')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(totalSoilImpact)}
            suffix="m²"
          />
          <ImpactItem
            label={t('common.bio')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalBiodiversityImpact
            )}
            suffix="und"
          />
          <ImpactItem
            label={t('common.trees')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalTreesImpact
            )}
            suffix="und"
          />
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
  )
}

interface ImpactItemProps {
  label: string
  value: string
  suffix?: string
}
function ImpactItem({ label, value, suffix }: ImpactItemProps): JSX.Element {
  return (
    <p className="text-white text-sm">
      {label}: <span className="font-bold">{value}</span> {suffix && suffix}
    </p>
  )
}
