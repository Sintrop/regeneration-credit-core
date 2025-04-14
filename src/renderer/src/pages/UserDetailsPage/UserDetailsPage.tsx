import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export function UserDetailsPage(): JSX.Element {
  const { t } = useTranslation()
  const params = useParams()

  return (
    <ScreenPage pageTitle={t('userDetails')}>
      {params?.address}
    </ScreenPage>
  )
}
