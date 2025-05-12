import { Jazzicon } from '@ukstv/jazzicon-react'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { formatUnits } from 'viem'
import { Img } from 'react-image'

interface Props {
  address?: string
  isLoading?: boolean
  publishedAt?: string
  proofPhoto?: string
  name?: string
}

export function HeaderFeedItem({ address, publishedAt, name, proofPhoto }: Props): JSX.Element {
  const navigate = useNavigate()

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <div className="flex items-center gap-3 border-b border-container-secondary pb-3 overflow-hidden">
      <div className="relative w-10 h-10 rounded-full">
        <Jazzicon className="w-10 h-10 z-0" address={address ? (address as string) : ''} />

        {proofPhoto && (
          <Img
            src={`https://ipfs.io/ipfs/${proofPhoto}`}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p
          className="text-white hover:cursor-pointer hover:underline"
          onClick={handleGoToUserDetails}
        >
          {name ? name : address}
        </p>

        {publishedAt && (
          <p className="text-gray-300 text-xs">
            {t('publishedAt')}: {formatUnits(BigInt(publishedAt), 0)}
          </p>
        )}
      </div>
    </div>
  )
}
