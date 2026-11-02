import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useReadContract } from 'wagmi'

import { AreaMap, Point } from '@renderer/components/AreaMap/AreaMap'
import { regeneratorAbi, regeneratorAddress } from '@renderer/services/contracts'
import { validateLat, validateLng } from '@renderer/utils/validateCoords'

export function RegenerationAreaMap({ address }: { address: string }): JSX.Element {
  const { t } = useTranslation()
  const { data, isLoading } = useReadContract({
    address: regeneratorAddress,
    abi: regeneratorAbi,
    functionName: 'getCoordinates',
    args: [address]
  })

  const coords = useMemo(
    () => (data as { latitude: string; longitude: string }[] | undefined) ?? [],
    [data]
  )
  // Every point must be valid, not only the last one checked.
  const valid =
    coords.length > 0 && coords.every((c) => validateLat(c.latitude) && validateLng(c.longitude))
  const points = useMemo<Point[]>(
    () => coords.map((c) => [parseFloat(c.longitude), parseFloat(c.latitude)]),
    [coords]
  )
  const center = points[0]

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
      <p className="text-white font-bold">{t('account.regenerationArea')}</p>
      {isLoading ? (
        <div className="h-[350px] rounded-xl bg-card-secondary animate-pulse" />
      ) : !valid ? (
        <p className="text-amber-300 text-sm">{t('account.invalidCoords')}</p>
      ) : (
        <>
          <AreaMap points={points} />
          <div className="flex items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">
              {t('account.coordinatesCount', { count: points.length })}
            </p>
            {center && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${center[1]}&mlon=${center[0]}#map=17/${center[1]}/${center[0]}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-green-primary text-sm font-semibold hover:underline"
              >
                {t('account.openMap')}
                <FaExternalLinkAlt size={11} />
              </a>
            )}
          </div>
        </>
      )}
    </section>
  )
}
