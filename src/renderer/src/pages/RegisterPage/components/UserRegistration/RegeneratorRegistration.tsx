/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useTranslation } from 'react-i18next'
import { useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sequoiaRegeneratorAbi, sequoiaRegeneratorAddress } from '@renderer/services/contracts'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
interface Props {
  name: string
}

export function RegeneratorRegistration({ name }: Props): JSX.Element {
  const { t } = useTranslation()
  const [proofPhoto, setProofPhoto] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef<HTMLDivElement>()
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }[]>([])

  const chainId = useChainId()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ? MAPBOX_ACCESS_TOKEN : ''
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef?.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-48.08, -23.29],
      zoom: 1
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
        id: 'polygon-layer',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.3
        }
      })

      mapRef.current!.addLayer({
        id: 'polygon-border',
        type: 'line',
        source: 'polygon',
        layout: {},
        paint: {
          'line-color': '#088',
          'line-width': 2
        }
      })
    })

    mapRef.current.on('click', (e) => {
      setCoordinates((prevState) => [...prevState, e.lngLat])
    })

    return (): void => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    coordinates.forEach((coordinate) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([coordinate?.lng, coordinate?.lat])
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })

    if (coordinates.length > 2) {
      const polygonCoords: [number, number][] = coordinates.map((coord) => [coord.lng, coord.lat])
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
  }, [coordinates])

  useEffect(() => {
    validityData()
  }, [name, proofPhoto])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  function handleRegister(): void {
    if (isLoading || isPending) return

    writeContract({
      address: chainId === 1600 ? sequoiaRegeneratorAddress : sequoiaRegeneratorAddress,
      abi: chainId === 1600 ? sequoiaRegeneratorAbi : sequoiaRegeneratorAbi,
      functionName: 'addRegenerator',
      args: [name, 'hashProofphoto']
    })
  }

  function handleClearSelection(): void {
    setCoordinates([])
  }

  function handleDeleteLastPoint(): void {
    setCoordinates((prevState) => prevState.slice(0, -1))
  }

  return (
    <div className="flex flex-col mb-10 z-0">
      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

      <button
        className={`bg-green-btn rounded-2xl px-10 h-10 text-white font-semibold mt-10 w-fit hover:cursor-pointer ${disableBtnRegister ? 'opacity-50' : 'opacity-100'}`}
        onClick={handleRegister}
        disabled={disableBtnRegister || isPending || isLoading}
      >
        {isPending ? t('confirmYourWallet') : t('register')}
      </button>

      <div ref={mapContainerRef} className="w-[300px] h-[300px]" />
      <button onClick={handleClearSelection}>{t('clearSelection')}</button>
      <button onClick={handleDeleteLastPoint}>{t('removeLastPoint')}</button>

      {hash && (
        <div className="flex flex-col">
          <p className="text-white">Transaction hash: {hash}</p>
          {isLoading && (
            <>
              <p className="text-white">Waiting for confirmation...</p>
              <div className="w-10 h-10 bg-green-btn animate-spin" />
            </>
          )}
          {isSuccess && <p className="text-green-600">{t('transactionSuccess')}</p>}
        </div>
      )}

      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  )
}
