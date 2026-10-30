import { useTranslation } from 'react-i18next'

export function MethodTag({ methodType }: { methodType: string }): JSX.Element {
  const { t } = useTranslation()
  const read = methodType === 'view' || methodType === 'pure'
  return (
    <span
      className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-semibold ${
        read ? 'bg-blue-primary/20 text-blue-primary' : 'bg-amber-400/20 text-amber-300'
      }`}
    >
      {read ? t('contracts.filter.read') : t('contracts.filter.write')}
      {methodType === 'payable' ? ' · SIN' : ''}
    </span>
  )
}
