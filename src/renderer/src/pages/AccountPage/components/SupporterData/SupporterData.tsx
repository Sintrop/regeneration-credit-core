import {
  sequoiaSupporterAbi,
  sequoiaSupporterAddress,
  supporterAbi,
  supporterAddress
} from '@renderer/services/contracts'
import { SupporterProps } from '@renderer/types/supporter'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../InvitationCard/InvitationCard'

export function SupporterData({ address }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? supporterAddress : sequoiaSupporterAddress,
    abi: chainId === 250225 ? supporterAbi : sequoiaSupporterAbi,
    functionName: 'getSupporter',
    args: [address]
  })

  const supporter = data as SupporterProps

  return (
    <div className="flex flex-col">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={supporter.name}
        userType={7}
        proofPhoto={supporter.profilePhoto}
      />

      {supporter && (
        <div className="flex gap-10 mt-5">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">{t('id')}: </span>
                {formatUnits(BigInt(supporter?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('registeredAt')}: </span>
                {formatUnits(BigInt(supporter?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('userType')}: </span> 7
              </p>
            </div>

            <InvitationCard address={address} />
          </div>
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'reductionCommitments']}
        name={supporter && supporter?.name}
        userType={7}
      />
    </div>
  )
}
