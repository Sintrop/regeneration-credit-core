import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useEra } from '@renderer/hooks/useEra'
import { blocksToDays } from '@renderer/utils/blocksToDuration'

/** Current era and time to the next one, read from RegeneratorPool. Hidden until the chain answers. */
export function EraChip(): JSX.Element | null {
  const { t, i18n } = useTranslation()
  const { currentEra, nextEraIn } = useEra()
  const navigate = useNavigate()

  if (currentEra < 1) return null

  return (
    <button
      onClick={() => navigate('/eras')}
      className="flex items-center gap-2 h-9 px-3 rounded-xl bg-card-primary hover:bg-card-primary/70 text-sm hover:cursor-pointer"
      title={`${t('shell.nextEraIn', { days: blocksToDays(nextEraIn) })} (${Intl.NumberFormat(i18n.language).format(nextEraIn)} blocks)`}
    >
      <span className="w-2 h-2 rounded-full bg-green-primary" />
      <span className="text-white font-semibold">{t('shell.era', { era: currentEra })}</span>
      <span className="hidden 2xl:inline text-gray-400">
        {t('shell.nextEraIn', { days: blocksToDays(nextEraIn) })}
      </span>
    </button>
  )
}
