import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { TokenData } from './components/TokenData/TokenData'
import { TokenImpact } from './components/TokenImpact/TokenImpact'
import { ImpactPerEra } from './components/ImpactPerEra/ImpactPerEra'

export function RcStatsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('tokenImpact.title')}>
      <TokenData />
      <TokenImpact />
      <ImpactPerEra />
    </ScreenPage>
  )
}
