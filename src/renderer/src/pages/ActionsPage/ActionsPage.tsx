import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { GeneralActions } from './components/GeneralActions/GeneralActions'

export function ActionsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('actions')}>
      <GeneralActions />
    </ScreenPage>
  )
}
