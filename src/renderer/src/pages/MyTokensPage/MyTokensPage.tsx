import { useTranslation } from 'react-i18next'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { Balance } from './components/Balance'
import { SendTx } from './components/SendTx'

export function MyTokensPage(): JSX.Element {
  const { t } = useTranslation()

  return (
    <ScreenPage pageTitle={t('myTokens.title')}>
      <Balance />
      <SendTx />
    </ScreenPage>
  )
}
