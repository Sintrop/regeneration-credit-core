import { Jazzicon } from '@ukstv/jazzicon-react'
import { Img } from 'react-image'
import { useNavigate } from 'react-router-dom'

import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useFeedUser } from '@renderer/hooks/useFeedUser'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'

const shortAddress = (address: string): string => `${address.slice(0, 6)}…${address.slice(-4)}`

/** Avatar, name and user type of an address; opens the profile. */
export function UserBadge({ address, label }: { address: string; label?: string }): JSX.Element {
  const navigate = useNavigate()
  const { ipfsGatewayURL } = useSettingsContext()
  const user = useFeedUser(address)

  return (
    <button
      className="flex items-center gap-3 min-w-0 text-left hover:cursor-pointer group"
      onClick={(event) => {
        event.stopPropagation()
        navigate(`/user-details/${address}`)
      }}
    >
      <span className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden">
        <Jazzicon address={address} className="w-full h-full" />
        {user.photo && (
          <Img
            src={`${ipfsGatewayURL}/ipfs/${user.photo}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </span>
      <span className="min-w-0">
        {label && <span className="block text-gray-400 text-xs">{label}</span>}
        <span className="block text-white text-sm font-semibold truncate group-hover:underline">
          {user.name || shortAddress(address)}
        </span>
        {user.userType > 0 && (
          <UserTypeToText userType={user.userType} className="text-green-primary text-xs" />
        )}
      </span>
    </button>
  )
}
