import { StatsItem } from './StatsItem'
import { useTranslation } from 'react-i18next'

export function Stats(): JSX.Element {
  const { t } = useTranslation()
  return (
    <section className="flex flex-col gap-3">
      <p className="text-white">Stats</p>

      <div className="flex flex-wrap gap-5">
        <StatsItem title={t('atualBlock')} value="15248" />
        <StatsItem title={t('eraAtual')} value="2" />
        <StatsItem title={t('nextEraInBlocks')} value="2600" />
        <StatsItem title={t('atualEpoch')} value="1" />
        <StatsItem title={t('nextEpochIn')} value="25600" />
        <StatsItem title={t('priceRC')} value="$1,52" />
        <StatsItem title={t('circulatingRC')} value="2558495465146" />
        <StatsItem title={t('nextEpochIn')} value="25600" />
      </div>
    </section>
  )
}
