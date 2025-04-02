import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { TokenData } from './components/TokenData/TokenData'

export function RcStatsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('rcStatsPage')}>
      <TokenData />
    </ScreenPage>
  )
}
