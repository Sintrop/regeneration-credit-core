import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useInvitedUsers } from '@renderer/hooks/useProfileEvents'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { InvitedUser } from '@renderer/services/profile/profileEvents'

function InvitedRow({ item }: { item: InvitedUser }): JSX.Element {
  const { t, i18n } = useTranslation()
  const { data, isLoading } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getUser',
    args: [item.invited]
  })
  const registered = Number(data ?? 0) > 0

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-white/5 last:border-0">
      <UserBadge
        address={item.invited}
        label={t('myTokens.block', {
          block: Intl.NumberFormat(i18n.language).format(item.blockNumber)
        })}
      />
      <div className="flex flex-col items-end shrink-0 text-xs">
        <span className="text-gray-400">
          {t('invitedUsers.as')}{' '}
          <UserTypeToText userType={item.invitedType} className="inline text-white font-semibold" />
        </span>
        {!isLoading && (
          <span className={`font-semibold ${registered ? 'text-green-primary' : 'text-amber-300'}`}>
            {registered ? `✓ ${t('invitedUsers.registered')}` : t('invitedUsers.pending')}
          </span>
        )}
      </div>
    </div>
  )
}

/** Users invited by this address (InvitationRules.UserInvited) and whether they registered. */
export function InvitedUsersCard({ address }: { address: string }): JSX.Element {
  const { t } = useTranslation()
  const { invited, isLoading } = useInvitedUsers(address)

  return (
    <section className="flex flex-col gap-1 p-5 rounded-2xl bg-card-primary">
      <div className="flex items-center justify-between mb-1">
        <p className="text-white font-bold">{t('invitedUsers.title')}</p>
        {!isLoading && <span className="text-gray-400 text-sm">{invited.length}</span>}
      </div>
      {isLoading ? (
        <div className="h-16 rounded-xl bg-card-secondary animate-pulse" />
      ) : invited.length === 0 ? (
        <p className="text-gray-400 text-sm">{t('invitedUsers.empty')}</p>
      ) : (
        <div className="flex flex-col max-h-[520px] overflow-y-auto">
          {invited.map((item) => (
            <InvitedRow key={`${item.invited}-${item.blockNumber}`} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}
