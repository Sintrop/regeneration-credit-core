import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { IPFSSettings } from './components/IPFSSettings'

export function SettingsPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('settings')}>
      <div className="flex flex-col w-[500px] gap-5">
        <IPFSSettings />
      </div>
    </ScreenPage>
  )
}
