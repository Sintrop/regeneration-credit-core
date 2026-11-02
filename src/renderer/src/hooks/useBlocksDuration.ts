import { useTranslation } from 'react-i18next'

import { blocksToDuration } from '@renderer/utils/blocksToDuration'

/** Formats a block count as "~167 dias (1.112.321 blocos)" in the current language. */
export function useBlocksDuration(): (blocks: number) => string {
  const { t, i18n } = useTranslation()

  return (blocks: number): string => {
    const { value, unit } = blocksToDuration(blocks)
    return t('duration.withBlocks', {
      duration: t(`duration.${unit}`, { count: value }),
      blocks: Intl.NumberFormat(i18n.language).format(Math.abs(Math.round(blocks)))
    })
  }
}
