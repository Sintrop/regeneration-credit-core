import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { Img } from 'react-image'

interface Props {
  address: string
  name: string
  proofPhoto: string
  userType: number
}

export function BasicDataApprovedUser({ address, name, proofPhoto, userType }: Props): JSX.Element {
  const { ipfsGatewayURL } = useSettingsContext()

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-14 h-14 rounded-full">
        <Jazzicon className="w-14 h-14 z-0" address={address as string} />
        {proofPhoto && (
          <Img
            src={`${ipfsGatewayURL}/ipfs/${proofPhoto}`}
            className="w-full h-full rounded-full object-cover absolute top-0 left-0 z-10"
          />
        )}
      </div>

      <div className="flex flex-col">
        <p className="font-semibold text-white">{name}</p>
        <UserAddressLink address={address} />
        <UserTypeToText className="text-sm text-gray-300" userType={userType} />
      </div>
    </div>
  )
}
