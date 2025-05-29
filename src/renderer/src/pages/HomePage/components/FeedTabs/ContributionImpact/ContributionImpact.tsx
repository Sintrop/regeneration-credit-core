import { useImpactPerToken } from '@renderer/hooks/useImpactPerToken'
import { useTranslation } from 'react-i18next'

interface Props {
  burnedTokens: number
}

export function ContributionImpact({ burnedTokens }: Props): JSX.Element {
  const { t } = useTranslation()
  const { biodiversityPerToken, carbonPerToken, soilPerToken, treesPerToken } = useImpactPerToken()

  let totalCarbonImpact = 0
  let totalSoilImpact = 0
  let totalBiodiversityImpact = 0
  let totalTreesImpact = 0

  totalCarbonImpact = carbonPerToken * burnedTokens
  totalSoilImpact = soilPerToken * burnedTokens
  totalBiodiversityImpact = biodiversityPerToken * burnedTokens
  totalTreesImpact = treesPerToken * burnedTokens

  return (
    <div className="flex flex-col w-full border rounded-2xl border-container-secondary p-2 mt-5">
      <p className="text-gray-300 text-sm text-center">{t('impact')}</p>

      <div className="flex flex-col mt-1">
        <ImpactItem
          label={t('carbon')}
          value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(totalCarbonImpact)}
          suffix="g"
        />
        <ImpactItem
          label={t('soil')}
          value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(totalSoilImpact)}
          suffix="m²"
        />
        <ImpactItem
          label={t('bio.')}
          value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(
            totalBiodiversityImpact
          )}
          suffix="und"
        />
        <ImpactItem
          label={t('trees')}
          value={Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(totalTreesImpact)}
          suffix="und"
        />
      </div>
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
