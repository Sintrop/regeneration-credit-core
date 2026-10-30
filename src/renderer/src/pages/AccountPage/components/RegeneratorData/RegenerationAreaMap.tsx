import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useReadContract } from 'wagmi'

import { regeneratorAbi, regeneratorAddress } from '@renderer/services/contracts'
import { validateLat, validateLng } from '@renderer/utils/validateCoords'

const TOKEN: string = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? ''
/** The example .env ships a row of x as placeholder. */
const HAS_TOKEN = !!TOKEN && !/^x+$/i.test(TOKEN)

type Point = [number, number]

/** Outline of the area without map tiles, used when no Mapbox token is configured. */
function AreaOutline({ points }: { points: Point[] }): JSX.Element {
  // A degree of longitude shrinks with latitude; scale it so the shape keeps its proportions.
  const shrink = Math.cos((points[0][1] * Math.PI) / 180)
  const lngs = points.map(([lng]) => lng * shrink)
  const lats = points.map(([, lat]) => lat)
  const [minLng, maxLng, minLat, maxLat] = [
    Math.min(...lngs),
    Math.max(...lngs),
    Math.min(...lats),
    Math.max(...lats)
  ]
  const span = Math.max(maxLng - minLng, maxLat - minLat) || 1
  const toXY = ([lng, lat]: Point): string =>
    `${10 + ((lng * shrink - minLng) / span) * 280},${10 + ((maxLat - lat) / span) * 180}`
  return (
    <svg viewBox="0 0 300 200" className="w-full h-[220px] rounded-xl bg-card-secondary">
      <polygon
        points={points.map(toXY).join(' ')}
        fill="rgba(117,214,58,0.25)"
        stroke="#75d63a"
        strokeWidth={2}
      />
      {points.map((point, index) => {
        const [x, y] = toXY(point).split(',')
        return <circle key={index} cx={x} cy={y} r={3.5} fill="#75d63a" />
      })}
    </svg>
  )
}

export function RegenerationAreaMap({ address }: { address: string }): JSX.Element {
  const { t } = useTranslation()
  const container = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!valid || !HAS_TOKEN || !container.current) return
    mapboxgl.accessToken = TOKEN
    const map = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: points[0],
      zoom: 15
    })
    map.on('load', () => {
      points.forEach((point) =>
        new mapboxgl.Marker({ color: '#75d63a' }).setLngLat(point).addTo(map)
      )
      if (points.length > 2) {
        map.addSource('area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [[...points, points[0]]] }
          }
        })
        map.addLayer({
          id: 'area-fill',
          type: 'fill',
          source: 'area',
          paint: { 'fill-color': '#75d63a', 'fill-opacity': 0.25 }
        })
        map.addLayer({
          id: 'area-line',
          type: 'line',
          source: 'area',
          paint: { 'line-color': '#75d63a', 'line-width': 2 }
        })
        const bounds = points.reduce(
          (box, point) => box.extend(point),
          new mapboxgl.LngLatBounds(points[0], points[0])
        )
        map.fitBounds(bounds, { padding: 40, maxZoom: 17, duration: 0 })
      }
    })
    return (): void => map.remove()
  }, [valid, points])

  return (
    <section className="p-5 rounded-2xl bg-card-primary flex flex-col gap-3">
      <p className="text-white font-bold">{t('account.regenerationArea')}</p>
      {isLoading ? (
        <div className="h-[220px] rounded-xl bg-card-secondary animate-pulse" />
      ) : !valid ? (
        <p className="text-amber-300 text-sm">{t('account.invalidCoords')}</p>
      ) : (
        <>
          {HAS_TOKEN ? (
            <div ref={container} className="w-full h-[350px] rounded-xl overflow-hidden" />
          ) : (
            <>
              {points.length > 2 && <AreaOutline points={points} />}
              <p className="text-gray-400 text-xs">{t('account.mapUnavailable')}</p>
            </>
          )}
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
