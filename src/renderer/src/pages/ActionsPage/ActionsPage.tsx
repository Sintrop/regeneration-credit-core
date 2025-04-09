import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { GeneralActions } from './components/GeneralActions/GeneralActions'
import { UserTypeActions } from './components/UserTypeActions/UserTypeActions'

export function ActionsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('actions')}>
      <div className="flex flex-col gap-5">
        <GeneralActions />
        <UserTypeActions />
      </div>
    </ScreenPage>
  )
}
