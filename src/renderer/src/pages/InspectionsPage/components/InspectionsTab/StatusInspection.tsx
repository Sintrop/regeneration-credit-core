import { useTranslation } from 'react-i18next'

interface Props {
  status: number
}

export function StatusInspection({ status }: Props): JSX.Element {
  const { t } = useTranslation()

  if (status === 0) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-yellow-500">
        <p className="font-semibold text-white">{t('open')}</p>
      </div>
    )
  }

  if (status === 1) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-blue-500">
        <p className="font-semibold text-white">{t('accepted')}</p>
      </div>
    )
  }

  if (status === 2) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-green-500">
        <p className="font-semibold text-white">{t('realized')}</p>
      </div>
    )
  }

  if (status === 3) {
    return (
      <div className="px-5 h-8 flex items-center justify-center rounded-2xl bg-red-500">
        <p className="font-semibold text-white">{t('invalidated')}</p>
      </div>
    )
  }

  return <div />
}
