import { useTranslation } from 'react-i18next'

import { useEra } from '@renderer/hooks/useEra'
import { blocksToDays } from '@renderer/utils/blocksToDuration'

/** Current era and time to the next one, read from RegeneratorPool. Hidden until the chain answers. */
export function EraChip(): JSX.Element | null {
  const { t, i18n } = useTranslation()
  const { currentEra, nextEraIn } = useEra()

  if (currentEra < 1) return null

  return (
    <div
      className="flex items-center gap-2 h-9 px-3 rounded-xl bg-card-primary text-sm"
      title={`${Intl.NumberFormat(i18n.language).format(nextEraIn)} blocks`}
    >
      <span className="w-2 h-2 rounded-full bg-green-primary" />
      <span className="text-white font-semibold">{t('shell.era', { era: currentEra })}</span>
      <span className="text-gray-400">
        {t('shell.nextEraIn', { days: blocksToDays(nextEraIn) })}
      </span>
    </div>
  )
}
