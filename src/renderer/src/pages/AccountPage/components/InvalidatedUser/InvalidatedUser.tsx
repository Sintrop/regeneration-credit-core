import { useTranslation } from 'react-i18next'

export function InvalidatedUser(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('thisUserWasInvalidated')}</p>
    </div>
  )
}