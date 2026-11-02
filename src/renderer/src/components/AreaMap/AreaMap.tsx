import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { isMapboxToken } from '@renderer/utils/mapbox'

/** [longitude, latitude], as stored on chain. */
export type Point = [number, number]

const GREEN = '#75d63a'

/** Errors before giving up on Mapbox tiles (an expired token or exhausted quota fails every tile). */
const MAPBOX_FAILURES_TO_FALLBACK = 3

function mapboxLayer(token: string): L.TileLayer {
  return L.tileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${token}`,
    { maxZoom: 20, attribution: '© Mapbox © OpenStreetMap' }
  )
}

function openStreetMapLayer(): L.TileLayer {
  return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  })
}

/**
 * Mapbox satellite tiles with the configured token (the app default or the user's own); when they
 * fail, or there is no token, the map switches to OpenStreetMap, which needs no key.
 */
function addBaseLayer(map: L.Map, mapboxToken: string): void {
  if (!isMapboxToken(mapboxToken)) {
    openStreetMapLayer().addTo(map)
    return
  }
  const mapbox = mapboxLayer(mapboxToken).addTo(map)
  let failures = 0
  mapbox.on('tileerror', () => {
    failures += 1
    if (failures !== MAPBOX_FAILURES_TO_FALLBACK) return
    map.removeLayer(mapbox)
    openStreetMapLayer().addTo(map)
  })
}

interface Props {
  points: Point[]
  /** Makes the map clickable, e.g. to draw an area. */
  onMapClick?: (latitude: number, longitude: number) => void
  className?: string
}

export function AreaMap({ points, onMapClick, className = 'h-[350px]' }: Props): JSX.Element {
  const { mapboxToken } = useSettingsContext()
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map>()
  const shapes = useRef<L.LayerGroup>()
  const clickHandler = useRef(onMapClick)
  clickHandler.current = onMapClick
  const editable = !!onMapClick

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, {
      zoomControl: true,
      attributionControl: true
    }).setView([-15, -50], 3)
    addBaseLayer(instance, mapboxToken)
    shapes.current = L.layerGroup().addTo(instance)
    instance.on('click', (event: L.LeafletMouseEvent) =>
      clickHandler.current?.(event.latlng.lat, event.latlng.lng)
    )
    map.current = instance
    return (): void => {
      instance.remove()
      map.current = undefined
    }
  }, [mapboxToken])

  useEffect(() => {
    const instance = map.current
    const group = shapes.current
    if (!instance || !group) return
    group.clearLayers()
    const latLngs = points.map(([lng, lat]) => L.latLng(lat, lng))
    if (latLngs.length > 2) {
      L.polygon(latLngs, { color: GREEN, weight: 2, fillColor: GREEN, fillOpacity: 0.25 }).addTo(
        group
      )
    }
    latLngs.forEach((latLng) =>
      L.circleMarker(latLng, {
        radius: 6,
        color: '#0b2219',
        weight: 2,
        fillColor: GREEN,
        fillOpacity: 1
      }).addTo(group)
    )
    if (latLngs.length > 0 && !editable) {
      instance.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30], maxZoom: 17 })
    } else if (latLngs.length === 1 && editable) {
      instance.setView(latLngs[0], Math.max(instance.getZoom(), 15))
    }
  }, [points, mapboxToken, editable])

  return <div ref={container} className={`w-full rounded-xl overflow-hidden z-0 ${className}`} />
}
