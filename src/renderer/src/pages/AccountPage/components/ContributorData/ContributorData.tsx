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
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UserContentTabs } from '../Tabs/UserContentTabs'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { UserCanVote } from '../UserCanVote/UserCanVote'

export function ContributorData({ address, profilePage }: UserTypeContentProps): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

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
    <div className="flex flex-col">
      <ProofPhoto address={address} hash={contributor && contributor?.proofPhoto} />

      {contributor && (
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-white mt-5">{address}</p>
            <p className="text-white">
              <span className="text-white font-bold">{t('id')}: </span>
              {formatUnits(BigInt(contributor?.id), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('name')}: </span>
              {contributor?.name}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('proofPhoto')}: </span>
              {contributor?.proofPhoto}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('level')}: </span>
              {formatUnits(BigInt(contributor?.pool?.level), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('eraPool')}: </span>
              {formatUnits(BigInt(contributor?.pool?.currentEra), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('registeredAt')}: </span>
              {formatUnits(BigInt(contributor?.createdAt), 0)}
            </p>
            <p className="text-white">
              <span className="text-white font-bold">{t('userType')}: </span> 5
            </p>

            <UserCanVote address={address} />

            <p className="text-red-500">
              <span className="font-bold">{t('penalties')}: </span>
              {totalPenalties}
            </p>
          </div>

          {!profilePage && <VoteToInvalidate resourceType="user" userWallet={address} />}
        </div>
      )}

      <UserContentTabs
        address={address}
        availableTabs={['certificates', 'invitation', 'contributions', 'validations']}
      />
    </div>
  )
}
