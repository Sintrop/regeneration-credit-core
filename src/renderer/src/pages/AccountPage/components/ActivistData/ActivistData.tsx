import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { ActivistProps } from '@renderer/types/activist'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { DelationsCard } from '../Cards/DelationsCard/DelationsCard'

export function ActivistData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { data } = useReadContract({
    address: chainId === 250225 ? activistAddress : sequoiaActivistAddress,
    abi: chainId === 250225 ? activistAbi : sequoiaActivistAbi,
    functionName: 'getActivist',
    args: [address]
  })

  const activist = data as ActivistProps

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={activist?.name}
        userType={6}
        proofPhoto={activist?.proofPhoto}
      />

      {activist && (
        <div className="flex gap-5 mt-5 max-w-[1024px]">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('common.data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">ID: </span>
                {formatUnits(BigInt(activist?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.proofPhoto')}: </span>
                {activist?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.level')}: </span>
                {formatUnits(BigInt(activist?.pool?.level), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.eraPool')}: </span>
                {formatUnits(BigInt(activist?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.registeredAt')}: </span>
                {formatUnits(BigInt(activist?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.userType')}: </span> 6
              </p>

              <UserCanVote address={address} />
            </div>

            <DelationsCard address={address} />
          </div>

          <div className="flex flex-col gap-5 max-w-[450px]">
            <InvitationCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
