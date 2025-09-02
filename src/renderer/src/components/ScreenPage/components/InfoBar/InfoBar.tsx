import { useEra } from '@renderer/hooks/useEra'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { useTranslation } from 'react-i18next'
import { TimesUser } from './TimesUser/TimesUser'

export function InfoBar(): JSX.Element {
  const { t } = useTranslation()
  const { currentEpoch, currentEra, nextEraIn } = useEra()
  const { userType } = useUserContext()

  return (
    <div className="flex items-center gap-8 w-full min-h-10 bg-green-700 px-5 overflow-y-hidden overflow-x-auto">
      <p className="text-gray-300 text-xs">
        {t('infoBar.currentEra')}:{' '}
        <span className="text-white font-semibold text-sm">{currentEra}</span>
      </p>

      <p className="text-gray-300 text-xs">
        {t('infoBar.nextEraIn')}:{' '}
        <span className="text-white font-semibold text-sm">
          {Intl.NumberFormat('pt-BR').format(nextEraIn)} {t('infoBar.blocks')}
        </span>
      </p>

      <p className="text-gray-300 text-xs">
        {t('infoBar.currentEpoch')}:{' '}
        <span className="text-white font-semibold text-sm">{currentEpoch}</span>
      </p>

      {userType !== 0 && <TimesUser />}
    </div>
  )
}
