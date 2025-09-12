import { Jazzicon } from '@ukstv/jazzicon-react'
import { useNavigate } from 'react-router-dom'
import { Img } from 'react-image'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useTranslation } from 'react-i18next'

interface Props {
  address?: string
  isLoading?: boolean
  proofPhoto?: string
  name?: string
}

export function ReportedContent({ address, name, proofPhoto }: Props): JSX.Element {
  const { t } = useTranslation()
  const { ipfsGatewayURL } = useSettingsContext()
  const navigate = useNavigate()

  function handleGoToUserDetails(): void {
    navigate(`/user-details/${address}`)
  }

  return (
    <div className="flex flex-col">
      <p className="text-xs text-gray-300">{t('feed.reported')}</p>
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
        </div>
      </div>
    </div>
  )
}
