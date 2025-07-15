import { useTranslation } from 'react-i18next'

interface Props {
  status: number
}

export function StatusInspection({ status }: Props): JSX.Element {
  const { t } = useTranslation()

  if (status === 0) {
    return (
      <div className="w-fit px-5 h-8 flex items-center justify-center rounded-2xl border-2 border-yellow-500">
        <p className="font-semibold text-yellow-500">{t('open')}</p>
      </div>
    )
  }

  if (status === 1) {
    return (
      <div className="w-fit px-5 h-8 flex items-center justify-center rounded-2xl border-2 border-blue-500">
        <p className="font-semibold text-blue-500">{t('accepted')}</p>
      </div>
    )
  }

  if (status === 2) {
    return (
      <div className="w-fit px-5 h-8 flex items-center justify-center rounded-2xl border-2 border-green-500">
        <p className="font-semibold text-green-500">{t('realized')}</p>
      </div>
    )
  }

  if (status === 3) {
    return (
      <div className="w-fit px-5 h-8 flex items-center justify-center rounded-2xl border-2 border-red-500">
        <p className="font-semibold text-orange-500">{t('expired')}</p>
      </div>
    )
  }

  if (status === 4) {
    return (
      <div className="w-fit px-5 h-8 flex items-center justify-center rounded-2xl border-2 border-red-500">
        <p className="font-semibold text-red-500">{t('invalidated')}</p>
      </div>
    )
  }

  return <div />
}
