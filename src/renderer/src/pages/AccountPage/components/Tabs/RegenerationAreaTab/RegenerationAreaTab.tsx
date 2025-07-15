import { Loading } from '@renderer/components/Loading/Loading'
import {
  regeneratorAbi,
  regeneratorAddress,
  sequoiaRegeneratorAbi,
  sequoiaRegeneratorAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'

export interface PushCoordProps {
  lat: number
  lng: number
}

interface Props {
  address: string
}

export function RegenerationAreaTab({ address }: Props): JSX.Element {
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? regeneratorAddress : sequoiaRegeneratorAddress,
    abi: chainId === 250225 ? regeneratorAbi : sequoiaRegeneratorAbi,
    functionName: 'getCoordinates',
    args: [address]
  })

  if (isLoading) {
    return (
      <div className="mt-5 mx-auto overflow-hidden">
        <Loading />
      </div>
    )
  }

  const coords = data ? (data as { latitude: string; longitude: string }[]) : []

  return (
    <div className="flex flex-col gap-3 mt-5">
      {coords.map((item, index) => (
        <CoordinateItem key={index} coord={item} index={index} />
      ))}
    </div>
  )
}

interface CoordinateItemProps {
  coord: { latitude: string; longitude: string }
  index: number
}
function CoordinateItem({ coord, index }: CoordinateItemProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1 rounded-2xl p-3 bg-green-card">
      <p className="text-gray-300 text-sm">
        {t('coordinate')} {index + 1}
      </p>
      <p className="text-white">Lat: {coord.latitude}</p>
      <p className="text-white">Lng: {coord.longitude}</p>
    </div>
  )
}
