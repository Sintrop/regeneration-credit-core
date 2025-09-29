import { useTranslation } from 'react-i18next'

interface Props {
  valid: boolean
}
export function InvalidatedResource({ valid }: Props): JSX.Element {
  const { t } = useTranslation()

  if (valid) return <div />

  return (
    <div className="w-full h-16 bg-red-500 flex items-center justify-center mb-5 rounded-2xl max-w-[1024px]">
      <p className="font-semibod text-white text-xl">{t('common.invalidatedResource')}</p>
    </div>
  )
}
