import { DataRow } from '@renderer/components/DataRow/DataRow'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { userAbi, userAddress } from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function InvitationCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const { data } = useReadContract({
    address: userAddress,
    abi: userAbi,
    functionName: 'getInvitation',
    args: [address]
  })

  const invitationData = data as InvitationProps

  const withoutInviter = !invitationData || /^0x0+$/.test(invitationData.inviter)

  return (
    <section className="flex flex-col gap-3 p-5 rounded-2xl bg-card-primary">
      <p className="text-white font-bold">{t('account.invitation')}</p>
      {data === undefined ? null : withoutInviter ? (
        <p className="text-gray-400 text-sm">{t('account.userWithoutInvitation')}</p>
      ) : (
        <>
          <UserBadge address={invitationData.inviter} label={t('account.inviter')} />
          <DataRow
            label={t('account.invitedAt')}
            value={formatUnits(BigInt(invitationData.createdAtBlock), 0)}
          />
        </>
      )}
    </section>
  )
}
