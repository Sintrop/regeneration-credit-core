import { UserAddressLink } from '@renderer/components/UserAddressLink/UserAddressLink'
import {
  userAbi,
  userAddress,
  sequoiaUserAbi,
  sequoiaUserAddress
} from '@renderer/services/contracts'
import { InvitationProps } from '@renderer/types/invitation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  address: string
}

export function InvitationCard({ address }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? userAddress : sequoiaUserAddress,
    abi: chainId === 250225 ? userAbi : sequoiaUserAbi,
    functionName: 'getInvitation',
    args: [address]
  })

  const invitationData = data as InvitationProps

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1">
      <p className="text-gray-300 text-sm">{t('account.invitation')}</p>
      {invitationData && (
        <>
          {invitationData?.inviter.includes('0x00000000000000000000000000') ? (
            <div className="flex items-center justify-center py-3">
              <p className="text-white text-center">{t('account.userWithoutInvitation')}</p>
            </div>
          ) : (
            <>
              <CardData label={t('account.inviter')}>
                <UserAddressLink address={invitationData?.inviter} />
              </CardData>
              <CardData
                label={t('account.invitedAt')}
                value={formatUnits(BigInt(invitationData?.createdAtBlock), 0)}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

interface CardDataProps {
  label: string
  value?: string | number
  children?: React.ReactNode
}
function CardData({ label, value, children }: CardDataProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-1">
      <p className="font-bold text-white">{t(label)}:</p>
      {children && children}
      {value && <p className="text-white">{value}</p>}
    </div>
  )
}
