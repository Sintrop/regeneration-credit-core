import { useTranslation } from 'react-i18next'

interface Props {
  valid: boolean
}

export function ValidTag({ valid }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div
      className={`w-fit px-5 py-1 rounded-xl border-2 ${valid ? 'border-green-600' : 'border-red-500'}`}
    >
      <p className={`text-sm font-semibold ${valid ? 'text-green-600' : 'text-red-500'}`}>
        {valid ? t('valid') : t('invalid')}
      </p>
    </div>
  )
}
