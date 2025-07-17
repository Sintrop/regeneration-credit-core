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
    <div className="flex flex-col p-3 rounded-2xl bg-green-card mt-5 gap-1">
      <p className="text-gray-300 text-sm">{t('invitation')}</p>
      {invitationData && (
        <>
          <CardData label="inviter">
            <UserAddressLink address={invitationData?.inviter} />
          </CardData>
          <CardData
            label="invitedAt"
            value={formatUnits(BigInt(invitationData?.createdAtBlock), 0)}
          />
          <CardData label="userType" value={invitationData?.userType} />
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
