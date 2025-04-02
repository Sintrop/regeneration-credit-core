import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'

export function RcStatsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('rcStatsPage')}>
      RC stats page
    </ScreenPage>
  )
}
