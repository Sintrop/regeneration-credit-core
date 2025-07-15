import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useTranslation } from 'react-i18next'

interface Props {
  certificateTokens: string
  name?: string
  address?: string
}

export function ContributionCertificate({ certificateTokens, name, address }: Props): JSX.Element {
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
    <div className="flex flex-col rounded-2xl bg-green-card p-3 w-[500px]">
      <div className="flex flex-col items-center justify-center w-full h-14 border-b border-container-secondary pb-2">
        <p className="text-white font-bold">{name}</p>

        <p className="text-white">
          {t('contributedWith')}{' '}
          <span className="font-bold text-green-600 text-lg">
            {Intl.NumberFormat('pt-BR').format(parseInt(certificateTokens))}
          </span>{' '}
          RC
        </p>
      </div>

      <div className="flex items-center h-full w-full mt-1">
        <div className="flex flex-col flex-1 p-3 h-full">
          <p className="text-gray-300 text-sm">{t('impact')}</p>
          <ImpactItem
            label={t('carbon')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalCarbonImpact
            )}
            suffix="g"
          />
          <ImpactItem
            label={t('soil')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(totalSoilImpact)}
            suffix="m²"
          />
          <ImpactItem
            label={t('bio.')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalBiodiversityImpact
            )}
            suffix="und"
          />
          <ImpactItem
            label={t('trees')}
            value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
              totalTreesImpact
            )}
            suffix="und"
          />
        </div>

        <div className="flex-1 h-full flex flex-col items-center justify-center">
          <p className="text-white">qr-code</p>
          <div className="w-36 h-36 bg-white" />
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
