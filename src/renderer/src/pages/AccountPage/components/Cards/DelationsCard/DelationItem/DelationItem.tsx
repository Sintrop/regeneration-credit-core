import { useTranslation } from 'react-i18next'
import { DelationProps } from '@renderer/types/community'
import { Informer } from './Informer'

interface Props {
  delation: DelationProps
}
export function DelationItem({ delation }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full border-b border-container-secondary pb-2">
      <Informer informer={delation.informer} />
      <p className="text-sm text-gray-300">{t('account.titleDelation')}</p>
      <p className="text-white text-sm">{delation.title}</p>

      <p className="text-sm text-gray-300 mt-2">{t('account.description')}</p>
      <p className="text-white text-sm">{delation.testimony}</p>
    </div>
  )
}
