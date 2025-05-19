import { useEra } from '@renderer/hooks/useEra'
import { useTranslation } from 'react-i18next'

export function InfoBar(): JSX.Element {
  const { t } = useTranslation()
  const { currentEpoch, currentEra, nextEraIn } = useEra()

  return (
    <div className="flex items-center gap-8 w-full min-h-10 bg-green-700 px-5">
      <p className="text-gray-300 text-sm">
        {t('currentEra')}: <span className="text-white font-semibold text-base">{currentEra}</span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('nextEraIn')}:{' '}
        <span className="text-white font-semibold text-base">
          {Intl.NumberFormat('pt-BR').format(nextEraIn)} {t('blocks')}
        </span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('currentEpoch')}:{' '}
        <span className="text-white font-semibold text-base">{currentEpoch}</span>
      </p>
    </div>
  )
}
