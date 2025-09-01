import { useEra } from '@renderer/hooks/useEra'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { useTranslation } from 'react-i18next'
import { TimesUser } from './TimesUser/TimesUser'

export function InfoBar(): JSX.Element {
  const { t } = useTranslation()
  const { currentEpoch, currentEra, nextEraIn } = useEra()
  const { userType } = useUserContext()

  return (
    <div className="flex items-center gap-8 w-full min-h-10 bg-green-700 px-5">
      <p className="text-gray-300 text-sm">
        {t('infoBar.currentEra')}:{' '}
        <span className="text-white font-semibold text-base">{currentEra}</span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('infoBar.nextEraIn')}:{' '}
        <span className="text-white font-semibold text-base">
          {Intl.NumberFormat('pt-BR').format(nextEraIn)} {t('infoBar.blocks')}
        </span>
      </p>

      <p className="text-gray-300 text-sm">
        {t('infoBar.currentEpoch')}:{' '}
        <span className="text-white font-semibold text-base">{currentEpoch}</span>
      </p>

      {userType !== 0 && <TimesUser />}
    </div>
  )
}
