import {
  contributorAbi,
  contributorAddress,
  sequoiaContributorAbi,
  sequoiaContributorAddress
} from '@renderer/services/contracts'
import { ContributorProps } from '@renderer/types/contributor'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { UserTypeContentProps } from '../UserTypeContent'
import { UserCanVote } from '../UserCanVote/UserCanVote'
import { HeaderUser } from '../HeaderUser/HeaderUser'
import { InvitationCard } from '../Cards/InvitationCard/InvitationCard'
import { ValidationsCard } from '../Cards/ValidationsCard/ValidationsCard'
import { useInviterPenalties } from '@renderer/domain/Community/useCases/useInviterPenalties'

export function ContributorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const { penalties: inviterPenalties } = useInviterPenalties({ address })

  const { data } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'getContributor',
    args: [address]
  })
  const contributor = data as ContributorProps

  const { data: responsePenalties } = useReadContract({
    address: chainId === 250225 ? contributorAddress : sequoiaContributorAddress,
    abi: chainId === 250225 ? contributorAbi : sequoiaContributorAbi,
    functionName: 'totalPenalties',
    args: [address]
  })
  const totalPenalties = responsePenalties
    ? parseInt(formatUnits(BigInt(responsePenalties as string), 0))
    : 0

  return (
    <div className="flex flex-col pb-10">
      <HeaderUser
        address={address}
        areaPhotoUpdated={() => {}}
        name={contributor?.name}
        userType={5}
        proofPhoto={contributor?.proofPhoto}
      />

      {contributor && (
        <div className="flex gap-5 mt-5 max-w-[1024px]">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2 rounded-2xl bg-green-card p-3">
              <p className="text-gray-300 text-sm">{t('common.data')}</p>
              <p className="text-white">
                <span className="text-white font-bold">ID: </span>
                {formatUnits(BigInt(contributor?.id), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.proofPhoto')}: </span>
                {contributor?.proofPhoto}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.level')}: </span>
                {formatUnits(BigInt(contributor?.pool?.level), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.eraPool')}: </span>
                {formatUnits(BigInt(contributor?.pool?.currentEra), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('account.registeredAt')}: </span>
                {formatUnits(BigInt(contributor?.createdAt), 0)}
              </p>
              <p className="text-white">
                <span className="text-white font-bold">{t('common.userType')}: </span> 5
              </p>

              <UserCanVote address={address} />

              <p className="text-red-500">
                <span className="font-bold">{t('account.penalties')}: </span>
                {totalPenalties}
              </p>

              <p className="text-red-500">
                <span className="font-bold">{t('account.inviterPenalties')}: </span>
                {inviterPenalties}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1 max-w-[450px]">
            <InvitationCard address={address} />
            <ValidationsCard address={address} profilePage={profilePage} />
          </div>
        </div>
      )}
    </div>
  )
}
