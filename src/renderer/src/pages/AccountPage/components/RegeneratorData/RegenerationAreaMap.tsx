/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { validateLat, validateLng } from '@renderer/utils/validateCoords'
import { Loading } from '@renderer/components/Loading/Loading'

interface Props {
  address: string
}

export function RegenerationAreaMap({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef<HTMLDivElement>()
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [invalidCoords, setInvalidCoords] = useState(true)

  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getCoordinates',
    args: [address]
  })

  const coords = data ? (data as { latitude: string; longitude: string }[]) : []

  useEffect(() => {
    if (coords.length > 0) {
      for (let i = 0; i < coords.length; i++) {
        const latValid = validateLat(coords[i].latitude)
        const lngValid = validateLng(coords[i].longitude)

        if (!latValid || !lngValid) {
          setInvalidCoords(true)
        } else {
          setInvalidCoords(false)
        }
      }
    }
  }, [coords])

  const centerMap = {
    lat: coords.length > 0 ? parseFloat(coords[0].latitude) : -23.29,
    lng: coords.length > 0 ? parseFloat(coords[0].longitude) : -48.08
  }

  useEffect(() => {
    if (invalidCoords) return
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN : ''
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef?.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [centerMap.lng, centerMap.lat],
      zoom: 15
    })

    mapRef.current.on('load', () => {
      mapRef.current!.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[]]
          }
        }
      })

      mapRef.current!.addLayer({
        id: 'polygon-layer-1',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.3
        }
      })

      mapRef.current!.addLayer({
        id: 'polygon-border-1',
        type: 'line',
        source: 'polygon',
        layout: {},
        paint: {
          'line-color': '#088',
          'line-width': 2
        }
      })
    })

    return (): void => {
      mapRef.current?.remove()
    }
  }, [centerMap, invalidCoords])

  useEffect(() => {
    if (invalidCoords) return
    if (!mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    coords.forEach((coordinate) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([parseFloat(coordinate?.longitude), parseFloat(coordinate?.latitude)])
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })

    if (coords.length > 2) {
      const polygonCoords: [number, number][] = coords.map((coord) => [
        parseFloat(coord?.longitude),
        parseFloat(coord?.latitude)
      ])
      if (polygonCoords.length > 0) {
        polygonCoords.push([...polygonCoords[0]])
      }

      ;(mapRef.current!.getSource('polygon') as mapboxgl.GeoJSONSource)?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoords]
        }
      })
    } else {
      ;(mapRef.current!.getSource('polygon') as mapboxgl.GeoJSONSource)?.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[]]
        }
      })
    }
  }, [coords, invalidCoords])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
        <p className="text-gray-300 text-sm">{t('regenerationArea')}</p>

        <div className="flex justify-center my-5">
          <Loading />
        </div>
      </div>
    )
  }

  if (invalidCoords) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
        <p className="text-gray-300 text-sm">{t('regenerationArea')}</p>

        <p className="text-yellow-500 text-center my-5">{t('invalidCoords')}!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
      <p className="text-gray-300 text-sm">{t('regenerationArea')}</p>
      <div
        //@ts-ignore
        ref={mapContainerRef}
        className="w-full h-[350px] rounded-2xl border-2 border-white mt-1"
      />

      <div className="flex flex-col gap-1 mt-3">
        <p className="text-gray-300 text-sm">{t('coordinates')}</p>
        {coords.length > 0 && (
          <>
            {coords.map((item, index) => (
              <p key={index} className="text-white text-sm">
                Lat: {item.latitude}, Lng: {item.longitude}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
