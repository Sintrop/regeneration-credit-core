/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useTranslation } from 'react-i18next'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { calculateArea } from '@renderer/services/calculateArea'
import { InvitationProps } from '@renderer/types/invitation'
import { ConfirmButton } from './ConfirmButton'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { validateLat, validateLng } from '@renderer/utils/validateCoords'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useMainnet } from '@renderer/hooks/useMainnet'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
interface Props {
  name: string
  invitation: InvitationProps
  success: () => void
}

interface CoordinateProps {
  longitude: string
  latitude: string
}

export function RegeneratorRegistration({ name, invitation, success }: Props): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [proofPhoto, setProofPhoto] = useState('')
  const [description, setDescription] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const mapRef = useRef<mapboxgl.Map>()
  const mapContainerRef = useRef<HTMLDivElement>()
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [coordinates, setCoordinates] = useState<CoordinateProps[]>([])
  const [totalArea, setTotalArea] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const mainnet = useMainnet()
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

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
      setCoordinates((prevState) => [
        ...prevState,
        { latitude: e.lngLat.lat.toString(), longitude: e.lngLat.lng.toString() }
      ])
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
        .setLngLat([parseFloat(coordinate?.longitude), parseFloat(coordinate?.latitude)])
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })

    if (coordinates.length > 2) {
      const polygonCoords: [number, number][] = coordinates.map((coord) => [
        parseFloat(coord.longitude),
        parseFloat(coord.latitude)
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

    handleCalculateArea()
  }, [coordinates])

  useEffect(() => {
    validityData()
  }, [name, proofPhoto, invitation, coordinates, totalArea, description])

  function validityData(): void {
    if (!name.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!description.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (!proofPhoto.trim()) {
      setDisableBtnRegister(true)
      return
    }

    if (coordinates.length < 3 || coordinates.length > 10) {
      setDisableBtnRegister(true)
      return
    }

    if (totalArea < 500) {
      setDisableBtnRegister(true)
      return
    }

    if (invitation?.userType !== 1) {
      setDisableBtnRegister(true)
      return
    }

    setDisableBtnRegister(false)
  }

  async function uploadProofPhoto(): Promise<string> {
    setUploadingImage(true)
    const blobImage = base64ToBlob(proofPhoto)
    const response = await uploadToIpfs({ file: blobImage, ipfsApiUrl })
    setUploadingImage(false)
    return response.hash
  }

  async function handleRegister(): Promise<void> {
    if (isLoading || isPending || uploadingImage) return

    const hashProofPhoto = await uploadProofPhoto()

    if (hashProofPhoto === '') {
      alert('error on upload proof photo')
      return
    }

    setDisplayLoadingTx(true)
    writeContract({
      address: mainnet ? regeneratorAddress : sequoiaRegeneratorAddress,
      abi: mainnet ? regeneratorAbi : sequoiaRegeneratorAbi,
      functionName: 'addRegenerator',
      args: [totalArea, name, hashProofPhoto, description, coordinates]
    })
  }

  function handleClearSelection(): void {
    setCoordinates([])
  }

  function handleDeleteLastPoint(): void {
    setCoordinates((prevState) => prevState.slice(0, -1))
  }

  function handleCalculateArea(): void {
    const response = calculateArea(coordinates)
    setTotalArea(response)
  }

  return (
    <div className="flex flex-col z-0 mt-5">
      <p className="text-gray-300 text-sm">{t('register.projectDescription')}</p>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-10 rounded-2xl bg-container-secondary px-5 text-white"
        placeholder={t('register.typeHere')}
      />

      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

      <div className="flex flex-col w-full mt-3">
        <p className="text-gray-300 text-sm">{t('register.demarcateYourRegenerationArea')}</p>

        <div
          //@ts-ignore
          ref={mapContainerRef}
          className="w-full h-[300px] rounded-2xl border-2 border-white mt-1"
        />

        <p className="text-white mt-1">
          {t('register.areaSize')}: {Intl.NumberFormat('pt-BR').format(totalArea)}m²
        </p>

        {coordinates.length > 0 && (
          <>
            <div className="flex flex-col gap-1 my-3">
              <p className="text-xs text-gray-300">{t('common.coordinates')}</p>
              {coordinates.map((item, index) => (
                <p className="text-white" key={index}>
                  {index + 1} = Lat: {item.latitude}, Lng: {item.longitude}
                </p>
              ))}
            </div>

            <div className="flex items-center justify-center gap-5">
              <button
                onClick={handleClearSelection}
                className="text-white underline font-semibold hover:cursor-pointer"
              >
                {t('register.clearSelection')}
              </button>
              <button
                onClick={handleDeleteLastPoint}
                className="text-white underline font-semibold hover:cursor-pointer"
              >
                {t('register.removeLastPoint')}
              </button>
            </div>
          </>
        )}

        <InputCoordsManually addCoords={(data) => setCoordinates((value) => [...value, data])} />
      </div>

      <ConfirmButton
        btnDisabled={disableBtnRegister}
        handleRegister={handleRegister}
        uploadingImage={uploadingImage}
      />

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={success}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          errorMessage={errorMessage}
          transactionHash={hash}
        />
      )}
    </div>
  )
}

interface InputCoordsManuallyProps {
  addCoords: (data: CoordinateProps) => void
}
function InputCoordsManually({ addCoords }: InputCoordsManuallyProps): JSX.Element {
  const { t } = useTranslation()
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  function handleAddCoords(): void {
    const validLat = validateLat(latitude)
    const validLng = validateLng(longitude)

    if (!validLat || !validLng) {
      alert(t('invalidCoors'))
      return
    }

    addCoords({ latitude: latitude, longitude: longitude })
    setLatitude('')
    setLongitude('')
  }

  return (
    <div className="mt-3 flex flex-col gap-1">
      <p className="text-gray-300 text-sm">{t('register.addManually')}</p>

      <div className="flex gap-3 items-end">
        <div className="flex flex-col">
          <p className="text-gray-300 text-sm">Latitude:</p>
          <input
            className="w-[180px] h-10 px-3 rounded-2xl text-white bg-container-secondary"
            placeholder={t('register.typeHere')}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-gray-300 text-sm">Longitude:</p>
          <input
            className="w-[180px] h-10 px-3 rounded-2xl text-white bg-container-secondary"
            placeholder={t('register.typeHere')}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        <button
          className="w-full h-10 text-white bg-green-1 rounded-2xl hover:cursor-pointer disabled:opacity-40 disabled:cursor-default"
          disabled={!latitude.trim() || !longitude.trim()}
          onClick={handleAddCoords}
        >
          Add
        </button>
      </div>
    </div>
  )
}
