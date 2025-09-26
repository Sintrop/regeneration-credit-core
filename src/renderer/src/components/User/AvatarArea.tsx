import { useNavigate } from 'react-router-dom'
import { Img } from 'react-image'
import { t } from 'i18next'
import { formatUnits } from 'viem'
import { Jazzicon } from '@ukstv/jazzicon-react'

import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

interface Props {
  address?: string
  isLoading?: boolean
  createdAt?: string
  proofPhoto?: string
  name?: string
}

export function AvatarArea({ address, createdAt, name, proofPhoto }: Props): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()
  const navigate = useNavigate()

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <div className="flex items-center gap-3 pb-3 overflow-hidden">
      <div className="relative w-8 h-8 rounded-full">
        <Jazzicon className="w-full h-full z-0" address={address ? (address as string) : ''} />

        {proofPhoto && (
          <Img
            src={`${ipfsGatewayURL}/ipfs/${proofPhoto}`}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p
          className="text-white hover:cursor-pointer hover:underline text-xs"
          onClick={handleGoToUserDetails}
        >
          {name ? name : address}
        </p>

        {createdAt && (
          <p className="text-gray-300 text-xs">
            {t('common.createdAt')}: {formatUnits(BigInt(createdAt), 0)}
          </p>
        )}
      </div>
    </div>
  )
}
