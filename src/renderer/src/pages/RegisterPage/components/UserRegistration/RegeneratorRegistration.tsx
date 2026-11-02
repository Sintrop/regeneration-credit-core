import { toast } from 'react-toastify'
import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { clampToBytes } from '@renderer/utils/byteLength'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'

/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProofPhoto } from './ProofPhoto'
import { useTranslation } from 'react-i18next'
import { useWaitForTransactionReceipt } from 'wagmi'
import { regeneratorAbi, regeneratorAddress } from '@renderer/services/contracts'
import { AreaMap, Point } from '@renderer/components/AreaMap/AreaMap'
import { calculateArea } from '@renderer/services/calculateArea'
import { ConfirmButton } from './ConfirmButton'
import { base64ToBlob, uploadToIpfs } from '@renderer/services/ipfs'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { validateLat, validateLng } from '@renderer/utils/validateCoords'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  name: string
  /** Every contract requirement to register (invitation, vacancies, inviter standing). */
  requirementsMet: boolean
  success: () => void
}

interface CoordinateProps {
  longitude: string
  latitude: string
}

export function RegeneratorRegistration({ name, requirementsMet, success }: Props): JSX.Element {
  const { ipfsApiUrl } = useSettingsContext()
  const { t } = useTranslation()
  const [proofPhoto, setProofPhoto] = useState('')
  const [description, setDescription] = useState('')
  const [disableBtnRegister, setDisableBtnRegister] = useState(false)
  const [coordinates, setCoordinates] = useState<CoordinateProps[]>([])
  const [totalArea, setTotalArea] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)

  const { writeContract, data: hash, isPending, isError, error } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  useEffect(() => {
    handleCalculateArea()
  }, [coordinates])

  useEffect(() => {
    validityData()
  }, [name, proofPhoto, requirementsMet, coordinates, totalArea, description])

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

    if (!requirementsMet) {
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
      toast.error(t('registerPage.photoUploadError'))
      return
    }

    setDisplayLoadingTx(true)

    writeContract({
      address: regeneratorAddress,
      abi: regeneratorAbi,
      functionName: 'addRegenerator',
      args: [totalArea, name, hashProofPhoto, description, coordinates]
    })
  }

  function handleClearSelection(): void {
    setCoordinates([])
  }

  const points = useMemo<Point[]>(
    () => coordinates.map((c) => [parseFloat(c.longitude), parseFloat(c.latitude)]),
    [coordinates]
  )

  const addPoint = useCallback((latitude: number, longitude: number): void => {
    setCoordinates((prevState) =>
      prevState.length >= 10
        ? prevState
        : [...prevState, { latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) }]
    )
  }, [])

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
        onChange={(e) => setDescription(clampToBytes(e.target.value, 200))}
        className="w-full h-11 rounded-xl bg-card-secondary px-3 text-white outline-none focus:ring-1 focus:ring-green-primary"
        placeholder={t('register.typeHere')}
      />
      <ByteCounter text={description} max={200} />

      <ProofPhoto proofPhoto={proofPhoto} onChange={setProofPhoto} />

      <div className="flex flex-col w-full mt-3">
        <p className="text-gray-300 text-sm">{t('register.demarcateYourRegenerationArea')}</p>

        <p className="text-gray-400 text-xs mt-1">{t('registerPage.mapHint')}</p>
        <AreaMap
          points={points}
          onMapClick={addPoint}
          className="h-[340px] mt-2 cursor-crosshair"
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
                className="text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer"
              >
                {t('register.clearSelection')}
              </button>
              <button
                onClick={handleDeleteLastPoint}
                className="text-green-primary text-sm font-semibold hover:underline hover:cursor-pointer"
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
      toast.error(t('invalidCoors'))
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
            className="w-[180px] h-11 px-3 rounded-xl text-white bg-card-secondary outline-none focus:ring-1 focus:ring-green-primary"
            placeholder={t('register.typeHere')}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-gray-300 text-sm">Longitude:</p>
          <input
            className="w-[180px] h-11 px-3 rounded-xl text-white bg-card-secondary outline-none focus:ring-1 focus:ring-green-primary"
            placeholder={t('register.typeHere')}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>

        <button
          className="w-full h-11 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer disabled:opacity-40 disabled:cursor-default"
          disabled={!latitude.trim() || !longitude.trim()}
          onClick={handleAddCoords}
        >
          Add
        </button>
      </div>
    </div>
  )
}
