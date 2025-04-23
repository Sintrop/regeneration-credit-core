import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'

export interface PushCoordProps {
  lat: number
  lng: number
}

interface Props {
  address: string
  coordinatesCount?: number
  pushCoord?: (data: PushCoordProps[]) => void
}

export function RegenerationAreaTab({ coordinatesCount, address, pushCoord }: Props): JSX.Element {
  const [arrayCoords, setArrayCoords] = useState<PushCoordProps[]>([])

  useEffect(() => {
    if (pushCoord) pushCoord(arrayCoords)
  }, [arrayCoords])

  if (!coordinatesCount || coordinatesCount === 0) {
    return <div />
  }

  const count = Array.from({ length: coordinatesCount }, (_, i) => i)

  function handlePushCoord(data: PushCoordProps): void {
    const exists = arrayCoords.find((item) => item.lat === data.lat && item.lng === data.lng)
    if (exists) return
    if (arrayCoords.length >= Number(coordinatesCount)) return
    setArrayCoords([...arrayCoords, data])
  }

  return (
    <div className="flex flex-col gap-3 mt-5">
      {count.map((count) => (
        <CoordinateItem key={count} count={count} address={address} pushCoord={handlePushCoord} />
      ))}
    </div>
  )
}

interface CoordinateItemProps {
  count: number
  address: string
  pushCoord: ({ lat, lng }: PushCoordProps) => void
}
function CoordinateItem({ count, address, pushCoord }: CoordinateItemProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'coordinates',
    args: [address, count]
  })

  const coord = data as string[]

  if (coord) {
    pushCoord({ lat: parseFloat(coord[0]), lng: parseFloat(coord[1]) })
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl p-3 bg-green-card">
      <p className="text-gray-300 text-sm">
        {t('coordinate')} {count + 1}
      </p>
      <p className="text-white">Lat: {coord && coord[0]}</p>
      <p className="text-white">Lng: {coord && coord[1]}</p>
    </div>
  )
}
