import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { MdLogout } from 'react-icons/md'
import { Img } from 'react-image'
import { useNavigate } from 'react-router-dom'
import { useDisconnect } from 'wagmi'

import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useIsDenied } from '@renderer/domain/Community/useCases/useIsDenied'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useUserContext } from '@renderer/hooks/useUserContext'

const shortAddress = (address: string): string => `${address.slice(0, 6)}…${address.slice(-4)}`

/** Connected account at the foot of the menu: who you are, your level and the way out. */
export function AccountCard(): JSX.Element | null {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { disconnect } = useDisconnect()
  const { ipfsGatewayURL } = useSettingsContext()
  const { address, userType, isUserTypeKnown, profile } = useUserContext()
  const { isDenied } = useIsDenied({ address: address ?? '' })

  if (!address || !isUserTypeKnown) return null

  if (userType === 0) {
    return (
      <div className="p-3 rounded-2xl bg-green-primary/10 border border-green-primary/40 flex flex-col gap-2">
        <p className="text-white text-sm font-semibold">{t('actionBar.youAreNotRegistered')}</p>
        <p className="text-gray-300 text-xs">{t('shell.registerHint')}</p>
        <button
          className="h-9 rounded-xl bg-green-primary text-green-secondary text-sm font-bold hover:cursor-pointer"
          onClick={() => navigate('/register')}
        >
          {t('actionBar.register')}
        </button>
      </div>
    )
  }

  const denied = isDenied || userType === 8

  return (
    <div className="flex items-center gap-2 p-2 rounded-2xl bg-card-primary">
      <button
        className="flex-1 min-w-0 flex items-center gap-3 text-left hover:cursor-pointer group"
        onClick={() => navigate('/account')}
        title={t('shell.myProfile')}
      >
        <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden">
          <Jazzicon address={address} className="w-full h-full" />
          {profile?.photoHash && (
            <Img
              src={`${ipfsGatewayURL}/ipfs/${profile.photoHash}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate group-hover:underline">
            {profile?.name || shortAddress(address)}
          </p>
          {denied ? (
            <p className="text-red-400 text-xs font-semibold">{t('common.deniedUser')}</p>
          ) : (
            <div className="flex items-center gap-1 text-xs">
              <UserTypeToText userType={userType} className="text-green-primary truncate" />
              {profile?.level !== undefined && (
                <span className="text-gray-400 shrink-0">
                  · {t(userType === 1 ? 'shell.score' : 'shell.level', { value: profile.level })}
                </span>
              )}
            </div>
          )}
        </div>
      </button>
      <button
        className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-card-secondary hover:cursor-pointer"
        onClick={() => disconnect()}
        title={t('shell.disconnect')}
      >
        <MdLogout size={18} />
      </button>
    </div>
  )
}
